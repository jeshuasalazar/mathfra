/**
 * Paso 1 · Encontrar. Fuentes:
 *  - Exa /search: páginas de negocios del giro en la zona (de ahí salen correo y teléfono que el negocio publica).
 *  - DENUE (INEGI, gratis): CLEE, Estrato (tamaño), colonia y coordenadas; si el negocio tiene página, la leemos con Exa /contents.
 *  - Google Places (opcional): ubicación exacta y página de negocios que Exa no encontró.
 * Si una fuente falla, las demás siguen y el error vuelve como aviso.
 */
import { config, type GiroBuscado, type Entorno, type Tamano } from "./config.ts";
import type { Candidato, Fuente } from "./tipos.ts";
import { conReintentos, pedirJson } from "./reintentos.ts";
import { dominioDe, extraerContactos, normalizarTelefono, sinAcentos } from "./texto.ts";

const hoy = () => new Date().toISOString().slice(0, 10);

/** Directorios, redes sociales, mapas, medios y agregadores: nunca son «la página del negocio». */
const DOMINIOS_EXCLUIDOS = [
  "facebook.com", "instagram.com", "tiktok.com", "twitter.com", "x.com", "linkedin.com", "youtube.com", "pinterest.com",
  "wa.me", "whatsapp.com", "google.com", "goo.gl", "maps.app.goo.gl", "yelp.com", "yelp.com.mx", "tripadvisor.com",
  "tripadvisor.com.mx", "foursquare.com", "seccionamarilla.com.mx", "paginasamarillas.com.mx", "cylex.mx", "cylex-mexico.com",
  "hotfrog.com.mx", "infoisinfo.com.mx", "guiaempresas.mx", "empresite.com", "mexicoempresas.com", "dnb.com",
  "wikipedia.org", "timeoutmexico.mx", "timeout.com", "chilango.com", "eluniversal.com.mx", "milenio.com", "infobae.com",
  "rappi.com.mx", "ubereats.com", "didi-food.com", "opentable.com", "opentable.com.mx", "mercadolibre.com.mx",
  "amazon.com.mx", "glassdoor.com", "indeed.com", "occ.com.mx", "computrabajo.com.mx", "inegi.org.mx", "waze.com",
];

const TITULO_EXCLUIDO = /\b(los|las|top)\s+\d+\b|\b\d+\s+(mejores|lugares|restaurantes|caf[eé]s|tiendas)\b|\bmejores\b.*\ben\b|\bdirectorio\b|\bgu[ií]a de\b|\branking\b|\bblog\b|\brese[ñn]as? de\b/i;

/** Nombres que en realidad son lugares o secciones de una página («CDMX», «Sucursales»…). */
const NOMBRES_GENERICOS = new Set([
  "cdmx", "ciudad de mexico", "mexico", "benito juarez", "del valle", "narvarte", "napoles", "portales", "sucursales",
  "sucursal", "inicio", "home", "contacto", "contact", "nosotros", "tienda", "tienda en linea", "menu", "blog",
  "ubicacion", "ubicaciones", "servicios", "productos", "bienvenidos", "pagina principal", "quienes somos",
]);

export function esExcluido(url: string, titulo = ""): string | undefined {
  const d = dominioDe(url);
  if (!d) return "url inválida";
  if (DOMINIOS_EXCLUIDOS.some((x) => d === x || d.endsWith("." + x))) return "directorio o red social";
  if (/\.directory$|directorio|directory/.test(d)) return "directorio";
  if (d.endsWith(".gob.mx") || d.endsWith(".gob")) return "gobierno";
  if (TITULO_EXCLUIDO.test(titulo)) return "artículo o lista";
  return undefined;
}

export function esNombreGenerico(nombre: string): boolean {
  const n = sinAcentos(nombre).replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  return n.length < 2 || NOMBRES_GENERICOS.has(n);
}

/** ¿Parece título de página o de listado en vez de nombre de negocio? («Contacte con nosotros», «Tiendas en Benito Juárez 2026»…) */
export function pareceTitulo(nombre: string): boolean {
  const n = sinAcentos(nombre);
  return /^(contact|atencion|compra|cotiza|tiendas? (de|en)|restaurant(e)?s? (en|in|de)|cafes? en|codigo postal|ubicacion|sucursal|oficinas? (en|amuebladas)|bienvenid)/.test(n)
    || /\b(19|20)\d{2}\b/.test(n) || nombre.split(/\s+/).length > 6 || /^[^\p{L}\p{N}]/u.test(nombre.trim());
}

/** Nombre a partir del dominio: cafemandrake.com → Cafemandrake. */
export function nombreDeDominio(url: string | undefined): string {
  const base = (dominioDe(url) || "").split(".")[0].replace(/[-_]/g, " ");
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : "";
}

