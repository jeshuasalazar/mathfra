import Link from "next/link";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { footerNav } from "@/content/site";

export default function NotFound() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 820 }}>
        <p className="mf-eyebrow">Error 404</p>
        <h1 id="titulo" className="mf-h1">Esta página no existe, pero <span className="mf-mark">tu lugar sí</span>.</h1>
        <p className="mf-lead">Quizá el enlace cambió. Esto es lo que más buscan:</p>
        <ul className="mf-rows" style={{ listStyle: "none", padding: 0, margin: "8px 0 16px" }}>
          {footerNav.flatMap((g) => g.items).slice(0, 6).map((i) => (
            <li key={i.href} style={{ padding: "4px 20px" }}><Link className="mf-link" href={i.href}>{i.label}</Link></li>
          ))}
        </ul>
        <div className="mf-hero__actions" style={{ marginTop: 0 }}>
          <WhatsAppButton place="404" size="lg" />
          <Link className="mf-btn mf-btn--secondary mf-btn--lg" href="/">Ir al inicio</Link>
        </div>
      </div>
    </section>
  );
}
