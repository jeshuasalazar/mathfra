import { Reveal } from "@/components/ui/reveal";
import { Txt } from "@/components/ui/txt";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { horariosIntro } from "@/content/home";
import { horarios } from "@/content/oferta";
import { SectionHead } from "./section-head";

export function HorariosTabla() {
  return (
    <ul className="mf-rows" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {horarios.map((h) => (
        <li key={h.group} className="mf-row">
          <h3 className="mf-h3">{h.group}</h3>
          <dl style={{ display: "grid", gap: 4, margin: 0, gridTemplateColumns: "auto 1fr", columnGap: 16 }}>
            <dt style={{ fontWeight: 700 }}>Días</dt><dd style={{ margin: 0 }}><Txt>{h.days}</Txt></dd>
            <dt style={{ fontWeight: 700 }}>Horario</dt><dd style={{ margin: 0 }}><Txt>{h.time}</Txt></dd>
            <dt style={{ fontWeight: 700 }}>Modalidad</dt><dd style={{ margin: 0 }}>{h.modality}</dd>
            <dt style={{ fontWeight: 700 }}>Inicio</dt><dd style={{ margin: 0 }}><Txt>{h.start}</Txt></dd>
          </dl>
        </li>
      ))}
    </ul>
  );
}

export function Horarios() {
  return (
    <section className="mf-section mf-band" id="horarios" aria-labelledby="t-horarios">
      <Reveal className="mf-container mf-split mf-split--title">
        <SectionHead id="t-horarios" eyebrow={horariosIntro.eyebrow} title={horariosIntro.title} lead={horariosIntro.lead}>
          <div><WhatsAppButton place="horarios" label="Apartar mi lugar por WhatsApp" /></div>
        </SectionHead>
        <HorariosTabla />
      </Reveal>
    </section>
  );
}
