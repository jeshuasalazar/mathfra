/** Acceso a Supabase (llave secreta, solo servidor). Mismas tablas para el worker y para /panel/prospeccion. */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Entorno } from "./config.ts";
import type { Prospecto } from "./tipos.ts";
import { listasVacias, type Listas } from "./limpiar.ts";
import { dominioDe, normalizarTelefono } from "./texto.ts";

export type Db = SupabaseClient;

export function conectar(env: Entorno): Db {
  if (!env.supabaseUrl || !env.supabaseSecret) throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SECRET_KEY");
  return createClient(env.supabaseUrl, env.supabaseSecret, { auth: { persistSession: false, autoRefreshToken: false } });
}

function revisar<T>(r: { data: T; error: { message: string } | null }, que: string): T {
  if (r.error) throw new Error(`${que}: ${r.error.message}`);
  return r.data;
}

/** Lee TODAS las filas de una consulta, de 1,000 en 1,000. */
async function todas<T>(q: (desde: number, hasta: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>, que: string): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; ; i += 1000) {
    const lote = revisar(await q(i, i + 999), que) || [];
    out.push(...lote);
    if (lote.length < 1000) return out;
  }
}

export async function cargarListas(db: Db): Promise<Listas> {
  const l = listasVacias();
  type Fila = { correo: string | null; dominio: string | null; telefono: string | null };
  const bajas = await todas<Fila>((a, b) => db.from("bajas").select("correo, dominio, telefono").range(a, b), "bajas");
  const excluir = await todas<Fila>((a, b) => db.from("prospeccion_excluir").select("correo, dominio, telefono").range(a, b), "exclusiones");
  for (const f of [...bajas, ...excluir]) {
    if (f.correo) l.bloqueados.correos.add(f.correo.toLowerCase());
    if (f.dominio) l.bloqueados.dominios.add(f.dominio.toLowerCase());
    const t = normalizarTelefono(f.telefono);
    if (t) l.bloqueados.telefonos.add(t);
  }
  // Clientes actuales: quien ya pagó o ya nos escribió por el formulario.
  const pagos = await todas<{ email: string | null }>((a, b) => db.from("pagos").select("email").eq("estado", "pagado").range(a, b), "pagos");
  const contactos = await todas<{ email: string | null; telefono: string | null }>((a, b) => db.from("contactos").select("email, telefono").range(a, b), "contactos");
  for (const f of [...pagos, ...contactos]) if (f.email) l.bloqueados.correos.add(f.email.toLowerCase());
  for (const f of contactos) { const t = normalizarTelefono(f.telefono); if (t) l.bloqueados.telefonos.add(t); }

  const prev = await todas<{ clee: string | null; dominio: string | null; telefono: string | null }>((a, b) => db.from("prospectos").select("clee, dominio, telefono").range(a, b), "prospectos");
  for (const f of prev) {
    if (f.clee) l.existentes.clees.add(f.clee);
    if (f.dominio) l.existentes.dominios.add(f.dominio);
    if (f.telefono) l.existentes.telefonos.add(f.telefono);
  }
  return l;
}

export async function guardarProspecto(db: Db, p: Prospecto): Promise<string | undefined> {
  const { data, error } = await db.from("prospectos").insert({
    clee: p.clee ?? null, nombre: p.nombre, giro_id: p.giroId, giro: p.giro, tamano: p.tamano ?? null, colonia: p.colonia ?? null,
    direccion: p.direccion ?? null, lat: p.lat ?? null, lon: p.lon ?? null, km: p.km ?? null, telefono: p.telefono ?? null,
    correo: p.correo ?? null, correo_verificado: p.correoVerificado ?? null, web: p.web ?? null, dominio: p.dominio ?? null,
    puntos: p.puntos, nivel: p.nivel, motivos: p.motivos, fuentes: p.fuentes,
  }).select("id").single();
  if (error) {
    if (error.code === "23505") return undefined; // duplicado (índice único): lo ignoramos
    throw new Error(`guardar prospecto: ${error.message}`);
  }
  return data.id as string;
}

export type Ajustes = { pausado: boolean; revision_hasta: string | null };

export async function leerAjustes(db: Db): Promise<Ajustes> {
  const { data } = await db.from("prospeccion_ajustes").select("pausado, revision_hasta").eq("id", 1).maybeSingle();
  return data ?? { pausado: false, revision_hasta: null };
}

/** Las 2 primeras semanas todo pasa por la cola de aprobación. Se fija en la primera corrida. */
export async function enModoRevision(db: Db, dias: number, ahora = new Date()): Promise<boolean> {
  const a = await leerAjustes(db);
  if (!a.revision_hasta) {
    const hasta = new Date(ahora.getTime() + dias * 24 * 60 * 60 * 1000).toISOString();
    await db.from("prospeccion_ajustes").upsert({ id: 1, revision_hasta: hasta, actualizado_en: ahora.toISOString() });
    return true;
  }
  return ahora < new Date(a.revision_hasta);
}

/** Baja permanente e inmediata: lista de bajas + prospecto en «baja» + cancela todo lo pendiente. */
export async function darDeBaja(db: Db, correo: string, origen: "enlace" | "respuesta" | "manual" | "queja") {
  const c = correo.trim().toLowerCase();
  const dominio = c.split("@")[1];
  await db.from("bajas").upsert({ correo: c, dominio, origen }, { onConflict: "correo", ignoreDuplicates: true });
  const { data: ps } = await db.from("prospectos").select("id, telefono, dominio").or(`correo.eq."${c.replace(/"/g, "")}",dominio.eq."${dominio.replace(/"/g, "")}"`);
  for (const p of ps || []) {
    await db.from("prospectos").update({ estado: "baja", actualizado_en: new Date().toISOString() }).eq("id", p.id);
    await db.from("envios").update({ estado: "cancelado" }).eq("prospecto_id", p.id).in("estado", ["pendiente_aprobacion", "aprobado"]);
    if (p.telefono) await db.from("bajas").insert({ telefono: p.telefono, dominio: p.dominio, origen });
  }
}

/** Busca el prospecto de quien respondió: por correo exacto o por el dominio de su correo. */
export async function prospectoDeRemitente(db: Db, de: string) {
  const c = de.toLowerCase();
  const { data } = await db.from("prospectos").select("*").eq("correo", c).maybeSingle();
  if (data) return data;
  const dom = dominioDe(c.split("@")[1]);
  if (!dom) return null;
  const r = await db.from("prospectos").select("*").eq("dominio", dom).limit(1).maybeSingle();
  return r.data;
}
