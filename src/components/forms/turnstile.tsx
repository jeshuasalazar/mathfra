"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, o: { sitekey: string; callback: (t: string) => void; "expired-callback": () => void; language?: string; theme?: string; appearance?: string }) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

/** Cloudflare Turnstile (anti-bots, necesario). Sin NEXT_PUBLIC_TURNSTILE_SITE_KEY no se muestra. */
export function Turnstile({ onToken, resetKey }: { onToken: (t: string) => void; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    let id: string | undefined;
    const mount = () => {
      if (!window.turnstile || !ref.current) return;
      ref.current.innerHTML = "";
      id = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY, language: "es", appearance: "interaction-only",
        callback: onToken, "expired-callback": () => onToken(""),
      });
    };
    if (window.turnstile) mount();
    else {
      let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
      if (!s) { s = document.createElement("script"); s.src = SRC; s.async = true; document.head.appendChild(s); }
      s.addEventListener("load", mount);
    }
    return () => { if (id) window.turnstile?.remove(id); };
  }, [onToken, resetKey]);
  if (!SITE_KEY) return null;
  return <div ref={ref} className="mf-turnstile" />;
}
