import "server-only";
import type { ReactElement } from "react";
import { Resend } from "resend";
import { env } from "./env";

let resend: Resend | null = null;

/** Envía un correo con Resend. Sin RESEND_API_KEY no envía y lo registra en consola. */
export async function sendEmail(to: string, subject: string, react: ReactElement, replyTo?: string) {
  if (!env.resendKey) {
    console.info(`[correo desactivado] ${subject} → ${to.replace(/(.{2}).+@/, "$1***@")}`);
    return { sent: false };
  }
  resend ??= new Resend(env.resendKey);
  const { error } = await resend.emails.send({ from: env.emailFrom, to, subject, react, replyTo });
  if (error) console.error("[correo] error", error.name);
  return { sent: !error };
}
