import React, { useState } from "react";
import { Icon } from "../actions/Icon.jsx";
/** Barra de navegación: escritorio (enlaces + CTA) y celular (botón menú + panel). */
export function Navbar({ links = [], ctaHref = "#", theme = "light", onToggleTheme, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return <header className="mf-nav">
    <div className="mf-container mf-nav__bar">
      <a className="mf-brand" href="/" aria-label="Mathfra, inicio">Mathfra<span className="mf-brand__dot" aria-hidden="true" /></a>
      <nav aria-label="Principal"><ul className="mf-nav__links">{links.map(l => <li key={l.href}><a href={l.href} aria-current={l.current ? "page" : undefined}>{l.label}</a></li>)}</ul></nav>
      <button className="mf-iconbtn" type="button" onClick={onToggleTheme} aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}><Icon name={theme === "dark" ? "sun" : "moon"} /></button>
      <a className="mf-btn mf-btn--primary mf-btn--sm mf-nav__cta" href={ctaHref}><Icon name="whatsapp" />Escríbenos por WhatsApp</a>
      <button className="mf-iconbtn mf-nav__toggle" type="button" aria-expanded={open} aria-controls="mf-menu" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"}><Icon name={open ? "x" : "menu"} /></button>
    </div>
    <div className="mf-nav__menu" id="mf-menu" hidden={!open}>
      <div className="mf-container">
        <ul>{links.map(l => <li key={l.href}><a href={l.href} onClick={() => setOpen(false)}>{l.label}<Icon name="arrow-right" /></a></li>)}</ul>
        <a className="mf-btn mf-btn--primary mf-btn--lg mf-btn--block" href={ctaHref}><Icon name="whatsapp" />Escríbenos por WhatsApp</a>
      </div>
    </div>
  </header>;
}
