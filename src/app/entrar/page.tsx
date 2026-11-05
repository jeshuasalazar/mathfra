import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } };
export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-split">
        <div className="mf-stack">
          <p className="mf-eyebrow">Mi cuenta</p>
          <h1 id="titulo" className="mf-h1">Entra a tu panel.</h1>
          <p className="mf-lead">Te mandamos un enlace a tu correo. Sin contraseñas.</p>
        </div>
        <div className="mf-card"><LoginForm /></div>
      </div>
    </section>
  );
}
