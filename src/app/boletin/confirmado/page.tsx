import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Suscripción confirmada", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Boletín</p>
        <h1 id="titulo" className="mf-h1">Ya estás en el boletín.</h1>
        <p className="mf-lead">Te avisamos de las fechas del ECOEMS y una vez al mes te mandamos un reactivo difícil resuelto. Cada correo trae un enlace para darte de baja.</p>
        <div className="mf-hero__actions"><WhatsAppButton place="boletin/confirmado" size="lg" /><Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link></div>
      </div>
    </section>
  );
}