/** Nombre del negocio a partir del título de la página; si no hay uno usable, desde el dominio. */
export function nombreDesde(titulo: string, url: string): string {
  const partes = titulo.split(/\s+[|\-–—·:]\s+|\s*[|·]\s*/).map((p) => p.trim()).filter(Boolean);
  const buena = partes.find((p) => !esNombreGenerico(p) && !pareceTitulo(p) && !TITULO_EXCLUIDO.test(p));
  return buena ? buena.slice(0, 120) : nombreDeDominio(url);
}

// ---------- Exa ----------

type ExaResultado = { url: string; title?: string | null; text?: string };

export async function buscarExa(giro: GiroBuscado, env: Entorno): Promise<Candidato[]> {
  if (!env.exaKey) throw new Error("Falta EXA_API_KEY");
  const body = {
    query: `${giro.giro} en ${config.centro.zona}, contacto`,
    type: env.exaTipo,
    numResults: config.limites.resultadosPorBusqueda,
    userLocation: "MX",
    contents: { text: { maxCharacters: 1500 } },
  };
  const data = await conReintentos(() => pedirJson<{ results: ExaResultado[]; costDollars?: { total?: number } }>(
    "https://api.exa.ai/search",
    { method: "POST", headers: { "content-type": "application/json", "x-api-key": env.exaKey! }, body: JSON.stringify(body) },
  ));
  return (data.results || []).flatMap((r) => {
    if (esExcluido(r.url, r.title || "")) return [];
    const nombre = nombreDesde(r.title || "", r.url);
    if (!nombre) return [];
    const { correos, telefonos } = extraerContactos(r.text || "");
    const f = (campo: string): Fuente => ({ campo, url: r.url, fecha: hoy(), proveedor: "exa" });
    return [{
      nombre, giroId: giro.id, web: r.url, correos, telefonos, textoPagina: (r.text || "").slice(0, 1500),
      fuentes: [f("nombre"), f("web"), ...(correos.length ? [f("correo")] : []), ...(telefonos.length ? [f("telefono")] : [])],
    }];
  });
}

/** Lee páginas conocidas (de DENUE o Places) para encontrar el correo que el negocio publica. */
export async function leerPaginas(urls: string[], env: Entorno): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (!env.exaKey || !urls.length) return out;
  for (let i = 0; i < urls.length; i += 25) {
    const lote = urls.slice(i, i + 25);
    const data = await conReintentos(() => pedirJson<{ results: ExaResultado[] }>(
      "https://api.exa.ai/contents",
      { method: "POST", headers: { "content-type": "application/json", "x-api-key": env.exaKey! }, body: JSON.stringify({ urls: lote, text: { maxCharacters: 3000 } }) },
    ));
    for (const r of data.results || []) out.set(dominioDe(r.url) || r.url, r.text || "");
  }
  return out;
}

// ---------- DENUE (INEGI) ----------

type DenueRegistro = {
  CLEE?: string; Nombre?: string; Razon_social?: string; Clase_actividad?: string; Estrato?: string;
  Calle?: string; Num_Exterior?: string; Colonia?: string; CP?: string; Telefono?: string; Correo_e?: string;
  Sitio_internet?: string; Latitud?: string; Longitud?: string;
};

/** Estrato de DENUE → tamaño. INEGI: micro 0–10, pequeña 11–50, mediana 51–250, grande 251+. */
export function tamanoDesdeEstrato(estrato: string | undefined): Tamano | undefined {
  if (!estrato) return undefined;
  const n = Number((/(\d+)/.exec(estrato) || [])[1]);
  if (Number.isNaN(n)) return undefined;
  if (n <= 6) return "micro";       // «0 a 5» y «6 a 10»
  if (n <= 31) return "pequena";    // «11 a 30» y «31 a 50»
  if (n <= 101) return "mediana";   // «51 a 100» y «101 a 250»
  return "grande";
}

export async function buscarDenue(giro: GiroBuscado, env: Entorno): Promise<Candidato[]> {
  if (!env.denueToken) return [];
  const metros = Math.min(5000, Math.round(config.radioKm * 1000));
  const url = `https://www.inegi.org.mx/app/api/denue/v1/consulta/Buscar/${encodeURIComponent(giro.denue)}/${config.centro.lat},${config.centro.lon}/${metros}/${env.denueToken}`;
  const data = await conReintentos(() => pedirJson<DenueRegistro[]>(url, {}, 30000));
  const fecha = hoy();
  return (Array.isArray(data) ? data : []).flatMap((r) => {
    const nombre = (r.Nombre || r.Razon_social || "").trim();
    if (!nombre || esNombreGenerico(nombre)) return [];
    const web = r.Sitio_internet?.trim() ? (/^https?:/i.test(r.Sitio_internet) ? r.Sitio_internet.trim() : `https://${r.Sitio_internet.trim()}`) : undefined;
    if (web && esExcluido(web)) return [];
    const fuenteDenue = `https://www.inegi.org.mx/app/mapa/denue/?clee=${r.CLEE || ""}`;
    const f = (campo: string): Fuente => ({ campo, url: fuenteDenue, fecha, proveedor: "denue" });
    const tel = normalizarTelefono(r.Telefono);
    return [{
      nombre: nombre.slice(0, 120), giroId: giro.id, web, clee: r.CLEE, tamano: tamanoDesdeEstrato(r.Estrato),
      colonia: r.Colonia?.trim() || undefined,
      direccion: [r.Calle, r.Num_Exterior].filter(Boolean).join(" ").trim() || undefined,
      lat: r.Latitud ? Number(r.Latitud) : undefined, lon: r.Longitud ? Number(r.Longitud) : undefined,
      // El correo de DENUE NO se usa para contactar: solo vale el que el negocio publica en su propia página.
      correos: [], telefonos: tel ? [tel] : [],
      textoPagina: `${r.Clase_actividad || ""} ${nombre}`,
      fuentes: [f("nombre"), f("clee"), f("tamano"), f("ubicacion"), ...(tel ? [f("telefono")] : []), ...(web ? [f("web")] : [])],
    }];
  });
}

