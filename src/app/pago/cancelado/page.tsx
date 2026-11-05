import Link from "next/link";
import type { Metadata } from "next";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = { title: "Pago cancelado", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Pago</p>
        <h1 id="titulo" className="mf-h1">No se hizo ningún cargo.</h1>
        <p className="mf-lead">Cancelaste el pago. Si tuviste algún problema o prefieres transferencia, escríbenos y lo resolvemos.</p>
        <div className="mf-hero__actions"><WhatsAppButton place="pago/cancelado" size="lg" /><Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link></div>
      </div>
    </section>
  );
}
