/**
 * Orquestador. Dos tipos de corrida (el cron de Railway corre cada hora):
 *  - semanal (lunes 8:00 CDMX): encontrar → limpiar → calificar → guardar → personalizar → cola/envío → resumen.
 *  - horaria: respuestas y bajas, seguimientos (día 3 y 10), envíos aprobados y borrado a los 12 meses.
 * Cada paso va en su propio try: si uno falla, los demás siguen y el error llega en el aviso.
 */
import { createHmac } from "node:crypto";
import { config, entorno, type Entorno } from "./config.ts";
import { encontrar } from "./encontrar.ts";
import { limpiar } from "./limpiar.ts";
import { calificar } from "./calificar.ts";
import { lineaWhatsapp, personalizar, seguimiento } from "./personalizar.ts";
import { faltantesLegales } from "./legal.ts";
import { pasoQueToca, esHorarioDeEnvio } from "./secuencia.ts";
import { clasificar, leerBuzon, soloRespuesta } from "./respuestas.ts";
import { avisarme, enviarAprobados } from "./enviar.ts";
import { cargarListas, darDeBaja, enModoRevision, guardarProspecto, leerAjustes, prospectoDeRemitente, type Db } from "./repo.ts";
import type { Prospecto } from "./tipos.ts";

export type Bitacora = { tipo: string; nuevos: number; enviados: number; respuestas: number; interesados: number; bajas: number; costoUsd: number; avisos: string[] };

const nueva = (tipo: string): Bitacora => ({ tipo, nuevos: 0, enviados: 0, respuestas: 0, interesados: 0, bajas: 0, costoUsd: 0, avisos: [] });

async function paso(b: Bitacora, nombre: string, fn: () => Promise<void>) {
  try { await fn(); } catch (e) { b.avisos.push(`${nombre}: ${(e as Error).message}`); }
}

/** Crea el envío del paso indicado; en modo revisión queda pendiente de tu aprobación. */
async function encolar(db: Db, prospectoId: string, para: string, pasoN: number, cuerpo: { asunto: string; texto: string; generadoPor: "ia" | "plantilla"; costoUsd: number }, revision: boolean) {
  const { error } = await db.from("envios").insert({
    prospecto_id: prospectoId, paso: pasoN, para, asunto: cuerpo.asunto, texto: cuerpo.texto, generado_por: cuerpo.generadoPor,
    costo_usd: cuerpo.costoUsd, estado: revision ? "pendiente_aprobacion" : "aprobado",
  });
  if (error && error.code !== "23505") throw new Error(`encolar: ${error.message}`);
}

export async function corridaSemanal(db: Db, env: Entorno = entorno()): Promise<Bitacora> {
  const b = nueva("semanal");
  if (env.pausado || (await leerAjustes(db)).pausado) { b.avisos.push("Prospección en pausa: no se buscó ni se envió nada."); return b; }
  const revision = await enModoRevision(db, config.revisionDias);
  const faltan = faltantesLegales(env);
  if (faltan.length) b.avisos.push(`Los correos quedan en cola pero NO saldrán hasta completar: ${faltan.join("; ")}`);

  let prospectos: (Prospecto & { id: string })[] = [];
  await paso(b, "Encontrar/limpiar/calificar", async () => {
    const r = await encontrar(env);
    b.avisos.push(...r.avisos);
    b.costoUsd += r.costoUsd;
    const listas = await cargarListas(db);
    const desde = new Date(); desde.setDate(1);
    const { count } = await db.from("envios").select("id", { count: "exact", head: true }).eq("estado", "enviado").gte("enviado_en", desde.toISOString());
    const { limpios } = await limpiar(r.candidatos, listas, { env, correosEsteMes: count ?? 0 });
    for (const p of limpios.map(calificar).sort((a, c) => c.puntos - a.puntos)) {
      const id = await guardarProspecto(db, p);
      if (id) { prospectos.push({ ...p, id }); b.nuevos++; }
    }
  });

  await paso(b, "Personalizar", async () => {
    const beneficio = process.env.PROSPECCION_BENEFICIO_ALIADO?.trim() || undefined;
    const elegibles = prospectos.filter((p) => p.correo && p.nivel !== "frio").slice(0, config.limites.nuevosPorSemana);
    for (const p of elegibles) {
      const c = await personalizar(p, env, beneficio);
      b.costoUsd += c.costoUsd;
      await encolar(db, p.id, p.correo!, 0, { ...c, texto: `${c.texto}\n\n${lineaWhatsapp(env, p)}` }, revision);
    }
    prospectos = [];
  });

  if (esHorarioDeEnvio()) await paso(b, "Enviar", async () => { const r = await enviarAprobados(db, env); b.enviados += r.enviados; b.avisos.push(...r.avisos); });
  return b;
}

