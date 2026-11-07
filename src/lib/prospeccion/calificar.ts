/**
 * Paso 3 · Calificar (0 a 100) y guardar por qué.
 * 40 giro buscado · +15 tamaño en mis tamaños · hasta +15 cercanía · +14 correo público · +10 teléfono · +6 página web.
 * Caliente ≥ 75 · tibio 55–74 · frío < 55.
 */
import { config } from "./config.ts";
import type { Nivel, Prospecto } from "./tipos.ts";
import type { Limpio } from "./limpiar.ts";
import { distanciaKm, sinAcentos } from "./texto.ts";

export function nivelDe(puntos: number): Nivel {
  return puntos >= 75 ? "caliente" : puntos >= 55 ? "tibio" : "frio";
}

/** Hasta 15 puntos: 15 a ≤ 0.5 km, baja en línea recta hasta 0 en el borde del radio. Sin ubicación: 0. */
export function puntosCercania(km: number | undefined, radioKm = config.radioKm): number {
  if (km === undefined || Number.isNaN(km) || km > radioKm) return 0;
  if (km <= 0.5) return 15;
  return Math.round(15 * (1 - (km - 0.5) / (radioKm - 0.5)));
}

export function esDelGiro(p: Pick<Limpio, "giroId" | "nombre" | "textoPagina" | "fuentes">): boolean {
  const giro = config.buscar.find((g) => g.id === p.giroId);
  if (!giro) return false;
  if (p.fuentes.some((f) => f.proveedor === "denue")) return true; // DENUE ya filtra por actividad
  const texto = sinAcentos(`${p.nombre} ${p.textoPagina || ""}`);
  return giro.palabras.some((w) => texto.includes(sinAcentos(w)));
}

export function calificar(p: Limpio): Prospecto {
  const motivos: string[] = [];
  let puntos = 0;
  const giro = config.buscar.find((g) => g.id === p.giroId)!;
  if (esDelGiro(p)) { puntos += 40; motivos.push(`+40 es del giro buscado (${giro.giro})`); }
  else motivos.push(`+0 no se confirmó que sea del giro ${giro.giro}`);

  if (p.tamano && config.tamanos.includes(p.tamano)) { puntos += 15; motivos.push(`+15 tamaño ${p.tamano} (DENUE)`); }
  else motivos.push(p.tamano ? `+0 tamaño ${p.tamano} fuera de tus tamaños` : "+0 tamaño desconocido");

  const km = p.lat !== undefined && p.lon !== undefined ? Math.round(distanciaKm(config.centro, { lat: p.lat, lon: p.lon }) * 100) / 100 : undefined;
  const cerca = puntosCercania(km);
  puntos += cerca;
  motivos.push(km === undefined ? "+0 sin ubicación exacta" : `+${cerca} a ${km} km del centro`);

  if (p.correo) { puntos += 14; motivos.push("+14 correo genérico publicado en su página"); }
  if (p.telefono) { puntos += 10; motivos.push("+10 teléfono publicado"); }
  if (p.web) { puntos += 6; motivos.push("+6 tiene página web"); }

  puntos = Math.max(0, Math.min(100, puntos));
  return {
    clee: p.clee, nombre: p.nombre, giroId: p.giroId, giro: giro.giro, tamano: p.tamano, colonia: p.colonia,
    direccion: p.direccion, lat: p.lat, lon: p.lon, km, telefono: p.telefono, correo: p.correo,
    correoVerificado: p.correoVerificado, web: p.web, dominio: p.dominio, puntos, nivel: nivelDe(puntos), motivos, fuentes: p.fuentes,
  };
}
