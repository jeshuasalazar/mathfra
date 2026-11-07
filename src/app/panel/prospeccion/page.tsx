import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { adminActual } from "@/lib/prospeccion/admin.ts";
import { entorno } from "@/lib/prospeccion/config.ts";
import { faltantesLegales, pieLegal } from "@/lib/prospeccion/legal.ts";
import { conectar, leerAjustes } from "@/lib/prospeccion/repo.ts";
import type { Fuente } from "@/lib/prospeccion/tipos.ts";
import { aprobar, bajaManual, editar, pausar, rechazar } from "./acciones";

export const metadata: Metadata = { title: "Prospección", robots: { index: false } };

type FilaCola = {
  id: string; paso: number; para: string; asunto: string; texto: string; generado_por: string; creado_en: string;
  prospectos: { nombre: string; giro: string; colonia: string | null; puntos: number; nivel: string; motivos: string[]; fuentes: Fuente[]; telefono: string | null; web: string | null } | null;
};

const fecha = (s: string | null) => (s ? new Date(s).toLocaleString("es-MX", { timeZone: "America/Mexico_City", dateStyle: "medium", timeStyle: "short" }) : "—");

async function Contenido() {
  const admin = await adminActual();
  if (!admin) redirect("/panel");
  const env = entorno();
  const db = conectar(env);
  const ajustes = await leerAjustes(db);
  const faltan = faltantesLegales(env);
  const { data: cola } = await db.from("envios")
    .select("id, paso, para, asunto, texto, generado_por, creado_en, prospectos(nombre, giro, colonia, puntos, nivel, motivos, fuentes, telefono, web)")
    .eq("estado", "pendiente_aprobacion").order("creado_en").limit(50);
  const { data: corridas } = await db.from("prospeccion_corridas").select("inicio, tipo, nuevos, enviados, respuestas, interesados, bajas, costo_usd, avisos")
    .order("inicio", { ascending: false }).limit(8);
  const filas = (cola || []) as unknown as FilaCola[];
  const pausado = ajustes.pausado || env.pausado;

  return (
    <div className="mf-stack">
      <div className="mf-card mf-stack">
        <p>
          Estado: <span className={`mf-badge ${pausado ? "mf-badge--warning" : "mf-badge--success"}`}>{pausado ? "En pausa" : "Activo"}</span>{" "}
          · Modo revisión hasta: <strong>{fecha(ajustes.revision_hasta)}</strong> · Sesión: {admin}
        </p>
        {env.pausado && <p className="mf-small">La pausa está forzada con PROSPECCION_PAUSADO=1 en Railway.</p>}
        <form action={pausar}>
          <input type="hidden" name="pausado" value={ajustes.pausado ? "0" : "1"} />
          <button className="mf-btn mf-btn--secondary mf-btn--sm" type="submit">{ajustes.pausado ? "Reanudar prospección" : "Pausar prospección"}</button>
        </form>
      </div>

      {faltan.length > 0 && (
        <div className="mf-alert mf-alert--error" role="alert">
          <strong>Ningún correo sale hasta completar estos datos en Railway:</strong>
          <ul>{faltan.map((f) => <li key={f}>{f}</li>)}</ul>
        </div>
      )}

      <h2 className="mf-h3">Cola por aprobar ({filas.length})</h2>
      {!filas.length && <p>No hay correos esperando tu aprobación.</p>}
      {filas.map((e) => {
        const p = e.prospectos;
        const fuentes = p?.fuentes || [];
        let pie = "";
        try { pie = faltan.length ? "(El pie legal se agrega al enviar; faltan datos para mostrarlo.)" : pieLegal({ correo: e.para, fuentes }, env); } catch { pie = ""; }
        return (
          <article key={e.id} className="mf-card mf-stack" aria-label={`Correo para ${p?.nombre}`}>
            <p>
              <strong>{p?.nombre}</strong> · {p?.giro}{p?.colonia ? ` · ${p.colonia}` : ""} ·{" "}
              <span className="mf-badge mf-badge--primary">{p?.nivel} {p?.puntos}</span> · Toque {e.paso + 1} de 3 · {e.generado_por === "ia" ? "Escrito por IA" : "Plantilla"}
            </p>
            <p className="mf-small">Para: {e.para} · {(p?.motivos || []).join(" · ")}</p>
            <p className="mf-small">
              Fuente: {fuentes.filter((f) => f.campo === "correo" || f.campo === "web").map((f) => `${f.url} (${f.fecha})`).join(" · ") || "—"}
              {p?.telefono ? ` · Teléfono ${p.telefono}: antes de llamar, revisa el REPEP` : ""}
            </p>
            <form action={editar} className="mf-form">
              <input type="hidden" name="id" value={e.id} />
              <div className="mf-field">
                <label className="mf-label" htmlFor={`a-${e.id}`}>Asunto</label>
                <input id={`a-${e.id}`} name="asunto" className="mf-input" defaultValue={e.asunto} maxLength={120} />
              </div>
              <div className="mf-field">
                <label className="mf-label" htmlFor={`t-${e.id}`}>Texto</label>
                <textarea id={`t-${e.id}`} name="texto" className="mf-input" defaultValue={e.texto} rows={9} maxLength={2000} />
              </div>
              <div><button className="mf-btn mf-btn--secondary mf-btn--sm" type="submit">Guardar cambios</button></div>
            </form>
            <details>
              <summary>Ver pie legal que se agrega</summary>
              <pre className="mf-small" style={{ whiteSpace: "pre-wrap" }}>{pie}</pre>
            </details>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <form action={aprobar}><input type="hidden" name="id" value={e.id} /><button className="mf-btn mf-btn--primary mf-btn--sm" type="submit">Aprobar y enviar</button></form>
              <form action={rechazar}><input type="hidden" name="id" value={e.id} /><button className="mf-btn mf-btn--secondary mf-btn--sm" type="submit">Rechazar</button></form>
            </div>
          </article>
        );
      })}

      <h2 className="mf-h3">Últimas corridas</h2>
      <ul className="mf-stack" style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {(corridas || []).map((c) => (
          <li key={c.inicio} className="mf-small">
            {fecha(c.inicio)} · {c.tipo} · nuevos {c.nuevos} · enviados {c.enviados} · respuestas {c.respuestas} · interesados {c.interesados} · bajas {c.bajas} · US${Number(c.costo_usd).toFixed(3)}
            {Array.isArray(c.avisos) && c.avisos.length > 0 && <> · avisos: {c.avisos.join(" | ")}</>}
          </li>
        ))}
      </ul>

      <h2 className="mf-h3">Baja manual</h2>
      <form action={bajaManual} className="mf-form">
        <div className="mf-field">
          <label className="mf-label" htmlFor="baja-correo">Correo que pidió no recibir más mensajes</label>
          <input id="baja-correo" name="correo" type="email" className="mf-input" required />
        </div>
        <div><button className="mf-btn mf-btn--secondary mf-btn--sm" type="submit">Dar de baja</button></div>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <section className="mf-hero" aria-labelledby="titulo">
      <div className="mf-container mf-stack" style={{ maxWidth: 960 }}>
        <p className="mf-eyebrow">Panel</p>
        <h1 id="titulo" className="mf-h1">Prospección.</h1>
        <Suspense fallback={<p>Cargando…</p>}><Contenido /></Suspense>
      </div>
    </section>
  );
}
