import { Reveal } from "@/components/ui/reveal";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { boletin } from "@/content/home";
import { SectionHead } from "./section-head";

export function Boletin() {
  return (
    <section className="mf-section mf-section--tight" id="boletin" aria-labelledby="t-boletin">
      <Reveal className="mf-container">
        <div className="mf-card mf-split" style={{ borderWidth: 3 }}>
          <SectionHead id="t-boletin" eyebrow={boletin.eyebrow} title={boletin.title} lead={boletin.text} />
          <NewsletterForm />
        </div>
      </Reveal>
    </section>
  );
}
