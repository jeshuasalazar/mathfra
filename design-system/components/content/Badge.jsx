import React from "react";
import { Icon } from "../actions/Icon.jsx";
export function Badge({ tone = "neutral", icon, children }) {
  return <span className={`mf-badge${tone !== "neutral" ? ` mf-badge--${tone}` : ""}`}>{icon && <Icon name={icon} size="sm" />}{children}</span>;
}
