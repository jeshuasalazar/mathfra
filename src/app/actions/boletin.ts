"use server";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { newsletterSchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import { newToken, unsubscribeToken } from "@/lib/tokens";
import { forwardToAgent } from "@/lib/agent-webhook";
import { site } from "@/content/site";
import { BoletinConfirmar } from "@/emails/templates";
import type { FormState } from "./contacto";

export async function suscribirBoletin(raw: unknown, turnstileToken?: string): Promise<FormState> {
  const h = await headers();
  const ip = await clientIp(h);
  if (!rateLimit(`boletin:${ip}`, 3, 10 * 60 * 1000).ok) return { ok: false, message: "Demasiados intentos. Prueba en unos minutos." };

  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { ok: false, message: "Revisa los campos marcados.", fieldErrors };
  }
  if (parsed.data.website) return { ok: true, message: "Revisa tu correo para confirmar." };
  if (!(await verifyTurnstile(turnstileToken, ip))) return { ok: false, message: "No pudimos comprobar que eres una persona. Recarga e intenta otra vez." };

  const email = parsed.data.email.toLowerCase();
  const token = newToken();
  const db = supabaseAdmin();
  if (db) {
    const { data: existing } = await db.from("suscriptores").select("estado").eq("email", email).maybeSingle();
    if (existing?.estado === "confirmado") return { ok: true, message: "Ese correo ya está suscrito. Gracias." };
    const { error } = await db.from("suscriptores").upsert(
      { email, estado: "pendiente", token_confirmacion: token, token_baja: unsubscribeToken(email), consentimiento_en: new Date().toISOString(), baja_en: null,
        ip_hash: createHash("sha256").update(ip).digest("hex").slice(0, 32) },
      { onConflict: "email" },
    );
    if (error) return { ok: false, message: "No pudimos registrarte. Intenta más tarde." };
  }
  const confirmUrl = `${site.url}/api/v1/boletin/confirmar?token=${token}`;
  const unsubscribeUrl = `${site.url}/api/v1/boletin/baja?t=${unsubscribeToken(email)}`;
  await sendEmail(email, "Confirma tu suscripción · Mathfra", BoletinConfirmar({ confirmUrl, unsubscribeUrl }));
  await forwardToAgent("boletin", { email, estado: "pendiente" });
  return { ok: true, message: "Te mandamos un correo. Abre el enlace para confirmar tu suscripción." };
}
