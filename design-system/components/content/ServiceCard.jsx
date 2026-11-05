import React from "react";
import { Icon } from "../actions/Icon.jsx";
export function ServiceCard({ icon = "target", eyebrow, title, description, points = [], children }) {
  return <article className="mf-card mf-service">
    <span className="mf-service__icon"><Icon name={icon} /></span>
    {eyebrow && <p className="mf-eyebrow">{eyebrow}</p>}
    <h3 className="mf-h3">{title}</h3>
    {description && <p style={{ color: "var(--mf-color-text-soft)" }}>{description}</p>}
    {points.length > 0 && <ul>{points.map(p => <li key={p}><Icon name="check" />{p}</li>)}</ul>}
    {children}
  </article>;
}
