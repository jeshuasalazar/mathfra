import React from "react";
import { Icon } from "./Icon.jsx";
/** Botón flotante de WhatsApp. compact = solo ícono (celular con scroll). */
export function WhatsAppFab({ phone = "520000000000", message = "Hola, quiero información del curso ECOEMS.", compact = false, label = "Escríbenos", isStatic = false }) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  return <a className={`mf-fab${compact ? " mf-fab--compact" : ""}${isStatic ? " mf-fab--static" : ""}`} href={href} target="_blank" rel="noopener" aria-label={compact ? "Escríbenos por WhatsApp" : undefined}>
    <Icon name="whatsapp" /><span className="mf-fab__label">{label}</span>
  </a>;
}
