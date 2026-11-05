import { PageHeader } from "@/components/layout/page-header";
import { Testimonios } from "@/components/sections/testimonios";
import { CtaFinal } from "@/components/sections/cta-final";
import { Txt } from "@/components/ui/txt";
import { casos } from "@/content/oferta";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("casos-de-exito");
export default function Page() {
  return (
    <>
      <PageHeader page="casos-de-exito" />
      <section className="mf-section" aria-labelledby="t-casos">
        <div className="mf-container mf-stack">
          <h2 id="t-casos" className="mf-h2">Historias</h2>
          {casos.length ? (
            <div className="mf-rows">{casos.map((c) => <article key={c.title}><h3 className="mf-h3">{c.title}</h3><p>{c.text}</p></article>)}</div>
          ) : (
            <p className="mf-card mf-card--flat" style={{ maxWidth: 760 }}>
              <Txt>[COMPLETAR: 2 o 3 casos reales con permiso: área en la que más subió, cuántas semanas estudió y escuela asignada. No publiques cifras sin respaldo]</Txt>
            </p>
          )}
        </div>
      </section>
      <Testimonios />
      <CtaFinal />
    </>
  );
}
