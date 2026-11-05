import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Baja del boletín", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Boletín</p>
        <h1 id="titulo" className="mf-h1">Te diste de baja.</h1>
        <p className="mf-lead">Ya no te enviaremos el boletín. Si fue un error, puedes suscribirte otra vez desde el inicio.</p>
        <div className="mf-hero__actions"><WhatsAppButton place="boletin/baja" size="lg" /><Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link></div>
      </div>
    </section>
  );
}
