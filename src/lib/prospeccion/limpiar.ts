/**
 * Paso 2 · Limpiar. Une duplicados (CLEE, teléfono o dominio), quita gobierno, negocios sin nombre,
 * bajas y clientes actuales; normaliza teléfonos a +52 y verifica el MX del dominio del correo.
 */
import { resolveMx } from "node:dns/promises";
import type { Entorno } from "./config.ts";
import type { Candidato, Fuente } from "./tipos.ts";
import { esExcluido, esNombreGenerico, nombreDeDominio, pareceTitulo } from "./encontrar.ts";
import { dominioDe, normalizarTelefono, revisarCorreo, sinAcentos } from "./texto.ts";
import { pedirJson } from "./reintentos.ts";

export type Listas = {
  /** Lista de bajas permanente + exclusiones manuales + clientes actuales. */
  bloqueados: { correos: Set<string>; dominios: Set<string>; telefonos: Set<string> };
  /** Prospectos que ya existen en la base (para no duplicar). */
  existentes: { clees: Set<string>; dominios: Set<string>; telefonos: Set<string> };
};

export const listasVacias = (): Listas => ({
  bloqueados: { correos: new Set(), dominios: new Set(), telefonos: new Set() },
  existentes: { clees: new Set(), dominios: new Set(), telefonos: new Set() },
});

export type Limpio = Omit<Candidato, "correos" | "telefonos"> & {
  correo?: string;
  correoVerificado?: "mx" | "millionverifier" | "sin_verificar";
  telefono?: string;
  dominio?: string;
};

export type Descartado = { nombre: string; motivo: string };

const GOBIERNO = /\b(secretar[ií]a|gobierno|alcald[ií]a|delegaci[oó]n|ayuntamiento|instituto nacional|imss|issste|sat|profeco|conagua|cfe|pemex|senado|c[aá]mara de diputados|poder judicial|fiscal[ií]a|juzgado|dif)\b/i;

export function esGobierno(nombre: string, web?: string): boolean {
  const d = dominioDe(web);
  return GOBIERNO.test(nombre) || !!(d && (d.endsWith(".gob.mx") || d.endsWith(".gob")));
}

const claveNombre = (n: string) => sinAcentos(n).replace(/[^a-z0-9]/g, "");

/** Une candidatos del mismo negocio (mismo CLEE, dominio o teléfono). Prefiere los datos oficiales de DENUE. */
export function unirDuplicados(lista: Candidato[]): Candidato[] {
  const grupos: Candidato[] = [];
  const indice = new Map<string, Candidato>();
  for (const original of lista) {
    const c = { ...original, telefonos: [...new Set(original.telefonos.map(normalizarTelefono).filter((t): t is string => !!t))] };
    const d = dominioDe(c.web);
    const claves = [c.clee && `clee:${c.clee}`, d && `dom:${d}`, ...c.telefonos.map((t) => `tel:${t}`), `nom:${claveNombre(c.nombre)}:${c.giroId}`].filter(Boolean) as string[];
    const previo = claves.map((k) => indice.get(k)).find(Boolean);
    if (!previo) {
      const nuevo = { ...c, correos: [...c.correos], telefonos: [...c.telefonos], fuentes: [...c.fuentes] };
      grupos.push(nuevo);
      claves.forEach((k) => indice.set(k, nuevo));
      continue;
    }
    const esDenue = c.fuentes.some((f) => f.proveedor === "denue");
    previo.clee ??= c.clee;
    previo.tamano ??= c.tamano;
    previo.colonia ??= c.colonia;
    previo.direccion ??= c.direccion;
    if (previo.lat === undefined || esDenue) { previo.lat = c.lat ?? previo.lat; previo.lon = c.lon ?? previo.lon; }
    previo.web ??= c.web;
    if (esDenue && c.nombre) previo.nombre = c.nombre;
    previo.correos = [...new Set([...previo.correos, ...c.correos])];
    previo.telefonos = [...new Set([...previo.telefonos, ...c.telefonos])];
    previo.fuentes = dedupFuentes([...previo.fuentes, ...c.fuentes]);
    previo.textoPagina = [previo.textoPagina, c.textoPagina].filter(Boolean).join(" ").slice(0, 3000);
    claves.forEach((k) => indice.set(k, previo));
  }
  return grupos;
}

function dedupFuentes(f: Fuente[]): Fuente[] {
  const vistos = new Set<string>();
  return f.filter((x) => { const k = `${x.campo}|${x.url}`; if (vistos.has(k)) return false; vistos.add(k); return true; });
}

