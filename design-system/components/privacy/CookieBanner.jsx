import React from "react";
/** Aviso de cookies. Los 3 botones usan el MISMO estilo y tamaño (sin patrón oscuro). */
export function CookieBanner({ onAccept, onReject, onConfigure, isStatic = false }) {
  return <section className={`mf-cookie${isStatic ? " mf-cookie--static" : ""}`} role="region" aria-label="Aviso de cookies">
    <p><strong>Usamos cookies</strong> para que el sitio funcione y, si aceptas, para medir qué páginas se visitan. Tú decides. <a className="mf-link--inline" href="/cookies">Más información</a></p>
    <div className="mf-cookie__actions">
      <button className="mf-btn mf-btn--secondary mf-btn--sm" type="button" onClick={onAccept}>Aceptar</button>
      <button className="mf-btn mf-btn--secondary mf-btn--sm" type="button" onClick={onReject}>Rechazar</button>
      <button className="mf-btn mf-btn--secondary mf-btn--sm" type="button" onClick={onConfigure}>Configurar</button>
    </div>
  </section>;
}
