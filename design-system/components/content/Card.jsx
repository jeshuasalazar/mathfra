import React from "react";
export function Card({ as = "div", href, flat = false, className = "", children, ...rest }) {
  const Tag = href ? "a" : as;
  const cls = ["mf-card", flat && "mf-card--flat", href && "mf-card--interactive", className].filter(Boolean).join(" ");
  return <Tag className={cls} href={href} {...rest}>{children}</Tag>;
}
