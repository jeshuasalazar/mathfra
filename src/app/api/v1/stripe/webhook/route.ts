import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { forwardToAgent } from "@/lib/agent-webhook";
import { planes, IVA } from "@/content/oferta";
import { Recibo } from "@/emails/templates";

/** Webhook verificado de Stripe: registra el pago y manda el recibo cuando el cobro se confirma (tarjeta u OXXO). */
export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !env.stripeWebhookSecret) return new Response("No configurado", { status: 503 });
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, req.headers.get("stripe-signature") || "", env.stripeWebhookSecret);
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  const db = supabaseAdmin();
  const s = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded" || event.type === "checkout.session.async_payment_failed") {
    const pagado = s.payment_status === "paid";
    const fallido = event.type === "checkout.session.async_payment_failed";
    const plan = planes.find((p) => p.slug === s.metadata?.plan);
    const total = (s.amount_total || 0) / 100;
    const metodo = s.payment_method_types?.includes("oxxo") && !pagado ? "oxxo" : (s.payment_method_types?.[0] ?? "card");
    await db?.from("pagos").upsert({
      stripe_session_id: s.id, plan: s.metadata?.plan || "desconocido", email: s.customer_details?.email,
      nombre: s.customer_details?.name, total_centavos: s.amount_total || 0, moneda: s.currency || "mxn", metodo,
      estado: fallido ? "fallido" : pagado ? "pagado" : "pendiente",
      terminos_aceptados_en: s.metadata?.terminos_aceptados_en || new Date().toISOString(),
    }, { onConflict: "stripe_session_id" });

    if (pagado && s.customer_details?.email) {
      const iva = Math.round((total - total / (1 + IVA)) * 100) / 100;
      await sendEmail(s.customer_details.email, "Recibo de pago · Mathfra", Recibo({
        nombre: s.customer_details.name || "", plan: plan?.name || "Curso", totalMXN: total, ivaMXN: iva,
        folio: s.id.slice(-10).toUpperCase(), metodo: metodo === "oxxo" ? "OXXO" : "Tarjeta",
      }));
      await forwardToAgent("pago", { plan: s.metadata?.plan, total, email: s.customer_details.email });
    }
  }
  return Response.json({ received: true });
}
