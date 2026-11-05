import { Reveal } from "@/components/ui/reveal";
import { temarioIntro } from "@/content/home";
import { areas, fuenteExamen } from "@/content/examen";
import { SectionHead } from "./section-head";

/** Temario: cómo se reparten los 128 reactivos, con lo difícil marcado. */
export function Temario({ detailed = false }: { detailed?: boolean }) {
  const ordered = [...areas].sort((a, b) => Number(b.focus) - Number(a.focus));
  return (
    <section className="mf-section mf-band" id="temario" aria-labelledby="t-temario">
      <Reveal className="mf-container mf-stack">
        <SectionHead id="t-temario" eyebrow={temarioIntro.eyebrow} title={temarioIntro.titleBefore} mark={temarioIntro.titleMark} after={temarioIntro.titleAfter} lead={temarioIntro.lead} />
        <ul className="mf-rows" style={{ listStyle: "none", margin: "24px 0 0", padding: 0 }}>
          {ordered.map((a) => (
            <li key={a.slug} className="mf-subject">
              <div className="mf-subject__head">
                <h3 style={{ fontFamily: "var(--mf-font-body)", fontWeight: 700, fontSize: "1.0625rem" }}>
                  {a.name}
                  {a.focus && <span className="mf-badge mf-badge--accent" style={{ marginLeft: 10, verticalAlign: "middle" }}>Va primero</span>}
                </h3>
                <span className="mf-small" style={{ display: "flex", gap: 10, alignItems: "center", color: "var(--mf-color-text-soft)" }}>
                  <span className={`mf-meter${a.focus ? " mf-meter--focus" : ""}`} aria-hidden="true">
                    {Array.from({ length: a.reactivos }, (_, i) => <i key={i} />)}
                  </span>
                  <strong style={{ color: "var(--mf-color-text)" }}>{a.reactivos}</strong> reactivos
                </span>
              </div>
              {(detailed || a.focus) && <p className="mf-small" style={{ color: "var(--mf-color-text-soft)" }}>{a.temas.join(" · ")}</p>}
            </li>
          ))}
        </ul>
        <p className="mf-small" style={{ color: "var(--mf-color-text-soft)" }}>Fuente: {fuenteExamen}</p>
      </Reveal>
    </section>
  );
}
