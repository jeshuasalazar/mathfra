import React from "react";
import { Icon } from "../actions/Icon.jsx";
export function SelectField({ id, label, options = [], placeholder = "Elige una opción", error, help, ...rest }) {
  const d = [help && `${id}-help`, error && `${id}-err`].filter(Boolean).join(" ") || undefined;
  return <div className="mf-field">
    <label className="mf-label" htmlFor={id}>{label}</label>
    {help && <p className="mf-help" id={`${id}-help`}>{help}</p>}
    <div className="mf-select-wrap">
      <select className="mf-select" id={id} aria-invalid={error ? true : undefined} aria-describedby={d} defaultValue="" {...rest}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
      <Icon name="chevron-down" />
    </div>
    {error && <p className="mf-errmsg" id={`${id}-err`}><Icon name="alert" />{error}</p>}
  </div>;
}
