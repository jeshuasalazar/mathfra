import { mdSlugs, pageMarkdown } from "@/lib/markdown";

export function generateStaticParams() {
  return mdSlugs.map((slug) => ({ slug }));
}

/** Copia en Markdown de cada página clave (enlazada con rel="alternate" type="text/markdown"). Se sirve en /<página>.md */
export async function GET(_req: Request, ctx: RouteContext<"/md/[slug]">) {
  const { slug } = await ctx.params;
  const md = pageMarkdown(slug);
  if (!md) return new Response("No encontrado", { status: 404 });
  return new Response(md, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
