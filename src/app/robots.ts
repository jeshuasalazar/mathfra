import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Permite buscadores y rastreadores de IA; bloquea rutas privadas o técnicas. */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/api/", "/panel", "/entrar", "/auth/", "/pago/", "/boletin/"];
  const ai = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "anthropic-ai", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "CCBot", "Bingbot"];
  return {
    rules: [{ userAgent: "*", allow: "/", disallow }, ...ai.map((userAgent) => ({ userAgent, allow: "/", disallow }))],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
