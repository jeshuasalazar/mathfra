import { PageHeader } from "@/components/layout/page-header";
import { CtaFinal } from "@/components/sections/cta-final";
import { Txt } from "@/components/ui/txt";
import { causaTexto } from "@/content/paginas";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("nuestra-causa");
export default function Page() {
  return (
    <>
      <PageHeader page="nuestra-causa" />
      <section className="mf-section" aria-label="Nuestra causa">
        <div className="mf-container">
          <div className="mf-prose" style={{ fontSize: "var(--mf-text-lead)" }}>
            {causaTexto.parrafos.map((p) => <p key={p}>{p}</p>)}
            <p className="mf-card mf-card--flat" style={{ fontSize: "1rem" }}><Txt>{causaTexto.compromiso}</Txt></p>
          </div>
        </div>
      </section>
      <CtaFinal />
    </>
  );
}
