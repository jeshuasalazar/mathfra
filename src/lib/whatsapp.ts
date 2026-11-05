import { site } from "@/content/site";

export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP || "12024577161").replace(/\D/g, "");

/** Enlace wa.me con mensaje prellenado que incluye la página de origen. */
export function whatsappUrl(opts: { path?: string; extra?: string } = {}) {
  const parts: string[] = [site.whatsappMessage];
  if (opts.extra) parts.push(opts.extra);
  if (opts.path) parts.push(`(Vengo de: ${site.url.replace(/^https?:\/\//, "")}${opts.path === "/" ? "" : opts.path})`);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(parts.join(" "))}`;
}
