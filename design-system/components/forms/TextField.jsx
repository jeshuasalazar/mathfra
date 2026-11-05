import React from "react";
import { Icon } from "../actions/Icon.jsx";
/** Campo de texto con etiqueta, ayuda y error. multiline = textarea. */
export function TextField({ id, label, help, error, optional = false, multiline = false, ...rest }) {
  const d = [help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  const Tag = multiline ? "textarea" : "input";
  return <div className="mf-field">
    <label className="mf-label" htmlFor={id}>{label}{optional && <span className="mf-label__opt"> (opcional)</span>}</label>
    {help && <p className="mf-help" id={`${id}-help`}>{help}</p>}
    <Tag className="mf-input" id={id} aria-invalid={error ? true : undefined} aria-describedby={d} {...rest} />
    {error && <p className="mf-errmsg" id={`${id}-err`}><Icon name="alert" />{error}</p>}
  </div>;
}
