import Link from "next/link";
import { JsonLd } from "@/components/ui/json-ld";
import { breadcrumbLd } from "@/lib/seo";
import { paginas, type PageKey } from "@/content/paginas";
import type { ReactNode } from "react";

/** Encabezado de página interior con migas (y su BreadcrumbList). */
export function PageHeader({ page, children }: { page: PageKey; children?: ReactNode }) {
  const p = paginas[page];
  const crumbs = [{ name: "Inicio", path: "/" }, { name: p.name, path: p.path }];
  return (
    <section className="mf-page-head" aria-labelledby="titulo">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <div className="mf-container">
        <nav className="mf-crumbs" aria-label="Migas de pan">
          <ol>
            <li><Link href="/">Inicio</Link></li>
            <li aria-current="page">{p.name}</li>
          </ol>
        </nav>
        <p className="mf-eyebrow" style={{ marginTop: 24 }}>{p.eyebrow}</p>
        <h1 id="titulo">{p.h1}</h1>
        <p className="mf-lead">{p.lead}</p>
        {children && <div className="mf-hero__actions">{children}</div>}
      </div>
    </section>
  );
}
