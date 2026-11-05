import React from "react";
import { Icon } from "../actions/Icon.jsx";
/** Acordeón nativo <details>: accesible con teclado sin JS. */
export function FaqAccordion({ items = [], name = "faq" }) {
  return <div className="mf-faq">{items.map((it, i) =>
    <details key={it.q} name={name} open={it.open}>
      <summary>{it.q}<Icon name="plus" /></summary>
      <div className="mf-faq__body"><p>{it.a}</p></div>
    </details>)}</div>;
}
