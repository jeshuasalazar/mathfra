import React from "react";
/** Ícono de línea Lucide (o marca WhatsApp) pintado con currentColor. Requiere styles.css. */
export function Icon({ name, size = "md", label, className = "" }) {
  const s = size === "md" ? "" : ` mf-icon--${size}`;
  return <span className={`mf-icon mf-i-${name}${s} ${className}`.trim()} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
