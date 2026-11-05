import "server-only";
import { env } from "./env";

/** Verifica el token de Cloudflare Turnstile. Sin llave configurada, no bloquea (modo desarrollo). */
export async function verifyTurnstile(token: string | undefined, ip: string) {
  if (!env.turnstileSecret) return process.env.NODE_ENV !== "production" || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret: env.turnstileSecret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
