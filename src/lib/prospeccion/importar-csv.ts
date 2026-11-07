/**
 * Importa el CSV que exporta la herramienta «Encuentra clientes» de aiLearning
 * (columnas: puntos,nivel,nombre,giro,tamano,colonia,direccion,telefono,correo,web,km,canal,fuente,id_fuente,consultado).
 * Cada fila pasa por la MISMA limpieza y calificación que lo que encuentra el worker: el puntaje del CSV se ignora.
 */
import { config, type Tamano } from "./config.ts";
import type { Candidato } from "./tipos.ts";

/** CSV simple con comillas dobles (RFC 4180). */
export function leerCsv(texto: string): Record<string, string>[] {
  const filas: string[][] = [];
  let fila: string[] = [], campo = "", comillas = false;
  const t = texto.replace(/^﻿/, "");
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (comillas) {
      if (ch === '"' && t[i + 1] === '"') { campo += '"'; i++; }
      else if (ch === '"') comillas = false;
      else campo += ch;
    } else if (ch === '"') comillas = true;
    else if (ch === ",") { fila.push(campo); campo = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && t[i + 1] === "\n") i++;
      fila.push(campo); campo = "";
      if (fila.some((c) => c.trim())) filas.push(fila);
      fila = [];
    } else campo += ch;
  }
  fila.push(campo);
  if (fila.some((c) => c.trim())) filas.push(fila);
  const [enc, ...resto] = filas;
  return resto.map((f) => Object.fromEntries(enc.map((k, i) => [k.trim(), (f[i] ?? "").trim()])));
}

const TAMANOS = new Set<Tamano>(["micro", "pequena", "mediana", "grande"]);

export function candidatosDesdeCsv(texto: string): Candidato[] {
  return leerCsv(texto).flatMap((r) => {
    const giro = config.buscar.find((g) => g.giro === r.giro || g.id === r.giro);
    if (!giro) return [];
    const web = r.web || undefined;
    const fecha = r.consultado || new Date().toISOString().slice(0, 10);
    const url = web || (r.id_fuente?.startsWith("web:") ? `https://${r.id_fuente.slice(4)}` : "");
    const f = (campo: string) => ({ campo, url, fecha, proveedor: "csv" as const });
    const tamano = TAMANOS.has(r.tamano as Tamano) ? (r.tamano as Tamano) : undefined;
    return [{
      nombre: r.nombre, giroId: giro.id, web, correos: r.correo ? [r.correo] : [], telefonos: r.telefono ? [r.telefono] : [],
      tamano, colonia: r.colonia || undefined, direccion: r.direccion || undefined,
      // El CSV de aiLearning viene filtrado por giro y trae la fuente «Página del negocio».
      textoPagina: `${giro.palabras[0]} ${r.nombre}`,
      fuentes: [f("nombre"), f("web"), ...(r.correo ? [f("correo")] : []), ...(r.telefono ? [f("telefono")] : [])],
    }];
  });
}
