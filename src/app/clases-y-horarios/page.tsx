import { PageHeader } from "@/components/layout/page-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { HorariosTabla } from "@/components/sections/horarios";
import { MetodoSteps } from "@/components/sections/metodo";
import { SectionHead } from "@/components/sections/section-head";
import { CtaFinal } from "@/components/sections/cta-final";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("clases-y-horarios");
export default function Page() {
  return (
    <>
      <PageHeader page="clases-y-horarios"><WhatsAppButton place="horarios-encabezado" label="Apartar mi lugar por WhatsApp" size="lg" /></PageHeader>
      <section className="mf-section" aria-labelledby="t-grupos">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-grupos" eyebrow="Grupos" title="Grupos y horarios." lead="Todos los grupos siguen el mismo plan semanal." />
          <HorariosTabla />
        </div>
      </section>
      <section className="mf-section mf-band" aria-labelledby="t-clase">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-clase" eyebrow="Cómo es una clase" title="Cada semana, en este orden." />
          <MetodoSteps />
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
