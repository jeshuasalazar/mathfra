import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "./env";

export function sign(body: string, secret: string) {
  return "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
}

export function verifySignature(body: string, signature: string | null, secret: string) {
  if (!signature) return false;
  const a = Buffer.from(sign(body, secret));
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Reenvía cada formulario al agente de IA (AGENTE_WEBHOOK_URL), firmado con HMAC-SHA256
 * en el encabezado X-Mathfra-Signature. Desactivado mientras no haya URL.
 */
export async function forwardToAgent(tipo: "contacto" | "boletin" | "pago", data: Record<string, unknown>) {
  if (!env.agentUrl || !env.agentSecret) return { forwarded: false };
  const body = JSON.stringify({ tipo, data, enviadoEn: new Date().toISOString() });
  try {
    const res = await fetch(env.agentUrl, {
      method: "POST",
      headers: { "content-type": "application/json", "x-mathfra-signature": sign(body, env.agentSecret) },
      body,
      signal: AbortSignal.timeout(5000),
    });
    return { forwarded: res.ok };
  } catch {
    return { forwarded: false };
  }
}
