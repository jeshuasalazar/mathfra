import React from "react";
export function Footer({ address = "Santa Clara", groups = [], legal = [], year = new Date().getFullYear() }) {
  return <footer className="mf-footer">
    <div className="mf-container">
      <div className="mf-footer__grid">
        <div><a className="mf-brand" href="/">Mathfra<span className="mf-brand__dot" aria-hidden="true" /></a>
          <p style={{ marginTop: 12, color: "#B4C0D9", maxWidth: "36ch" }}>Cursos de ingreso ECOEMS en {address}.</p></div>
        {groups.map(g => <div key={g.title}><p className="mf-footer__title">{g.title}</p><ul>{g.links.map(l => <li key={l.label}><a href={l.href}>{l.label}</a></li>)}</ul></div>)}
      </div>
      <div className="mf-footer__legal"><span>© {year} Mathfra</span>{legal.map(l => <a key={l.label} href={l.href}>{l.label}</a>)}</div>
    </div>
  </footer>;
}
