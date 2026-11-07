"use server";
import { refresh } from "next/cache";
import { z } from "zod";
import { adminActual } from "@/lib/prospeccion/admin.ts";
import { entorno } from "@/lib/prospeccion/config.ts";
import { conectar, darDeBaja } from "@/lib/prospeccion/repo.ts";
import { enviarUno } from "@/lib/prospeccion/enviar.ts";

const Id = z.string().uuid();

async function preparar() {
  const admin = await adminActual();
  if (!admin) throw new Error("No autorizado");
  return { admin, env: entorno(), db: conectar(entorno()) };
}

/** Aprueba y envía de inmediato (si es horario, no hay pausa y los datos legales están completos). */
export async function aprobar(form: FormData) {
  const { admin, env, db } = await preparar();
  const id = Id.parse(form.get("id"));
  await db.from("envios").update({ estado: "aprobado", aprobado_por: admin, aprobado_en: new Date().toISOString() })
    .eq("id", id).eq("estado", "pendiente_aprobacion");
  await enviarUno(db, id, env); // si no se puede enviar ahora, queda aprobado y el worker lo manda después
  refresh();
}

export async function rechazar(form: FormData) {
  const { admin, db } = await preparar();
  const id = Id.parse(form.get("id"));
  await db.from("envios").update({ estado: "rechazado", aprobado_por: admin, aprobado_en: new Date().toISOString() })
    .eq("id", id).eq("estado", "pendiente_aprobacion");
  refresh();
}

const Edicion = z.object({ id: Id, asunto: z.string().trim().min(5).max(120), texto: z.string().trim().min(30).max(2000) });

export async function editar(form: FormData) {
  const { db } = await preparar();
  const e = Edicion.parse({ id: form.get("id"), asunto: form.get("asunto"), texto: form.get("texto") });
  await db.from("envios").update({ asunto: e.asunto, texto: e.texto }).eq("id", e.id).eq("estado", "pendiente_aprobacion");
  refresh();
}

export async function pausar(form: FormData) {
  const { db } = await preparar();
  const pausado = form.get("pausado") === "1";
  await db.from("prospeccion_ajustes").upsert({ id: 1, pausado, actualizado_en: new Date().toISOString() });
  refresh();
}

/** Baja manual (p. ej., te lo pidieron por teléfono o WhatsApp). */
export async function bajaManual(form: FormData) {
  const { db } = await preparar();
  const correo = z.string().trim().toLowerCase().email().parse(form.get("correo"));
  await darDeBaja(db, correo, "manual");
  refresh();
}
