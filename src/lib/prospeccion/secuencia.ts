/**
 * Paso 6 · Seguimiento. Máximo 3 toques: día 0, día 3 y día 10 (contados desde el envío del día 0).
 * Se detiene en cuanto contestan cualquier cosa, dicen «no» o se dan de baja.
 */
import { config } from "./config.ts";

const DIA = 24 * 60 * 60 * 1000;

export type EnvioHecho = { paso: number; enviado_en: string | null; estado: string };

/** Estados del prospecto en los que se puede seguir escribiendo. */
export const ESTADOS_ACTIVOS = new Set(["nuevo", "en_secuencia"]);

/** ¿Qué paso toca ahora? undefined = nada (ya terminó, aún no es tiempo, o hay uno pendiente). */
export function pasoQueToca(estado: string, envios: EnvioHecho[], ahora = new Date()): 1 | 2 | undefined {
  if (estado !== "en_secuencia") return undefined;
  const p0 = envios.find((e) => e.paso === 0 && e.estado === "enviado" && e.enviado_en);
  if (!p0) return undefined;
  if (envios.some((e) => ["pendiente_aprobacion", "aprobado"].includes(e.estado))) return undefined;
  const inicio = new Date(p0.enviado_en!).getTime();
  for (const paso of [1, 2] as const) {
    if (envios.some((e) => e.paso === paso)) continue;
    // El paso anterior debe haberse enviado (no rechazado ni cancelado) para seguir.
    if (!envios.some((e) => e.paso === paso - 1 && e.estado === "enviado")) return undefined;
    return ahora.getTime() >= inicio + config.secuenciaDias[paso] * DIA ? paso : undefined;
  }
  return undefined;
}

/** Hora local de CDMX (sin depender de la zona del servidor). */
export function horaCdmx(fecha = new Date()): { dia: number; hora: number } {
  const partes = new Intl.DateTimeFormat("en-US", { timeZone: config.zonaHoraria, weekday: "short", hour: "numeric", hourCycle: "h23" }).formatToParts(fecha);
  const dias: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return { dia: dias[partes.find((p) => p.type === "weekday")!.value], hora: Number(partes.find((p) => p.type === "hour")!.value) };
}

/** Lunes 8:00 de CDMX: corrida semanal completa. */
export function esCorridaSemanal(fecha = new Date()): boolean {
  const { dia, hora } = horaCdmx(fecha);
  return dia === 1 && hora === 8;
}

/** Solo enviamos en horario laboral: lunes a viernes de 8:00 a 18:59 en CDMX. */
export function esHorarioDeEnvio(fecha = new Date()): boolean {
  const { dia, hora } = horaCdmx(fecha);
  return dia >= 1 && dia <= 5 && hora >= 8 && hora < 19;
}
