"use client";
import { animate } from "motion/mini";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Entrada de sección: opacidad 0→1 y 12 px hacia arriba, una sola vez (DESIGN.md §5).
 * El HTML del servidor siempre es visible; solo se oculta lo que está fuera de pantalla tras hidratar.
 * Usa Motion mini (WAAPI) para no cargar el motor completo en el inicio.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(el, { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0px)"] }, { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }).finished.then(() => {
          el.style.opacity = "";
          el.style.transform = "";
        });
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref} className={className}>{children}</div>;
}
