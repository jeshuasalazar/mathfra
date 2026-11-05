import React from "react";
import { Icon } from "../actions/Icon.jsx";
const AREAS = ["Habilidad verbal", "Habilidad matemática", "Español", "Historia", "Geografía", "Formación cívica y ética", "Matemáticas", "Física", "Química", "Biología"];
/** Portada: titular con marcatexto + mapa de áreas ECOEMS con las difíciles marcadas. */
export function Hero({ eyebrow, title, mark, subtitle, ctaHref = "#", secondaryHref = "#metodo", focus = ["Habilidad matemática", "Matemáticas", "Física", "Química"] }) {
  const [a, b] = title.split(mark);
  return <section className="mf-hero"><div className="mf-container mf-hero__grid">
    <div>
      <p className="mf-eyebrow">{eyebrow}</p>
      <h1 className="mf-hero__title">{a}<span className="mf-mark">{mark}</span>{b}</h1>
      <p className="mf-lead">{subtitle}</p>
      <div className="mf-hero__actions">
        <a className="mf-btn mf-btn--primary mf-btn--lg" href={ctaHref}><Icon name="whatsapp" />Escríbenos por WhatsApp</a>
        <a className="mf-btn mf-btn--secondary mf-btn--lg" href={secondaryHref}>Ver cómo funciona<Icon name="arrow-down" /></a>
      </div>
    </div>
    <div className="mf-areas" aria-label="Áreas del examen ECOEMS; marcadas las que trabajamos primero">
      <div className="mf-areas__head"><strong>Áreas del ECOEMS</strong><span className="mf-badge mf-badge--accent"><Icon name="target" size="sm" />Empezamos aquí</span></div>
      <ol>{AREAS.map(x => <li key={x} className={focus.includes(x) ? "is-focus" : ""}>{x}{focus.includes(x) && <Icon name="arrow-right" size="sm" />}</li>)}</ol>
    </div>
  </div></section>;
}
