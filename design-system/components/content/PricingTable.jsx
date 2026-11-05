import React from "react";
import { Icon } from "../actions/Icon.jsx";
export function PricingTable({ plans = [], ctaHref = "#" }) {
  return <div className="mf-pricing">{plans.map(p =>
    <article key={p.name} className={`mf-card mf-plan${p.featured ? " mf-plan--featured" : ""}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <h3 className="mf-h3">{p.name}</h3>{p.featured && <span className="mf-badge mf-badge--primary">Recomendado</span>}
      </div>
      <p className="mf-plan__price">{p.price} <small>{p.period}</small></p>
      {p.summary && <p style={{ color: "var(--mf-color-text-soft)" }}>{p.summary}</p>}
      <ul>{p.features.map(f => <li key={f}><Icon name="check" />{f}</li>)}</ul>
      <a className={`mf-btn mf-btn--${p.featured ? "primary" : "secondary"} mf-btn--block`} href={p.href || ctaHref}>{p.featured && <span className="mf-icon mf-i-whatsapp" aria-hidden="true" />}{p.cta || "Preguntar por este curso"}</a>
    </article>)}</div>;
}
