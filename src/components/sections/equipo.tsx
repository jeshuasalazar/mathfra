import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { equipoIntro } from "@/content/home";
import { equipo } from "@/content/oferta";
import { SectionHead } from "./section-head";

export function Equipo() {
  return (
    <section className="mf-section" id="equipo" aria-labelledby="t-equipo">
      <Reveal className="mf-container mf-stack">
        <SectionHead id="t-equipo" eyebrow={equipoIntro.eyebrow} title={equipoIntro.title} />
        {equipo.length ? (
          <ul className="grid gap-6" style={{ listStyle: "none", padding: 0, margin: "24px 0 0", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
            {equipo.map((p) => (
              <li key={p.name} className="mf-card mf-stack">
                <span className="mf-quote__avatar" aria-hidden="true">{p.initials}</span>
                <h3 className="mf-h3">{p.name}</h3>
                <p className="mf-eyebrow">{p.role}</p>
                <p style={{ color: "var(--mf-color-text-soft)" }}>{p.bio}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mf-card mf-card--flat" style={{ marginTop: 24, maxWidth: 760 }}><Txt>{equipoIntro.empty}</Txt></p>
        )}
      </Reveal>
    </section>
  );
}