export type VerificadorMx = (dominio: string) => Promise<boolean>;

export const mxPorDns: VerificadorMx = async (dominio) => {
  try {
    const r = await resolveMx(dominio);
    return r.some((x) => x.exchange && x.exchange !== ".");
  } catch {
    return false;
  }
};

/** MillionVerifier (opcional): solo si pasas de 500 correos al mes. */
export async function verificarMillion(correo: string, env: Entorno): Promise<boolean | undefined> {
  if (!env.millionVerifierKey) return undefined;
  try {
    const r = await pedirJson<{ result?: string }>(`https://api.millionverifier.com/api/v3/?api=${env.millionVerifierKey}&email=${encodeURIComponent(correo)}&timeout=10`);
    return r.result === "ok" || r.result === "catch_all";
  } catch {
    return undefined;
  }
}

export async function limpiar(
  candidatos: Candidato[],
  listas: Listas,
  opts: { mx?: VerificadorMx; env?: Entorno; correosEsteMes?: number } = {},
): Promise<{ limpios: Limpio[]; descartados: Descartado[] }> {
  const mx = opts.mx ?? mxPorDns;
  const limpios: Limpio[] = [];
  const descartados: Descartado[] = [];
  const cacheMx = new Map<string, boolean>();
  const { bloqueados: B, existentes: E } = listas;

  for (const c of unirDuplicados(candidatos)) {
    const original = c.nombre?.trim() || "";
    // Si el «nombre» es en realidad un título de página o un lugar, usamos el de su dominio; sin dominio, se descarta.
    const nombre = !original || esNombreGenerico(original) || pareceTitulo(original) ? nombreDeDominio(c.web) : original;
    const no = (motivo: string) => descartados.push({ nombre: original || nombre || "(sin nombre)", motivo });
    if (!nombre || esNombreGenerico(nombre)) { no("sin nombre de negocio"); continue; }
    if (esGobierno(nombre, c.web)) { no("oficina de gobierno"); continue; }
    if (c.web && esExcluido(c.web)) { no(esExcluido(c.web)!); continue; }

    const dominio = dominioDe(c.web);
    const telefonos = c.telefonos.map(normalizarTelefono).filter((t): t is string => !!t);
    if ((dominio && B.dominios.has(dominio)) || telefonos.some((t) => B.telefonos.has(t)) || c.correos.some((x) => B.correos.has(x.toLowerCase()))) {
      no("en la lista de bajas o de clientes actuales"); continue;
    }
    if ((c.clee && E.clees.has(c.clee)) || (dominio && E.dominios.has(dominio)) || telefonos.some((t) => E.telefonos.has(t))) {
      no("ya existe en la base"); continue;
    }

    // Correo: el primero que sea genérico, del dominio de su página y con MX.
    let correo: string | undefined;
    let correoVerificado: Limpio["correoVerificado"];
    for (const raw of c.correos) {
      const rev = revisarCorreo(raw, c.web);
      if (!rev.ok) continue;
      const dom = rev.correo.split("@")[1];
      if (!cacheMx.has(dom)) cacheMx.set(dom, await mx(dom));
      if (!cacheMx.get(dom)) continue;
      correoVerificado = "mx";
      if ((opts.correosEsteMes ?? 0) > 500 && opts.env) {
        const mv = await verificarMillion(rev.correo, opts.env);
        if (mv === false) continue;
        if (mv === true) correoVerificado = "millionverifier";
      }
      correo = rev.correo;
      break;
    }
    const telefono = telefonos[0];
    if (!correo && !telefono) { no(c.correos.length ? "solo tenía correos personales o sin MX" : "sin correo ni teléfono"); continue; }

    // Solo guardamos las fuentes de los datos que conservamos (minimización).
    const conservados = new Set(["nombre", "web", "clee", "tamano", "ubicacion", ...(correo ? ["correo"] : []), ...(telefono ? ["telefono"] : [])]);
    const { correos: _c, telefonos: _t, ...resto } = c;
    void _c; void _t;
    limpios.push({ ...resto, nombre, dominio, correo, correoVerificado, telefono, fuentes: dedupFuentes(c.fuentes.filter((f) => conservados.has(f.campo))) });
    if (dominio) E.dominios.add(dominio);
    if (telefono) E.telefonos.add(telefono);
    if (c.clee) E.clees.add(c.clee);
  }
  return { limpios, descartados };
}
