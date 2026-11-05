import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { Icon } from "@/components/ui/icon";
import { testimoniosIntro } from "@/content/home";
import { testimonios } from "@/content/oferta";
import { site } from "@/content/site";
import { SectionHead } from "./section-head";

/** Solo testimonios reales con permiso. Mientras no haya, la sección queda lista con [COMPLETAR]. */
export function Testimonios() {
  return (
    <section className="mf-section" id="testimonios" aria-labelledby="t-testimonios">
      <Reveal className="mf-container mf-stack" >
        <SectionHead id="t-testimonios" eyebrow={testimoniosIntro.eyebrow} title={testimoniosIntro.title} />
        {testimonios.length > 0 ? (
          <div className="grid gap-6" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", marginTop: 24 }}>
            {testimonios.map((t) => (
              <figure key={t.name} className="mf-card mf-quote">
                <blockquote>«{t.quote}»</blockquote>
                <figcaption>
                  <span className="mf-quote__avatar" aria-hidden="true">{t.initials}</span>
                  <span><span className="mf-quote__name">{t.name}</span><br /><span className="mf-quote__meta">{t.meta}</span></span>
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mf-card mf-card--flat" style={{ marginTop: 24, display: "flex", gap: 12, alignItems: "flex-start", maxWidth: 760 }}>
            <Icon name="quote" size="lg" />
            <p><Txt>{testimoniosIntro.empty}</Txt></p>
          </div>
        )}
        {site.googleReviewsUrl && (
          <p><a className="mf-link" href={site.googleReviewsUrl} target="_blank" rel="noopener">Ver reseñas en Google<Icon name="arrow-up-right" /></a></p>
        )}
      </Reveal>
    </section>
  );
}
