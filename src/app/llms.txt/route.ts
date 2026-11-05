import { paginas } from "@/content/paginas";
import { site } from "@/content/site";
import { whatsappUrl } from "@/lib/whatsapp";

/** llms.txt (llmstxt.org): H1 con el nombre, resumen en cita y secciones H2 con enlaces. */
export function GET() {
  const link = (k: keyof typeof paginas) => {
    const p = paginas[k];
    return `- [${p.name}](${site.url}${p.path === "/" ? "/index" : p.path}.md): ${p.description}`;
  };
  const body = [
    `# ${site.name}`,
    `> ${site.description}`,
    `${site.name} da cursos de ingreso al bachillerato con el examen ECOEMS (Comipems) en ${site.address.city}. Su método diagnostica y trabaja primero habilidad matemática, matemáticas, física y química (52 de los 128 reactivos). La forma de contacto principal es WhatsApp: ${whatsappUrl()}. Correo: ${site.email}.`,
    `## Cursos`,
    link("servicios"), link("precios"), link("clases-y-horarios"),
    `## Sobre ${site.name}`,
    link("inicio"), link("nosotros"), link("nuestra-causa"), link("casos-de-exito"), link("ubicacion"), link("contacto"),
    `## Optional`,
    link("aviso-de-privacidad"), link("terminos-y-condiciones"), link("politica-de-cookies"),
  ].join("\n\n");
  return new Response(body + "\n", { headers: { "content-type": "text/plain; charset=utf-8" } });
}
