import { Icon } from "@/components/ui/icon";
import { MarkedTitle } from "@/components/ui/marked-title";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { hero } from "@/content/home";
import { areas } from "@/content/examen";
import { site, cta } from "@/content/site";

/** Portada: abre con el mapa de las 10 áreas del ECOEMS (lo más característico de este mundo). */
export function Hero() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-hero__grid">
        <div>
          <p className="mf-eyebrow">{hero.eyebrow}</p>
          <MarkedTitle as="h1" id="titulo" className="mf-hero__title" before={hero.titleBefore} mark={hero.titleMark} after={hero.titleAfter} />
          <p className="mf-lead">{hero.lead}</p>
          <div className="mf-hero__actions">
            <WhatsAppButton place="portada" size="lg" />
            <a className="mf-btn mf-btn--secondary mf-btn--lg" href="#servicios">
              {cta.secondaryHow}<Icon name="arrow-down" />
            </a>
          </div>
          <p className="mf-hero__note"><Icon name="timer" size="sm" />{site.responseNote}</p>
        </div>
        <div className="mf-areas" role="group" aria-label="Áreas del examen ECOEMS; marcadas las que trabajamos primero">
          <div className="mf-areas__head">
            <strong>{hero.areasTitle}</strong>
            <span className="mf-badge mf-badge--accent"><Icon name="target" />{hero.areasBadge}</span>
          </div>
          <ol>
            {areas.map((a) => (
              <li key={a.slug} className={a.focus ? "is-focus" : undefined}>
                {a.name}
                {a.focus && <><span className="mf-sr-only"> (área difícil, va primero)</span><Icon name="arrow-right" size="sm" /></>}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
