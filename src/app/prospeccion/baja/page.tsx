import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = { title: "Baja confirmada", robots: { index: false } };

export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 760 }}>
        <p className="mf-eyebrow">Correos de Mathfra</p>
        <h1 id="titulo" className="mf-h1">Listo: no volveremos a escribirles.</h1>
        <p className="mf-lead">
          Su correo quedó en nuestra lista de bajas de forma permanente. Si el enlace no funcionó, respondan «baja» a cualquier correo nuestro
          o escriban a <a className="mf-link" href={`mailto:${site.email}?subject=baja`}>{site.email}</a> y lo resolvemos el mismo día.
        </p>
      </div>
    </section>
  );
}
