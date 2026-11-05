import { env } from "@/lib/env";
import { forwardToAgent, verifySignature } from "@/lib/agent-webhook";

/**
 * Punto de conexión para el agente de IA. Recibe un formulario firmado (X-Mathfra-Signature = HMAC-SHA256
 * del cuerpo con AGENTE_WEBHOOK_SECRET) y lo reenvía a AGENTE_WEBHOOK_URL. Inactivo hasta tener la URL.
 * Los formularios del sitio ya se reenvían solos desde el servidor; esto sirve a integraciones externas.
 */
export async function POST(req: Request) {
  if (!env.agentUrl || !env.agentSecret) return Response.json({ activo: false }, { status: 503 });
  const body = await req.text();
  if (body.length > 20_000) return new Response("Demasiado grande", { status: 413 });
  if (!verifySignature(body, req.headers.get("x-mathfra-signature"), env.agentSecret)) return new Response("Firma inválida", { status: 401 });
  let payload: { tipo?: string; data?: Record<string, unknown> };
  try { payload = JSON.parse(body); } catch { return new Response("JSON inválido", { status: 400 }); }
  const tipo = payload.tipo === "boletin" || payload.tipo === "pago" ? payload.tipo : "contacto";
  const r = await forwardToAgent(tipo, payload.data || {});
  return Response.json({ reenviado: r.forwarded }, { status: r.forwarded ? 200 : 502 });
}
