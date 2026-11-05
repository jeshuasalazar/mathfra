import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { beneficios } from "@/content/home";
import { SectionHead } from "./section-head";

/** Beneficios en filas «lo que te pasa → lo que cambia» (no tarjetas idénticas). */
export function Beneficios() {
  return (
    <section className="mf-section" aria-labelledby="t-beneficios">
      <Reveal className="mf-container mf-split mf-split--title">
        <SectionHead id="t-beneficios" eyebrow={beneficios.eyebrow} title={beneficios.titleBefore} mark={beneficios.titleMark} after={beneficios.titleAfter} lead={beneficios.lead} />
        <ul className="mf-rows" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {beneficios.items.map((b) => (
            <li key={b.gain}>
              <p className="mf-small" style={{ color: "var(--mf-color-text-soft)" }}><span className="mf-sr-only">Antes: </span>{b.pain}</p>
              <p style={{ display: "flex", gap: 10, fontWeight: 700, fontSize: "1.0625rem" }}>
                <Icon name="check" className="text-mf-success mt-1" />
                <span>{b.gain}</span>
              </p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
