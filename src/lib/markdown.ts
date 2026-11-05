import { paginas, nosotrosTexto, causaTexto, type PageKey } from "@/content/paginas";
import { site } from "@/content/site";
import { hero, beneficios, metodo } from "@/content/home";
import { servicios, planes, pagosInfo, horarios } from "@/content/oferta";
import { faq } from "@/content/faq";
import { areas, fuenteExamen, totalReactivos } from "@/content/examen";
import { avisoPrivacidad, terminos, politicaCookies, legalDisclaimer, type LegalDoc } from "@/content/legal";
import { whatsappUrl } from "./whatsapp";

const legalMd = (d: LegalDoc) =>
  [`Última actualización: ${d.updatedAt}`, d.intro, ...d.sections.flatMap((s) => [`## ${s.title}`, ...s.blocks.map((b) =>
    typeof b === "string" ? b : "list" in b ? b.list.map((i) => `- ${i}`).join("\n")
      : [`| ${b.table.head.join(" | ")} |`, `|${b.table.head.map(() => " --- ").join("|")}|`, ...b.table.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n"))]), `_${legalDisclaimer}_`];

const temarioMd = () => [`## Temario del ECOEMS (${totalReactivos} reactivos)`, ...areas.map((a) => `- **${a.name}** — ${a.reactivos} reactivos${a.focus ? " (área difícil: va primero)" : ""}: ${a.temas.join(", ")}`), `Fuente: ${fuenteExamen}`];
const faqMd = () => ["## Preguntas frecuentes", ...faq.flatMap((f) => [`### ${f.q}`, f.a])];

const bodies: Partial<Record<PageKey, () => string[]>> = {
  inicio: () => [hero.lead, "## Beneficios", ...beneficios.items.map((b) => `- ${b.gain}`), "## Método", ...metodo.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`), ...temarioMd(), ...faqMd()],
  servicios: () => servicios.flatMap((s) => [`## ${s.label}: ${s.title}`, s.text, ...s.bullets.map((b) => `- ${b}`)]).concat(temarioMd()),
  precios: () => [...planes.flatMap((p) => [`## ${p.name}`, p.priceMXN ? `${p.priceMXN} MXN, IVA incluido (${p.priceNote}).` : "Precio: [COMPLETAR]", p.summary, ...p.bullets.map((b) => `- ${b}`)]), "## Pago", pagosInfo.formas, pagosInfo.iva, pagosInfo.recurrente, pagosInfo.entrega],
  "clases-y-horarios": () => ["## Grupos", ...horarios.map((h) => `- **${h.group}:** ${h.days}, ${h.time}, ${h.modality}. Inicio: ${h.start}`)],
  nosotros: () => [nosotrosTexto.historia, ...nosotrosTexto.principios.map((p) => `- **${p.title}.** ${p.text}`)],
  "nuestra-causa": () => [...causaTexto.parrafos, causaTexto.compromiso],
  ubicacion: () => [`${site.address.street}, ${site.address.neighborhood}, ${site.address.city}, ${site.address.region}.`, `Horario: ${site.hours}`],
  contacto: () => [`- WhatsApp: ${site.whatsappDisplay} (${whatsappUrl()})`, `- Correo: ${site.email}`],
  "aviso-de-privacidad": () => legalMd(avisoPrivacidad),
  "terminos-y-condiciones": () => legalMd(terminos),
  "politica-de-cookies": () => legalMd(politicaCookies),
};

export const mdSlugs = Object.keys(paginas).map((k) => (k === "inicio" ? "index" : k));

export function pageMarkdown(slug: string) {
  const key = (slug === "index" ? "inicio" : slug) as PageKey;
  const p = paginas[key];
  if (!p) return null;
  const body = bodies[key]?.() ?? [p.lead];
  return [`# ${p.h1}`, `> ${p.description}`, p.lead, ...body, `---`, `Página: ${site.url}${p.path} · Escríbenos por WhatsApp: ${whatsappUrl({ path: p.path })}`]
    .filter(Boolean).join("\n\n") + "\n";
}
