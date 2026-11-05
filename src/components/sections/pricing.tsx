import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { IVA, planes, type Plan } from "@/content/oferta";

const mxn = (n: number) => n.toLocaleString("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 });
const paymentsOn = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === "1";

function Price({ plan }: { plan: Plan }) {
  if (plan.priceMXN === null) {
    return <p className="mf-plan__price" style={{ fontSize: "var(--mf-text-h3)" }}><Txt>[COMPLETAR: precio en MXN con IVA]</Txt></p>;
  }
  const iva = plan.priceMXN - plan.priceMXN / (1 + IVA);
  return (
    <div>
      <p className="mf-plan__price">{mxn(plan.priceMXN)} <small>MXN · {plan.priceNote}</small></p>
      <p className="mf-small" style={{ color: "var(--mf-color-text-soft)", marginTop: 6 }}>IVA incluido ({mxn(iva)}). Precio total, sin cargos extra.</p>
    </div>
  );
}

/** Planes: uno solo destacado con botón principal; cada botón abre WhatsApp con el nombre del plan. */
export function PricingTable() {
  return (
    <div className="mf-pricing">
      {planes.map((p) => (
        <article key={p.slug} className={`mf-card mf-plan${p.featured ? " mf-plan--featured" : ""}`} aria-labelledby={`plan-${p.slug}`}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <h3 className="mf-h3" id={`plan-${p.slug}`}>{p.name}</h3>
            {p.featured && <span className="mf-badge mf-badge--primary">Recomendado</span>}
          </div>
          <Price plan={p} />
          <p style={{ color: "var(--mf-color-text-soft)" }}>{p.summary}</p>
          <ul>{p.bullets.map((b) => <li key={b}><Icon name="check" /><span><Txt>{b}</Txt></span></li>)}</ul>
          <WhatsAppButton place={`plan-${p.slug}`} label={p.waLabel} extra={`Me interesa el curso ${p.name}.`} variant={p.featured ? "primary" : "secondary"} icon={p.featured} block />
          {paymentsOn && p.priceMXN !== null && (
            <form action="/api/v1/checkout" method="post" className="mf-stack" style={{ gap: 8 }}>
              <input type="hidden" name="plan" value={p.slug} />
              <label className="mf-check" htmlFor={`tyc-${p.slug}`}>
                <input id={`tyc-${p.slug}`} type="checkbox" name="terminos" required />
                <span className="mf-check__text mf-small">Acepto los <Link className="mf-link--inline" href="/terminos-y-condiciones">términos y condiciones</Link> de compra.</span>
              </label>
              <button type="submit" className="mf-link" style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit", fontWeight: 700 }}>
                Pagar ahora con tarjeta u OXXO<Icon name="arrow-right" />
              </button>
            </form>
          )}
        </article>
      ))}
    </div>
  );
}
