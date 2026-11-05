import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel", robots: { index: false } };

async function PanelContent() {
  const supabase = await supabaseServer();
  if (!supabase) redirect("/entrar");
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");
  const { data: pagos } = await supabase.from("pagos").select("plan, estado, total_centavos, creado_en").order("creado_en", { ascending: false });
  return (
    <div className="mf-stack">
      <p className="mf-lead">Entraste como {user.email}.</p>
      <h2 className="mf-h3">Tus cursos y pagos</h2>
      {pagos && pagos.length ? (
        <ul className="mf-rows" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {pagos.map((p) => (
            <li key={p.creado_en} className="mf-row">
              <strong>{p.plan}</strong>
              <span>{(p.total_centavos / 100).toLocaleString("es-MX", { style: "currency", currency: "MXN" })} · {p.estado}</span>
            </li>
          ))}
        </ul>
      ) : <p>Aún no tienes cursos. Cuando pagues, aparecen aquí.</p>}
      <form action="/auth/salir" method="post"><button className="mf-btn mf-btn--secondary" type="submit">Salir</button></form>
    </div>
  );
}

export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 820 }}>
        <p className="mf-eyebrow">Panel</p>
        <h1 id="titulo" className="mf-h1">Tu avance.</h1>
        <Suspense fallback={<p>Cargando…</p>}><PanelContent /></Suspense>
      </div>
    </section>
  );
}
