import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { faq } from "@/content/faq";
import { SectionHead } from "./section-head";

export function FaqList({ items = faq }: { items?: { q: string; a: string }[] }) {
  return (
    <div className="mf-faq">
      {items.map((f, i) => (
        <details key={f.q} name="faq" open={i === 0}>
          <summary>{f.q}<Icon name="plus" /></summary>
          <div className="mf-faq__body"><p><Txt>{f.a}</Txt></p></div>
        </details>
      ))}
    </div>
  );
}

export function Faq() {
  return (
    <section className="mf-section" id="preguntas" aria-labelledby="t-faq">
      <Reveal className="mf-container mf-split mf-split--title">
        <SectionHead id="t-faq" eyebrow="Preguntas frecuentes" title="Lo que nos preguntan antes de inscribirse." lead="Si tu duda no está aquí, pregúntanos por WhatsApp." />
        <FaqList />
      </Reveal>
    </section>
  );
}
