/** Utilidades puras de normalización. Sin red, sin estado: fáciles de probar. */

/** Teléfonos de México a +52 y 10 dígitos. Devuelve undefined si no parece un número mexicano válido. */
export function normalizarTelefono(raw: string | undefined | null): string | undefined {
  if (!raw) return undefined;
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 13 && d.startsWith("521")) d = "52" + d.slice(3); // formato móvil antiguo (+52 1)
  if (d.length === 12 && d.startsWith("52")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("1")) return undefined; // EE. UU./Canadá: fuera de alcance
  if (d.length !== 10) return undefined;
  if (/^(\d)\1{9}$/.test(d)) return undefined; // 0000000000, 5555555555…
  return "+52" + d;
}

/** Dominio sin «www.» y en minúsculas. */
export function dominioDe(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
    return u.hostname.toLowerCase().replace(/^www\./, "") || undefined;
  } catch {
    return undefined;
  }
}

const SUFIJOS = ["com.mx", "org.mx", "gob.mx", "edu.mx", "net.mx", "com", "mx", "net", "org", "tienda", "store", "shop", "cafe", "app", "io", "co"];

/** Parte «de marca» de un dominio: moven.com.mx → moven; workspaces.centtro.mx → centtro. */
export function baseDominio(dominio: string): string {
  let d = dominio.toLowerCase();
  for (const s of [...SUFIJOS].sort((a, b) => b.length - a.length)) {
    if (d.endsWith("." + s)) { d = d.slice(0, -(s.length + 1)); break; }
  }
  const partes = d.split(".");
  return partes[partes.length - 1];
}

const PROVEEDORES_GRATIS = new Set([
  "gmail.com", "hotmail.com", "hotmail.es", "outlook.com", "outlook.es", "live.com", "live.com.mx", "yahoo.com", "yahoo.com.mx",
  "icloud.com", "me.com", "aol.com", "prodigy.net.mx", "protonmail.com", "proton.me", "msn.com", "gmx.com",
]);

/** Buzones de rol (genéricos de la empresa). Cualquier otro se trata como personal y se descarta. */
const BUZONES_GENERICOS = new Set([
  "contacto", "contact", "ventas", "sales", "hola", "hello", "hi", "info", "informes", "informacion", "atencion",
  "atencionaclientes", "atencion.clientes", "servicio", "servicios", "clientes", "admin", "administracion",
  "reservaciones", "reservas", "pedidos", "comercial", "recepcion", "oficina", "negocios", "marketing", "redes",
  "eventos", "tienda", "store", "soporte", "ayuda", "general", "office", "team", "equipo",
]);

export type RevisionCorreo = { ok: true; correo: string } | { ok: false; motivo: string };

/**
 * Regla legal: solo correos genéricos de la empresa, del mismo dominio (o marca) que su propia página.
 * Nunca correos personales ni de proveedores gratuitos (gmail, hotmail…).
 */
export function revisarCorreo(raw: string, web: string | undefined): RevisionCorreo {
  const correo = raw.trim().toLowerCase().replace(/^mailto:/, "").replace(/[.,;:)]+$/, "");
  const m = /^([a-z0-9._%+-]+)@([a-z0-9.-]+\.[a-z]{2,})$/.exec(correo);
  if (!m) return { ok: false, motivo: "correo mal formado" };
  const [, local, dom] = m;
  if (PROVEEDORES_GRATIS.has(dom)) return { ok: false, motivo: "proveedor gratuito (posible correo personal)" };
  if (dom.endsWith(".gob.mx")) return { ok: false, motivo: "gobierno" };
  const raiz = local.split("+")[0];
  const generico = BUZONES_GENERICOS.has(raiz) || [...BUZONES_GENERICOS].some((g) => raiz.startsWith(g + ".") || raiz.startsWith(g + "_") || raiz.startsWith(g + "-"));
  if (!generico) return { ok: false, motivo: "no es un buzón genérico (posible correo personal)" };
  const domWeb = dominioDe(web);
  if (!domWeb) return { ok: false, motivo: "sin página propia para comprobar el dominio" };
  const a = baseDominio(dom), b = baseDominio(domWeb);
  const mismaMarca = dom === domWeb || domWeb.endsWith("." + dom) || dom.endsWith("." + domWeb) || (a.length >= 4 && b.length >= 4 && (b.includes(a) || a.includes(b)));
  if (!mismaMarca) return { ok: false, motivo: `el dominio del correo (${dom}) no es el de su página (${domWeb})` };
  return { ok: true, correo };
}

/** Extrae correos y teléfonos del texto de una página. */
export function extraerContactos(texto: string): { correos: string[]; telefonos: string[] } {
  const correos = [...new Set((texto.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || [])
    .map((c) => c.toLowerCase())
    .filter((c) => !/\.(png|jpe?g|gif|webp|svg)$/.test(c) && !/(sentry|wixpress|example|domain)\./.test(c)))];
  const telefonos = [...new Set((texto.match(/(?:\+?52[\s.-]?)?(?:\(?\d{2,3}\)?[\s.-]?)\d{3,4}[\s.-]?\d{4}/g) || [])
    .map(normalizarTelefono).filter((t): t is string => !!t))];
  return { correos, telefonos };
}

/** Distancia en km (haversine). */
export function distanciaKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371, rad = (g: number) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function sinAcentos(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function contarPalabras(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
