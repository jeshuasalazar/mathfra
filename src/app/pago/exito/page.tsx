import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Pago recibido", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Pago</p>
        <h1 id="titulo" className="mf-h1">Listo, recibimos tu pedido.</h1>
        <p className="mf-lead">Si pagaste con tarjeta, te llega el recibo por correo en unos minutos. Si elegiste OXXO, paga la ficha antes de que venza; al confirmarse te mandamos el recibo. Tienes 5 días hábiles para cancelar sin costo.</p>
        <div className="mf-hero__actions"><WhatsAppButton place="pago/exito" size="lg" /><Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link></div>
      </div>
    </section>
  );
}
