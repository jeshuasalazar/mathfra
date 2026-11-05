import React from "react";
import { Icon } from "./Icon.jsx";
/** Botón neo-brutalista. primary = acción principal (1 por sección). secondary = alternativa. */
export function Button({ variant = "primary", size = "md", href, icon, iconEnd, loading = false, disabled = false, block = false, children, className = "", ...rest }) {
  const cls = ["mf-btn", `mf-btn--${variant}`, size !== "md" && `mf-btn--${size}`, block && "mf-btn--block", className].filter(Boolean).join(" ");
  const inner = <>
    {loading ? <Icon name="loader" className="mf-spin" /> : icon && <Icon name={icon} />}
    <span className="mf-btn__label">{loading ? "Enviando…" : children}</span>
    {!loading && iconEnd && <Icon name={iconEnd} />}
  </>;
  if (href && !disabled) return <a className={cls} href={href} aria-busy={loading || undefined} {...rest}>{inner}</a>;
  return <button className={cls} disabled={disabled} aria-busy={loading || undefined} type={rest.type || "button"} {...rest}>{inner}</button>;
}
