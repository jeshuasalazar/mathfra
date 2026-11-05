import React from "react";
import { Icon } from "./Icon.jsx";
/** Enlace de texto subrayado. inline = dentro de un párrafo. */
export function TextLink({ href, inline = false, arrow = false, disabled = false, children, ...rest }) {
  return <a className={`mf-link${inline ? " mf-link--inline" : ""}`} href={disabled ? undefined : href} aria-disabled={disabled || undefined} {...rest}>
    {children}{arrow && <Icon name="arrow-right" size="sm" />}
  </a>;
}
