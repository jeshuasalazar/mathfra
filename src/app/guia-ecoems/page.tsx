import type { Metadata } from "next";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export const metadata: Metadata = {
  title: "Guía gratis: qué estudiar primero para el ECOEMS",
  description: "Recibe por correo la guía de Mathfra con el orden en que conviene estudiar las áreas difíciles del ECOEMS.",
  alternates: { canonical: "/guia-ecoems" },
};

/** Imán «Un regalo en tu página»: guía a cambio del correo, con casilla de permiso sin marcar y doble confirmación. */
export default function Page() {
  return (
    <>
      <section className="mf-hero" aria-labelledby="titulo">
        <div className="mf-container mf-stack" style={{ maxWidth: 820 }}>
          <p className="mf-eyebrow">Guía gratis</p>
          <h1 id="titulo" className="mf-h1">Qué estudiar primero para el ECOEMS.</h1>
          <p className="mf-lead">
            Una guía corta con el orden en que conviene atacar habilidad matemática, matemáticas, física y química.
            Déjanos tu correo, confirma la suscripción y te la mandamos.
          </p>
          <p className="mf-small">[COMPLETAR: sube la guía en PDF a public/guia-ecoems.pdf y agrega su enlace al correo de bienvenida del boletín]</p>
        </div>
      </section>
      <section className="mf-section" aria-labelledby="t-form">
        <div className="mf-container mf-split">
          <div className="mf-stack">
            <h2 id="t-form" className="mf-h2">Recíbela por correo.</h2>
            <p>Solo te escribimos si marcas la casilla y confirmas desde tu correo. Te das de baja en un clic.</p>
            <p>¿Prefieres hablar? Escríbenos y te contestamos ahí mismo.</p>
            <div><WhatsAppButton place="guia-ecoems" /></div>
          </div>
          <div className="mf-card"><NewsletterForm /></div>
        </div>
      </section>
    </>
  );
}
