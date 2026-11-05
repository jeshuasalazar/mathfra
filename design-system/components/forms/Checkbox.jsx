import React from "react";
export function Checkbox({ id, label, description, error, ...rest }) {
  return <label className="mf-check" htmlFor={id}>
    <input type="checkbox" id={id} aria-invalid={error ? true : undefined} {...rest} />
    <span className="mf-check__text">{label}{description && <small>{description}</small>}</span>
  </label>;
}
