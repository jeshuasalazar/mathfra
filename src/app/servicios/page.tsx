import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ServiceCards } from "@/components/sections/servicios";
import { MetodoSteps } from "@/components/sections/metodo";
import { SectionHead } from "@/components/sections/section-head";
import { Temario } from "@/components/sections/temario";
import { CtaFinal } from "@/components/sections/cta-final";
import { metodo } from "@/content/home";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("servicios");
export default function Page() {
  return (
    <>
      <PageHeader page="servicios"><WhatsAppButton place="servicios-encabezado" size="lg" /></PageHeader>
      <section className="mf-section" aria-labelledby="t-cursos">
        <div className="mf-container mf-stack">
          <h2 id="t-cursos" className="mf-h2">Cursos y servicios</h2>
          <div style={{ marginTop: 16 }}><ServiceCards /></div>
        </div>
      </section>
      <section className="mf-section mf-band" aria-labelledby="t-metodo">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-metodo" eyebrow={metodo.eyebrow} title={metodo.titleBefore} mark={metodo.titleMark} after={metodo.titleAfter} lead={metodo.lead} />
          <MetodoSteps />
        </div>
      </section>
      <Temario detailed />
      <CtaFinal />
    </>
  );
}
