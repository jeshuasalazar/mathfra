import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Enlace no válido", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Boletín</p>
        <h1 id="titulo" className="mf-h1">Este enlace ya no sirve.</h1>
        <p className="mf-lead">Puede que ya hayas confirmado o que el enlace haya caducado. Suscríbete otra vez desde el inicio.</p>
        <div className="mf-hero__actions"><WhatsAppButton place="boletin/enlace-invalido" size="lg" /><Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link></div>
      </div>
    </section>
  );
}
