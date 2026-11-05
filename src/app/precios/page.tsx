import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PricingTable } from "@/components/sections/pricing";
import { FaqList } from "@/components/sections/faq";
import { SectionHead } from "@/components/sections/section-head";
import { CtaFinal } from "@/components/sections/cta-final";
import { Txt } from "@/components/ui/txt";
import { pagosInfo } from "@/content/oferta";
import { faq } from "@/content/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("precios");
export default function Page() {
  return (
    <>
      <PageHeader page="precios" />
      <section className="mf-section" aria-labelledby="t-planes">
        <div className="mf-container mf-stack">
          <h2 id="t-planes" className="mf-sr-only">Planes</h2>
          <PricingTable />
        </div>
      </section>
      <section className="mf-section mf-band" aria-labelledby="t-pago">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-pago" eyebrow="Pago" title="Cómo pagas y qué incluye el precio." />
          <dl className="mf-rows" style={{ margin: 0 }}>
            {[
              ["Formas de pago", pagosInfo.formas], ["Meses", pagosInfo.meses], ["Impuestos", pagosInfo.iva],
              ["Cobros recurrentes", pagosInfo.recurrente], ["Entrega", pagosInfo.entrega],
              ["Cancelación", "5 días hábiles después de pagar para cancelar sin costo. Garantía de 90 días si el curso no se da como se ofreció."],
            ].map(([k, v]) => (
              <div key={k} className="mf-row"><dt style={{ fontWeight: 700 }}>{k}</dt><dd style={{ margin: 0 }}><Txt>{v}</Txt></dd></div>
            ))}
          </dl>
        </div>
      </section>
      <section className="mf-section" aria-labelledby="t-dudas">
        <div className="mf-container mf-split mf-split--title">
          <SectionHead id="t-dudas" eyebrow="Dudas" title="Antes de pagar.">
            <p><Link className="mf-link" href="/terminos-y-condiciones">Términos y condiciones de compra</Link></p>
          </SectionHead>
          <FaqList items={faq.filter((f) => /cuesta|arrepiento|garantizan|tiempo/i.test(f.q))} />
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
