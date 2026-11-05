import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { certificacionesIntro } from "@/content/home";
import { certificaciones } from "@/content/oferta";
import { SectionHead } from "./section-head";

export function Certificaciones() {
  return (
    <section className="mf-section" id="certificaciones" aria-labelledby="t-cert">
      <Reveal className="mf-container mf-stack">
        <SectionHead id="t-cert" eyebrow={certificacionesIntro.eyebrow} title={certificacionesIntro.title} />
        {certificaciones.length ? (
          <ul className="mf-rows" style={{ listStyle: "none", padding: 0, margin: "24px 0 0" }}>
            {certificaciones.map((c) => <li key={c.name}><strong>{c.name}</strong><span>{c.detail}</span></li>)}
          </ul>
        ) : (
          <p className="mf-card mf-card--flat" style={{ marginTop: 24, maxWidth: 760 }}><Txt>{certificacionesIntro.empty}</Txt></p>
        )}
      </Reveal>
    </section>
  );
}