export async function procesarRespuestas(db: Db, env: Entorno, b: Bitacora): Promise<void> {
  if (!env.imap.host) { b.avisos.push("IMAP sin configurar: no se leyeron respuestas."); return; }
  for (const m of await leerBuzon(env)) {
    if (m.automatico) continue;
    const { data: ya } = await db.from("respuestas").select("id").eq("message_id", m.messageId).maybeSingle();
    if (ya) continue;
    const p = await prospectoDeRemitente(db, m.de);
    if (!p) continue; // no es un prospecto: no guardamos nada de ese correo
    const tipo = clasificar(m.texto, m.asunto);
    const extracto = soloRespuesta(m.texto).slice(0, 500);
    await db.from("respuestas").insert({ message_id: m.messageId, prospecto_id: p.id, de: m.de, asunto: m.asunto.slice(0, 200), extracto, clasificacion: tipo, recibido_en: m.fecha.toISOString() });
    b.respuestas++;
    // Cualquier respuesta detiene la secuencia.
    await db.from("envios").update({ estado: "cancelado", error: "respondió" }).eq("prospecto_id", p.id).in("estado", ["pendiente_aprobacion", "aprobado"]);
    const ahora = new Date();
    const en12 = new Date(ahora); en12.setMonth(en12.getMonth() + config.retencionMeses);
    if (tipo === "baja") {
      await darDeBaja(db, m.de, "respuesta");
      if (p.correo && p.correo !== m.de) await darDeBaja(db, p.correo, "respuesta");
      b.bajas++;
      continue;
    }
    const estado = tipo === "interesado" ? "interesado" : tipo === "no_ahora" ? "no_ahora" : "respondio";
    await db.from("prospectos").update({ estado, actualizado_en: ahora.toISOString(), borrar_en: en12.toISOString() }).eq("id", p.id);
    if (tipo === "interesado") {
      b.interesados++;
      const fuente = `prospeccion:${(p.fuentes?.[0]?.url as string) || p.web || "pagina-del-negocio"}`;
      await db.from("contactos").insert({
        nombre: String(p.nombre).slice(0, 80).padEnd(2, "."), email: m.de, telefono: p.telefono, interes: "aliado",
        mensaje: extracto || "(respondió al correo de alianza)", pagina: p.web, acepta_privacidad: false, fuente,
      });
      await avisarAgente(env, { tipo: "prospecto_interesado", nombre: p.nombre, correo: m.de, telefono: p.telefono, web: p.web, extracto });
      await avisarme(env, `Interesado: ${p.nombre}`, `${p.nombre} respondió que le interesa.\n\nCorreo: ${m.de}\nTeléfono: ${p.telefono || "—"} (antes de llamar, revisa el REPEP: https://repep.profeco.gob.mx)\nPágina: ${p.web || "—"}\n\nLo que escribió:\n${extracto}\n\nYa está en tus contactos con fuente «${fuente}».`);
    }
  }
}

/** Avisa al agente 24/7 (que te manda el WhatsApp). Firmado con HMAC, igual que los formularios del sitio. */
async function avisarAgente(env: Entorno, data: Record<string, unknown>) {
  if (!env.agentUrl || !env.agentSecret) return;
  const body = JSON.stringify({ tipo: "prospeccion", data, enviadoEn: new Date().toISOString() });
  const firma = "sha256=" + createHmac("sha256", env.agentSecret).update(body).digest("hex");
  try {
    await fetch(env.agentUrl, { method: "POST", headers: { "content-type": "application/json", "x-mathfra-signature": firma }, body, signal: AbortSignal.timeout(5000) });
  } catch { /* el correo de aviso ya cubre este caso */ }
}

