import "server-only";

/** Lee variables de entorno del servidor. Devuelve undefined si faltan: cada función se desactiva sola. */
export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseSecret: process.env.SUPABASE_SECRET_KEY,
  turnstileSecret: process.env.TURNSTILE_SECRET_KEY,
  resendKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM || "Mathfra <contacto@mathfra.com>",
  emailBusiness: process.env.EMAIL_TO_BUSINESS || "contacto@mathfra.com",
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  agentUrl: process.env.AGENTE_WEBHOOK_URL,
  agentSecret: process.env.AGENTE_WEBHOOK_SECRET,
  newsletterSecret: process.env.NEWSLETTER_TOKEN_SECRET || process.env.AGENTE_WEBHOOK_SECRET,
};
