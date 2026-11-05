"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";

type Consent = { necesarias: true; analitica: boolean; marketing: boolean; fecha: string; version: 1 };
const KEY = "mathfra-cookies";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;
const UMAMI_SRC = process.env.NEXT_PUBLIC_UMAMI_SRC;
const UMAMI_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

function read(): Consent | null {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || "null") as Consent | null;
    if (!c || c.version !== 1 || Date.now() - new Date(c.fecha).getTime() > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

/** Carga scripts no esenciales SOLO tras consentimiento (bloqueo previo). */
function applyConsent(c: Consent) {
  if (c.analitica && UMAMI_SRC && UMAMI_ID && !document.getElementById("umami")) {
    const s = document.createElement("script");
    s.id = "umami";
    s.src = UMAMI_SRC;
    s.defer = true;
    s.dataset.websiteId = UMAMI_ID;
    s.dataset.analytics = "umami";
    document.head.appendChild(s);
  }
  // Publicidad: no hay scripts de marketing todavía. Si se agrega Google, usar Consent Mode v2 aquí.
}

/** Aviso de cookies propio: «Aceptar», «Rechazar» y «Configurar» con el mismo peso (DESIGN.md §6). */
export function CookieConsent() {
  const [banner, setBanner] = useState(false);
  const [modal, setModal] = useState(false);
  const [analitica, setAnalitica] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const close = () => {
    setModal(false);
    returnFocus.current?.focus?.();
  };

  useEffect(() => {
    const c = read();
    // Leer localStorage solo es posible tras hidratar; el aviso aparece después del primer render.
    /* eslint-disable react-hooks/set-state-in-effect */
    if (c) {
      setAnalitica(c.analitica);
      setMarketing(c.marketing);
      applyConsent(c);
    } else {
      setBanner(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    const open = () => {
      returnFocus.current = document.activeElement as HTMLElement;
      const cur = read();
      setAnalitica(!!cur?.analitica);
      setMarketing(!!cur?.marketing);
      setModal(true);
    };
    window.addEventListener("mathfra:cookie-prefs", open);
    return () => window.removeEventListener("mathfra:cookie-prefs", open);
  }, []);

  useEffect(() => {
    document.body.toggleAttribute("data-cookie-open", banner);
    document.body.toggleAttribute("data-modal-open", modal);
    if (!modal) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") {
        const f = document.querySelectorAll<HTMLElement>(".mf-modal button, .mf-modal input:not([disabled]), .mf-modal a");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, banner]);

  const save = (a: boolean, m: boolean) => {
    const prev = read();
    const c: Consent = { necesarias: true, analitica: a, marketing: m, fecha: new Date().toISOString(), version: 1 };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {}
    setAnalitica(a);
    setMarketing(m);
    setBanner(false);
    close();
    // Si se retira un permiso ya dado, recargamos para descargar los scripts.
    if (prev && ((prev.analitica && !a) || (prev.marketing && !m))) window.location.reload();
    else applyConsent(c);
  };

  return (
    <>
      {banner && !modal && (
        <section className="mf-cookie" aria-label="Aviso de cookies" data-testid="cookie-banner">
          <p>
            <strong>Usamos cookies</strong> para que el sitio funcione y, si aceptas, para medir de forma anónima qué páginas se visitan. Tú decides.{" "}
            <Link className="mf-link--inline" href="/politica-de-cookies">Política de cookies</Link>
          </p>
          <div className="mf-cookie__actions">
            <button className="mf-btn mf-btn--secondary mf-btn--sm" type="button" onClick={() => save(true, true)}>Aceptar</button>
            <button className="mf-btn mf-btn--secondary mf-btn--sm" type="button" onClick={() => save(false, false)}>Rechazar</button>
            <button
              className="mf-btn mf-btn--secondary mf-btn--sm"
              type="button"
              onClick={(e) => { returnFocus.current = e.currentTarget; setModal(true); }}
            >
              Configurar
            </button>
          </div>
        </section>
      )}
      {modal && (
        <div className="mf-modal-backdrop" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="mf-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title" aria-describedby="ck-desc">
            <div className="mf-modal__head">
              <h2 id="ck-title" className="mf-h3">Preferencias de cookies</h2>
              <button ref={closeRef} className="mf-iconbtn" type="button" aria-label="Cerrar" onClick={close}>
                <Icon name="x" />
              </button>
            </div>
            <p id="ck-desc" className="mf-small" style={{ color: "var(--mf-color-text-soft)" }}>
              Elige qué permites. Puedes cambiarlo cuando quieras desde el pie de página.
            </p>
            <div className="mf-modal__list">
              <label className="mf-check" htmlFor="ck-nec">
                <input type="checkbox" id="ck-nec" checked disabled readOnly />
                <span className="mf-check__text"><strong>Necesarias</strong><small>Hacen que el sitio funcione. Siempre activas.</small></span>
              </label>
              <label className="mf-check" htmlFor="ck-an">
                <input type="checkbox" id="ck-an" checked={analitica} onChange={(e) => setAnalitica(e.target.checked)} />
                <span className="mf-check__text"><strong>Medición</strong><small>Cuentan visitas de forma anónima (Umami, sin cookies).</small></span>
              </label>
              <label className="mf-check" htmlFor="ck-mk">
                <input type="checkbox" id="ck-mk" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} />
                <span className="mf-check__text"><strong>Publicidad</strong><small>Medirían si llegaste desde un anuncio. Hoy no usamos ninguna.</small></span>
              </label>
            </div>
            <div className="mf-modal__foot">
              <button className="mf-btn mf-btn--secondary" type="button" onClick={() => save(false, false)}>Rechazar todo</button>
              <button className="mf-btn mf-btn--secondary" type="button" onClick={() => save(analitica, marketing)}>Guardar selección</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
