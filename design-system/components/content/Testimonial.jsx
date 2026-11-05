import React from "react";
/** Testimonio: solo personas reales con permiso. Sin fotos de stock; iniciales en vez de avatar. */
export function Testimonial({ quote, name, meta, initials, placeholder = false }) {
  return <figure className="mf-card mf-quote">
    {placeholder && <span className="mf-badge mf-badge--warning" style={{ justifySelf: "start" }}>Ejemplo · reemplazar por testimonio real</span>}
    <blockquote>«{quote}»</blockquote>
    <figcaption><span className="mf-quote__avatar" aria-hidden="true">{initials || name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>
      <span><span className="mf-quote__name">{name}</span><br /><span className="mf-quote__meta">{meta}</span></span></figcaption>
  </figure>;
}
