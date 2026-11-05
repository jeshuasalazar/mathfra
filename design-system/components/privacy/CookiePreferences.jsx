import React, { useState } from "react";
import { Icon } from "../actions/Icon.jsx";
const CATS = [
  { id: "necesarias", label: "Necesarias", desc: "Hacen que el sitio funcione. Siempre activas.", locked: true },
  { id: "analitica", label: "Medición", desc: "Cuentan visitas de forma anónima para saber qué páginas sirven." },
  { id: "marketing", label: "Publicidad", desc: "Miden si llegaste desde un anuncio." }
];
/** Modal de preferencias de cookies. */
export function CookiePreferences({ open = true, initial = {}, onSave, onClose, isStatic = false }) {
  const [v, setV] = useState({ analitica: false, marketing: false, ...initial });
  if (!open) return null;
  return <div className={`mf-modal-backdrop${isStatic ? " mf-modal-backdrop--static" : ""}`} onClick={e => e.target === e.currentTarget && onClose && onClose()}>
    <div className="mf-modal" role="dialog" aria-modal="true" aria-labelledby="mf-ck-title">
      <div className="mf-modal__head"><h2 id="mf-ck-title" className="mf-h3">Preferencias de cookies</h2>
        <button className="mf-iconbtn" type="button" aria-label="Cerrar" onClick={onClose}><Icon name="x" /></button></div>
      <p className="mf-small" style={{ color: "var(--mf-color-text-soft)" }}>Elige qué permites. Puedes cambiarlo cuando quieras desde el pie de página.</p>
      <div className="mf-modal__list">{CATS.map(c =>
        <label key={c.id} className="mf-check" htmlFor={`ck-${c.id}`}>
          <input type="checkbox" id={`ck-${c.id}`} checked={c.locked || !!v[c.id]} disabled={c.locked} onChange={e => setV({ ...v, [c.id]: e.target.checked })} />
          <span className="mf-check__text"><strong>{c.label}</strong><small>{c.desc}</small></span>
        </label>)}</div>
      <div className="mf-modal__foot">
        <button className="mf-btn mf-btn--secondary" type="button" onClick={() => onSave && onSave({ analitica: false, marketing: false })}>Rechazar todo</button>
        <button className="mf-btn mf-btn--secondary" type="button" onClick={() => onSave && onSave(v)}>Guardar selección</button>
      </div>
    </div>
  </div>;
}
