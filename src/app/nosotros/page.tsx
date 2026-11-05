import { PageHeader } from "@/components/layout/page-header";
import { Equipo } from "@/components/sections/equipo";
import { Certificaciones } from "@/components/sections/certificaciones";
import { SectionHead } from "@/components/sections/section-head";
import { CtaFinal } from "@/components/sections/cta-final";
import { Txt } from "@/components/ui/txt";
import { nosotrosTexto } from "@/content/paginas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("nosotros");
export default function Page() {
  return (
    <>
      <PageHeader page="nosotros" />
      <section className="mf-section" aria-labelledby="t-historia">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-historia" eyebrow="Historia" title="Cómo empezamos." lead={<Txt>{nosotrosTexto.historia}</Txt>} />
          <ol className="mf-steps">
            {nosotrosTexto.principios.map((p, i) => (
              <li key={p.title} className={`mf-card mf-step${i === 0 ? " mf-step--key" : ""}`}>
                <span className="mf-step__n" aria-hidden="true">{i + 1}</span>
                <div className="mf-stack" style={{ gap: 8 }}><h3 className="mf-h3">{p.title}</h3><p>{p.text}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Equipo />
      <Certificaciones />
      <CtaFinal />
    </>
  );
}
