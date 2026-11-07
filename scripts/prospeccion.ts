/**
 * Worker de prospección (servicio «prospeccion» en Railway, cron cada hora: `0 * * * *`).
 *   node scripts/prospeccion.ts               → automático: horaria siempre + semanal si es lunes 8:00 CDMX
 *   node scripts/prospeccion.ts semanal       → fuerza la corrida semanal (y manda el resumen)
 *   node scripts/prospeccion.ts horaria       → solo respuestas, seguimientos, envíos y borrado
 *   node scripts/prospeccion.ts prueba        → busca, limpia y califica SIN guardar ni enviar (solo necesita EXA_API_KEY)
 *   node scripts/prospeccion.ts importar archivo.csv [--guardar]
 *        → limpia y califica un CSV de aiLearning; con --guardar lo guarda y lo deja en la cola de aprobación
 * Requiere Node 22.18+ (ejecuta TypeScript sin compilar).
 */
import { readFileSync } from "node:fs";
import { config, entorno } from "../src/lib/prospeccion/config.ts";
import { encontrar } from "../src/lib/prospeccion/encontrar.ts";
import { limpiar, listasVacias } from "../src/lib/prospeccion/limpiar.ts";
import { calificar } from "../src/lib/prospeccion/calificar.ts";
import { candidatosDesdeCsv } from "../src/lib/prospeccion/importar-csv.ts";
import { lineaWhatsapp, personalizar } from "../src/lib/prospeccion/personalizar.ts";
import { cargarListas, conectar, enModoRevision, guardarProspecto } from "../src/lib/prospeccion/repo.ts";
import { corridaHoraria, corridaSemanal, guardarBitacora, resumenSemanal } from "../src/lib/prospeccion/ciclo.ts";
import { esCorridaSemanal } from "../src/lib/prospeccion/secuencia.ts";
import { avisarme } from "../src/lib/prospeccion/enviar.ts";
import type { Prospecto } from "../src/lib/prospeccion/tipos.ts";

const env = entorno();
const [cmd = "auto", ...args] = process.argv.slice(2);

function tabla(ps: Prospecto[]) {
  for (const p of ps) {
    console.log(`${String(p.puntos).padStart(3)} ${p.nivel.padEnd(8)} ${p.nombre.slice(0, 40).padEnd(40)} ${(p.correo || "—").padEnd(34)} ${p.telefono || "—"}`);
    console.log(`    ${p.motivos.join(" · ")}`);
  }
}

async function main() {
  if (cmd === "prueba") {
    const r = await encontrar(env);
    const { limpios, descartados } = await limpiar(r.candidatos, listasVacias());
    tabla(limpios.map(calificar).sort((a, b) => b.puntos - a.puntos));
    console.log(`\nDescartados: ${descartados.length}`);
    for (const d of descartados) console.log(`  ✗ ${d.nombre}: ${d.motivo}`);
    if (r.avisos.length) console.log("\nAvisos:\n  " + r.avisos.join("\n  "));
    return;
  }

  if (cmd === "importar") {
    const archivo = args.find((a) => !a.startsWith("--"));
    if (!archivo) throw new Error("Uso: node scripts/prospeccion.ts importar archivo.csv [--guardar]");
    const guardar = args.includes("--guardar");
    const db = guardar ? conectar(env) : undefined;
    const listas = db ? await cargarListas(db) : listasVacias();
    const { limpios, descartados } = await limpiar(candidatosDesdeCsv(readFileSync(archivo, "utf8")), listas);
    const ps = limpios.map(calificar).sort((a, b) => b.puntos - a.puntos);
    tabla(ps);
    console.log(`\nPasan: ${ps.length} · Descartados: ${descartados.length}`);
    for (const d of descartados) console.log(`  ✗ ${d.nombre}: ${d.motivo}`);
    if (!db) { console.log("\n(Vista previa: no se guardó nada. Agrega --guardar para guardarlos y ponerlos en la cola.)"); return; }
    const revision = await enModoRevision(db, config.revisionDias);
    let encolados = 0;
    for (const p of ps) {
      const id = await guardarProspecto(db, p);
      if (!id || !p.correo || p.nivel === "frio") continue;
      const c = await personalizar(p, env, process.env.PROSPECCION_BENEFICIO_ALIADO?.trim() || undefined);
      await db.from("envios").insert({ prospecto_id: id, paso: 0, para: p.correo, asunto: c.asunto, texto: `${c.texto}\n\n${lineaWhatsapp(env, p)}`, generado_por: c.generadoPor, costo_usd: c.costoUsd, estado: revision ? "pendiente_aprobacion" : "aprobado" });
      encolados++;
    }
    console.log(`\nGuardados. ${encolados} correos en ${revision ? "la cola de aprobación" : "envío automático"}.`);
    return;
  }

  const db = conectar(env);
  const inicio = new Date();
  if (cmd === "auto" || cmd === "horaria") {
    const b = await corridaHoraria(db, env);
    await guardarBitacora(db, b, inicio);
    console.log("[horaria]", JSON.stringify(b));
  }
  if (cmd === "semanal" || (cmd === "auto" && esCorridaSemanal())) {
    const ini = new Date();
    const b = await corridaSemanal(db, env);
    await resumenSemanal(db, env, b);
    await guardarBitacora(db, b, ini);
    console.log("[semanal]", JSON.stringify(b));
  }
}

main().catch(async (e) => {
  console.error("[prospección] error:", e);
  try { await avisarme(env, "Error en el worker", String((e as Error)?.stack || e)); } catch { /* sin correo */ }
  process.exit(1);
});
