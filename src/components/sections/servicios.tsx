import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { metodo } from "@/content/home";
import { servicios } from "@/content/oferta";
import { MetodoSteps } from "./metodo";
import { SectionHead } from "./section-head";

export function ServiceCards({ limit }: { limit?: number }) {
  return (
    <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
      {servicios.slice(0, limit).map((s) => (
        <article key={s.slug} className="mf-card mf-service" id={s.slug}>
          <span className="mf-service__icon"><Icon name={s.icon} /></span>
          <p className="mf-eyebrow">{s.label}</p>
          <h3 className="mf-h3">{s.title}</h3>
          <p style={{ color: "var(--mf-color-text-soft)" }}>{s.text}</p>
          <ul>{s.bullets.map((b) => <li key={b}><Icon name="check" /><span><Txt>{b}</Txt></span></li>)}</ul>
        </article>
      ))}
    </div>
  );
}

/** Servicios en el inicio: el método (lo que nos distingue) y los cursos. */
export function Servicios() {
  return (
    <section className="mf-section mf-band" id="servicios" aria-labelledby="t-servicios">
      <Reveal className="mf-container mf-stack" >
        <div className="mf-split mf-split--title">
          <SectionHead id="t-servicios" eyebrow="Servicios" title={metodo.titleBefore} mark={metodo.titleMark} after={metodo.titleAfter} lead={metodo.lead} />
          <MetodoSteps />
        </div>
        <div style={{ marginTop: "var(--mf-space-12)" }}>
          <ServiceCards limit={2} />
        </div>
        <p><Link className="mf-link" href="/servicios">Ver todos los cursos y servicios<Icon name="arrow-right" /></Link></p>
      </Reveal>
    </section>
  );
}