// ---------- Google Places (opcional) ----------

type Place = { displayName?: { text?: string }; formattedAddress?: string; location?: { latitude: number; longitude: number }; websiteUri?: string; nationalPhoneNumber?: string; id?: string };

export async function buscarPlaces(giro: GiroBuscado, env: Entorno): Promise<Candidato[]> {
  if (!env.placesKey) return [];
  const data = await conReintentos(() => pedirJson<{ places?: Place[] }>("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json", "X-Goog-Api-Key": env.placesKey!,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.websiteUri,places.nationalPhoneNumber",
    },
    body: JSON.stringify({
      textQuery: `${giro.giro} en ${config.centro.zona}`, languageCode: "es", regionCode: "MX", pageSize: 20,
      locationBias: { circle: { center: { latitude: config.centro.lat, longitude: config.centro.lon }, radius: config.radioKm * 1000 } },
    }),
  }));
  const fecha = hoy();
  return (data.places || []).flatMap((p) => {
    const nombre = p.displayName?.text?.trim() || "";
    if (!nombre || esNombreGenerico(nombre)) return [];
    if (p.websiteUri && esExcluido(p.websiteUri)) return [];
    const fuente = `https://www.google.com/maps/place/?q=place_id:${p.id || ""}`;
    const f = (campo: string): Fuente => ({ campo, url: fuente, fecha, proveedor: "places" });
    const tel = normalizarTelefono(p.nationalPhoneNumber);
    return [{
      nombre: nombre.slice(0, 120), giroId: giro.id, web: p.websiteUri, correos: [], telefonos: tel ? [tel] : [],
      direccion: p.formattedAddress, lat: p.location?.latitude, lon: p.location?.longitude,
      fuentes: [f("nombre"), f("ubicacion"), ...(tel ? [f("telefono")] : []), ...(p.websiteUri ? [f("web")] : [])],
    }];
  });
}

// ---------- Todo junto ----------

export type ResultadoEncontrar = { candidatos: Candidato[]; avisos: string[]; costoUsd: number };

/** Corre todas las fuentes por giro. Una fuente caída no detiene a las demás. */
export async function encontrar(env: Entorno): Promise<ResultadoEncontrar> {
  const candidatos: Candidato[] = [];
  const avisos: string[] = [];
  let costoUsd = 0;
  for (const giro of config.buscar) {
    for (const [nombre, fn] of [["Exa", buscarExa], ["DENUE", buscarDenue], ["Google Places", buscarPlaces]] as const) {
      try {
        const lista = await fn(giro, env);
        candidatos.push(...lista);
        if (nombre === "Exa") costoUsd += 0.007; // estimado por búsqueda con texto; ajusta con tu factura
      } catch (e) {
        avisos.push(`${nombre} (${giro.giro}): ${(e as Error).message}`);
      }
    }
  }
  // Negocios de DENUE/Places con página pero sin correo: leemos su página para encontrar el correo publicado.
  const porLeer = candidatos.filter((c) => c.web && !c.correos.length && c.fuentes.every((f) => f.proveedor !== "exa"));
  try {
    const textos = await leerPaginas([...new Set(porLeer.map((c) => c.web!))].slice(0, 50), env);
    costoUsd += textos.size * 0.001;
    for (const c of porLeer) {
      const t = textos.get(dominioDe(c.web) || "");
      if (!t) continue;
      const { correos, telefonos } = extraerContactos(t);
      c.correos = correos;
      c.telefonos = [...new Set([...c.telefonos, ...telefonos])];
      c.textoPagina = `${c.textoPagina || ""} ${t.slice(0, 1500)}`;
      if (correos.length) c.fuentes.push({ campo: "correo", url: c.web!, fecha: hoy(), proveedor: "exa" });
    }
  } catch (e) {
    avisos.push(`Lectura de páginas: ${(e as Error).message}`);
  }
  return { candidatos, avisos, costoUsd };
}
