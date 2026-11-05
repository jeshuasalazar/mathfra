import { WhatsAppButton } from "@/components/layout/whatsapp-button";

/** Llamado intermedio (después de los testimonios). */
export function CtaBand({ title, text, place }: { title: string; text: string; place: string }) {
  return (
    <section className="mf-section--tight" aria-label="Escríbenos">
      <div className="mf-container">
        <div className="mf-card" style={{ display: "grid", gap: 20, alignItems: "center", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", borderWidth: 3, boxShadow: "var(--mf-shadow-lg)" }}>
          <div className="mf-stack" style={{ gap: 8 }}>
            <h2 className="mf-h3">{title}</h2>
            <p style={{ color: "var(--mf-color-text-soft)" }}>{text}</p>
          </div>
          <div><WhatsAppButton place={place} size="lg" className="max-sm:w-full" /></div>
        </div>
      </div>
    </section>
  );
}
