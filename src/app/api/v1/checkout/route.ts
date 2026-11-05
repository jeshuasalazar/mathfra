import type { NextRequest } from "next/server";
import { headers } from "next/headers";
import { planes } from "@/content/oferta";
import { site } from "@/content/site";
import { getStripe } from "@/lib/stripe";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Crea una sesión de Stripe Checkout (tarjeta + OXXO) para un plan con precio en MXN e IVA incluido. */
export async function POST(req: NextRequest) {
  const ip = await clientIp(await headers());
  if (!rateLimit(`checkout:${ip}`, 10, 10 * 60 * 1000).ok) return Response.json({ error: "Demasiados intentos." }, { status: 429 });

  const form = await req.formData();
  const plan = planes.find((p) => p.slug === form.get("plan"));
  if (!plan || plan.priceMXN === null) return Response.json({ error: "Plan no disponible." }, { status: 400 });
  if (form.get("terminos") !== "on") return Response.json({ error: "Debes aceptar los términos." }, { status: 400 });

  const stripe = getStripe();
  if (!stripe) return Response.redirect(new URL("/precios?pago=no-disponible", req.url), 303);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "es-419",
    currency: "mxn",
    allowed_payment_method_types: ["card", "oxxo"],
    payment_method_options: {
      oxxo: { expires_after_days: 3 },
      ...(process.env.STRIPE_MSI === "1" ? { card: { installments: { enabled: true } } } : {}),
    },
    line_items: [{
      quantity: 1,
      price_data: {
        currency: "mxn",
        unit_amount: Math.round(plan.priceMXN * 100),
        tax_behavior: "inclusive",
        product_data: { name: `Curso ${plan.name} · ECOEMS`, description: "Precio en MXN con IVA (16 %) incluido." },
      },
    }],
    customer_creation: "always",
    billing_address_collection: "auto",
    metadata: { plan: plan.slug, terminos_aceptados_en: new Date().toISOString() },
    success_url: `${site.url}/pago/exito?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site.url}/pago/cancelado`,
  });
  return Response.redirect(session.url!, 303);
}
