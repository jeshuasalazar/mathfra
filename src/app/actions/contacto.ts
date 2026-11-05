"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { contactSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { env } from "@/lib/env";
import { forwardToAgent } from "@/lib/agent-webhook";
import { whatsappUrl } from "@/lib/whatsapp";
import { ContactoAcuse, ContactoNegocio } from "@/emails/templates";

export type FormState = { ok: boolean; message: string; fieldErrors?: Record<string, string> };

export async function enviarContacto(raw: unknown, turnstileToken?: string): Promise<FormState> {
  const h = await headers();
  const ip = await clientIp(h);
  const limit = rateLimit(`contacto:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.ok) return { ok: false, message: `Enviaste varios mensajes seguidos. Intenta de nuevo en ${Math.ceil(limit.retryAfter / 60)} min o escríbenos por WhatsApp.` };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors };
  }
  const d = parsed.data;
  if (d.website) return { ok: true, message: "Gracias, recibimos tu mensaje." }; // bot: se descarta en silencio

  if (!(await verifyTurnstile(turnstileToken, ip))) {
    return { ok: false, message: "No pudimos comprobar que eres una persona. Recarga la página e intenta otra vez." };
  }

  const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 32);
  const db = supabaseAdmin();
  const forward = await forwardToAgent("contacto", { ...d, privacidad: true, website: undefined });
  if (db) {
    const { error } = await db.from("contactos").insert({
      nombre: d.nombre, email: d.email, telefono: d.telefono || null, interes: d.interes, mensaje: d.mensaje,
      pagina: d.pagina || null, acepta_privacidad: true, acepta_publicidad: !!d.publicidad, ip_hash: ipHash,
      reenviado_agente: forward.forwarded,
    });
    if (error) {
      console.error("[contacto] db", error.code);
      return { ok: false, message: "No pudimos guardar tu mensaje. Escríbenos por WhatsApp y te atendemos." };
    }
  }

  await Promise.allSettled([
    sendEmail(env.emailBusiness, `Nuevo mensaje: ${d.nombre}`, ContactoNegocio({ ...d, publicidad: !!d.publicidad }), d.email),
    sendEmail(d.email, "Recibimos tu mensaje · Mathfra", ContactoAcuse({ nombre: d.nombre, whatsappUrl: whatsappUrl({ path: "/contacto" }) })),
  ]);

  return { ok: true, message: "Listo, recibimos tu mensaje. Te escribimos hoy mismo." };
}
