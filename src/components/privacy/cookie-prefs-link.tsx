"use client";

/** Enlace permanente del pie que reabre las preferencias de cookies. */
export function CookiePrefsLink() {
  return (
    <button
      type="button"
      className="mf-cookie-link"
      onClick={() => window.dispatchEvent(new CustomEvent("mathfra:cookie-prefs"))}
    >
      Preferencias de cookies
    </button>
  );
}
