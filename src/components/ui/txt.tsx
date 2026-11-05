import { Fragment } from "react";

/** Muestra un texto y resalta cada [COMPLETAR: …] para que no pase desapercibido. */
export function Txt({ children }: { children: string }) {
  const parts = children.split(/(\[COMPLETAR[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[COMPLETAR") ? <span key={i} className="mf-pending">{p}</span> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}

export const isPending = (s: string) => s.includes("[COMPLETAR");
