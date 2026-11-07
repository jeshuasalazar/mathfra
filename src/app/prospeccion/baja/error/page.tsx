import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "No pudimos procesar la baja", robots: { index: false } };

export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Correos de Mathfra</p>
        <h1 id="titulo" className="mf-h1">El enlace de baja no funcionó.</h1>
        <p className="mf-lead">
          Respondan «baja» a nuestro correo o escriban a{" "}
          <a className="mf-link" href={`mailto:${site.email}?subject=baja`}>{site.email}</a>. Los damos de baja el mismo día y no volveremos a escribirles.
        </p>
      </div>
    </section>
  );
}