async function crearSeguimientos(db: Db, b: Bitacora) {
  const revision = await enModoRevision(db, config.revisionDias);
  const { data } = await db.from("prospectos").select("id, nombre, correo, giro, giro_id, colonia, web, puntos, nivel, fuentes, estado, envios(paso, enviado_en, estado)").eq("estado", "en_secuencia").limit(500);
  for (const p of data || []) {
    const n = pasoQueToca(p.estado, p.envios || []);
    if (!n || !p.correo) continue;
    const cuerpo = seguimiento(n, { nombre: p.nombre } as Prospecto);
    await encolar(db, p.id, p.correo, n, { ...cuerpo, generadoPor: "plantilla", costoUsd: 0 }, revision);
  }
  // Tras el día 10 sin respuesta, la secuencia termina.
  const hace = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const { data: fin } = await db.from("envios").select("prospecto_id").eq("paso", 2).eq("estado", "enviado").lt("enviado_en", hace);
  const ids = (fin || []).map((x) => x.prospecto_id);
  if (ids.length) await db.from("prospectos").update({ estado: "terminado" }).in("id", ids).eq("estado", "en_secuencia");
  void b;
}

/** Borra a los 12 meses sin respuesta. La lista de bajas nunca se borra. */
async function borrarVencidos(db: Db) {
  const ahora = new Date().toISOString();
  // Incluye a quien se dio de baja: de ellos solo queda la fila mínima en «bajas», para no volver a escribirles.
  await db.from("prospectos").delete().lt("borrar_en", ahora);
  const hace12 = new Date(); hace12.setMonth(hace12.getMonth() - config.retencionMeses);
  await db.from("respuestas").delete().lt("recibido_en", hace12.toISOString());
}

export async function corridaHoraria(db: Db, env: Entorno = entorno()): Promise<Bitacora> {
  const b = nueva("horaria");
  await paso(b, "Respuestas", () => procesarRespuestas(db, env, b)); // las bajas se aplican aunque esté en pausa
  if (env.pausado || (await leerAjustes(db)).pausado) return b;
  await paso(b, "Seguimientos", () => crearSeguimientos(db, b));
  if (esHorarioDeEnvio()) await paso(b, "Enviar", async () => { const r = await enviarAprobados(db, env); b.enviados += r.enviados; b.avisos.push(...r.avisos); });
  await paso(b, "Borrado a 12 meses", () => borrarVencidos(db));
  return b;
}

export async function guardarBitacora(db: Db, b: Bitacora, inicio: Date) {
  await db.from("prospeccion_corridas").insert({
    inicio: inicio.toISOString(), fin: new Date().toISOString(), tipo: b.tipo, nuevos: b.nuevos, enviados: b.enviados,
    respuestas: b.respuestas, interesados: b.interesados, bajas: b.bajas, costo_usd: b.costoUsd, avisos: b.avisos,
  });
}

/** Paso 8 · Medir: resumen de los últimos 7 días, cada lunes después de enviar. */
export async function resumenSemanal(db: Db, env: Entorno, b: Bitacora) {
  const desde = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: corridas } = await db.from("prospeccion_corridas").select("nuevos, enviados, respuestas, interesados, bajas, costo_usd").gte("inicio", desde);
  const t = [...(corridas || []), { nuevos: b.nuevos, enviados: b.enviados, respuestas: b.respuestas, interesados: b.interesados, bajas: b.bajas, costo_usd: b.costoUsd }]
    .reduce((s, x) => ({ nuevos: s.nuevos + x.nuevos, enviados: s.enviados + x.enviados, respuestas: s.respuestas + x.respuestas, interesados: s.interesados + x.interesados, bajas: s.bajas + x.bajas, costo: s.costo + Number(x.costo_usd) }), { nuevos: 0, enviados: 0, respuestas: 0, interesados: 0, bajas: 0, costo: 0 });
  const { count: enCola } = await db.from("envios").select("id", { count: "exact", head: true }).eq("estado", "pendiente_aprobacion");
  const texto = [
    `Semana al ${new Date().toLocaleDateString("es-MX", { timeZone: config.zonaHoraria })}`,
    "",
    `Prospectos nuevos: ${t.nuevos}`,
    `Correos enviados: ${t.enviados}`,
    `Respuestas: ${t.respuestas}`,
    `Interesados: ${t.interesados}`,
    `Bajas: ${t.bajas}`,
    `Costo estimado de la semana: US$${t.costo.toFixed(2)}`,
    "",
    `En cola esperando tu aprobación: ${enCola ?? 0} → ${env.sitio}/panel/prospeccion`,
    ...(b.avisos.length ? ["", "Avisos:", ...b.avisos.map((a) => `• ${a}`)] : []),
  ].join("\n");
  await avisarme(env, "Resumen semanal", texto);
}
