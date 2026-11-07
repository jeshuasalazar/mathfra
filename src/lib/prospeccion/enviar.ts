/**
 * Paso 5 · Contactar por el canal legal: correo 1 a 1 con Resend (dominio verificado).
 * WhatsApp NUNCA en frío (solo el enlace wa.me dentro del correo). Llamadas: solo tras revisar el REPEP, a mano.
 * Antes de cada envío se vuelve a revisar: pausa, lista de bajas, estado del prospecto y pie legal.
 */
import { Resend } from "resend";
import { config, type Entorno } from "./config.ts";
import { armarCorreoFinal } from "./legal.ts";
import { ESTADOS_ACTIVOS } from "./secuencia.ts";
import { esperar } from "./reintentos.ts";
import type { Db } from "./repo.ts";
import { leerAjustes } from "./repo.ts";

let resend: Resend | null = null;

export type ResultadoEnvio = { ok: true } | { ok: false; motivo: string };

/** Envía UN envío ya aprobado (o creado fuera de modo revisión). Lo usan el worker y el botón «Aprobar» del panel. */
export async function enviarUno(db: Db, envioId: string, env: Entorno): Promise<ResultadoEnvio> {
  if (env.pausado || (await leerAjustes(db)).pausado) return { ok: false, motivo: "prospección en pausa" };
  const { data: e } = await db.from("envios").select("*, prospectos(*)").eq("id", envioId).maybeSingle();
  if (!e) return { ok: false, motivo: "no existe" };
  if (e.estado !== "aprobado") return { ok: false, motivo: `estado ${e.estado}` };
  const p = e.prospectos;
  const cancelar = async (motivo: string) => {
    await db.from("envios").update({ estado: "cancelado", error: motivo }).eq("id", envioId);
    return { ok: false as const, motivo };
  };
  if (!p || !ESTADOS_ACTIVOS.has(p.estado)) return cancelar(`prospecto en estado ${p?.estado}`);
  const para = String(e.para).toLowerCase();
  const { data: baja } = await db.from("bajas").select("id").or(`correo.eq."${para}",dominio.eq."${para.split("@")[1]}"`).limit(1);
  if (baja?.length) return cancelar("está en la lista de bajas");

  let final;
  try {
    final = armarCorreoFinal({ asunto: e.asunto, texto: e.texto }, { correo: para, fuentes: p.fuentes || [] }, env);
  } catch (err) {
    // Falta algo legal: NO se envía, queda aprobado para reintentar cuando completes el dato.
    await db.from("envios").update({ error: (err as Error).message }).eq("id", envioId);
    return { ok: false, motivo: (err as Error).message };
  }

  resend ??= new Resend(env.resendKey!);
  const { data, error } = await resend.emails.send({
    from: env.from!, to: para, replyTo: env.replyTo!, subject: final.asunto, text: final.texto, html: final.html, headers: final.headers,
  });
  if (error) {
    await db.from("envios").update({ estado: "fallido", error: `${error.name}: ${error.message}`.slice(0, 500) }).eq("id", envioId);
    return { ok: false, motivo: error.message };
  }
  const ahora = new Date().toISOString();
  await db.from("envios").update({ estado: "enviado", enviado_en: ahora, proveedor_id: data?.id ?? null, error: null }).eq("id", envioId);
  await db.from("prospectos").update({ estado: "en_secuencia", ultimo_contacto_en: ahora, actualizado_en: ahora }).eq("id", p.id);
  return { ok: true };
}

/** Envía los aprobados cuya hora ya llegó, con límite por corrida y espera entre correos. */
export async function enviarAprobados(db: Db, env: Entorno): Promise<{ enviados: number; avisos: string[] }> {
  const { data } = await db.from("envios").select("id").eq("estado", "aprobado").lte("programado_para", new Date().toISOString())
    .order("programado_para").limit(config.limites.enviosPorCorrida);
  let enviados = 0;
  const avisos: string[] = [];
  for (const { id } of data || []) {
    const r = await enviarUno(db, id, env);
    if (r.ok) enviados++;
    else {
      avisos.push(`Envío ${id.slice(0, 8)}: ${r.motivo}`);
      if (/pausa|faltan datos legales/.test(r.motivo)) break; // no tiene caso seguir intentando
    }
    await esperar(config.limites.esperaEntreEnviosMs);
  }
  return { enviados, avisos };
}

/** Correo simple para avisarte a ti (interesados, errores, resumen). */
export async function avisarme(env: Entorno, asunto: string, texto: string): Promise<void> {
  if (!env.resendKey || !env.from) { console.info(`[aviso sin correo] ${asunto}\n${texto}`); return; }
  resend ??= new Resend(env.resendKey);
  await resend.emails.send({ from: env.from, to: env.avisoA, subject: `[Prospección] ${asunto}`, text: texto });
}
