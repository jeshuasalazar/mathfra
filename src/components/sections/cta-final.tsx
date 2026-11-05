import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { ctaFinal } from "@/content/home";

export function CtaFinal({ title = ctaFinal.title, text = ctaFinal.text }: { title?: string; text?: string }) {
  return (
    <section className="mf-section mf-section--ink mf-cta-final" aria-labelledby="t-cta" style={{ borderTop: "var(--mf-border-strong)" }}>
      <div className="mf-container" style={{ display: "grid", gap: "var(--mf-space-6)", justifyItems: "start" }}>
        <h2 className="mf-h1" id="t-cta" style={{ maxWidth: "16ch" }}>{title}</h2>
        <p className="mf-lead mf-on-ink-soft">{text}</p>
        <WhatsAppButton place="cta-final" size="lg" />
      </div>
    </section>
  );
}
