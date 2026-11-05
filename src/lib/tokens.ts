import "server-only";
import { createHmac, randomBytes } from "node:crypto";
import { env } from "./env";

export function newToken() {
  return randomBytes(24).toString("base64url");
}

/** Token determinístico para la baja del boletín (no requiere búsqueda previa). */
export function unsubscribeToken(email: string) {
  const secret = env.newsletterSecret || "dev-only-secret";
  return createHmac("sha256", secret).update(email.toLowerCase()).digest("base64url").slice(0, 32);
}
