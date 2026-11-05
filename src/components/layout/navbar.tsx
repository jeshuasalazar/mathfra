"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import { mainNav, footerNav } from "@/content/site";
import { WhatsAppButton } from "./whatsapp-button";

function subscribeTheme(cb: () => void) {
  const o = new MutationObserver(cb);
  o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => o.disconnect();
}

function ThemeToggle() {
  const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.getAttribute("data-theme") === "dark", () => false);
  const toggle = () => {
    const next = !dark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("mathfra-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button type="button" className="mf-iconbtn" onClick={toggle} aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [prevPath, setPrevPath] = useState(path);
  if (path !== prevPath) {
    setPrevPath(path);
    setOpen(false);
  }
  useEffect(() => {
    document.body.toggleAttribute("data-menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const all = [...mainNav, ...footerNav.flatMap((g) => g.items).filter((i) => !mainNav.some((m) => m.href === i.href))];

  return (
    <header className="mf-nav">
      <div className="mf-container mf-nav__bar">
        <Link className="mf-brand" href="/" aria-label="Mathfra, inicio">
          Mathfra<span className="mf-brand__dot" aria-hidden="true" />
        </Link>
        <nav aria-label="Principal">
          <ul className="mf-nav__links">
            {mainNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={path === i.href ? "page" : undefined}>{i.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
        <span className="mf-nav__cta">
          <WhatsAppButton place="barra" size="sm" />
        </span>
        <button
          ref={toggleRef}
          type="button"
          className="mf-iconbtn mf-nav__toggle"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "x" : "menu"} />
        </button>
      </div>
      <div className="mf-nav__menu" id="menu-movil" hidden={!open}>
        <nav className="mf-container" aria-label="Menú móvil">
          <ul>
            {all.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={path === i.href ? "page" : undefined}>
                  {i.label}<Icon name="arrow-right" />
                </Link>
              </li>
            ))}
          </ul>
          <WhatsAppButton place="menu-movil" size="lg" block />
        </nav>
      </div>
    </header>
  );
}
