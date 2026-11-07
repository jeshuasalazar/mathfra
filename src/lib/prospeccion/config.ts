/**
 * Configuración de la prospección (herramienta «Encuentra clientes» de aiLearning, 5 nov 2026).
 * Este módulo NO importa "server-only" ni alias "@/": lo usan tanto el worker de Railway (Node puro)
 * como el sitio de Next.js. Las llaves se leen SOLO de variables de entorno (Railway).
 */

export type Tamano = "micro" | "pequena" | "mediana" | "grande";

export type GiroBuscado = { id: string; giro: string; denue: string; palabras: string[] };

export const config = {
  negocio: "Mathfra",
  razonSocial: "Mathfra SA de CV",
  vende: "Cursos de ingreso ECOEMS",
  firma: "Mtro. Hector",
  dominio: "mathfra.app",
  sitio: "https://mathfra.app",
  contacto: "contacto@mathfra.com",
  whatsappDisplay: "+1 202 457 7161",
  privacidadUrl: "https://mathfra.app/aviso-de-privacidad",
  modoRadar: "aliados" as const,
  buscar: [
    { id: "restaurantes", giro: "Restaurantes y cafés", denue: "restaurante", palabras: ["restaurante", "café", "cafe", "cafetería", "cafeteria", "cocina", "comida", "fonda", "taquería", "bistro", "brunch", "panadería"] },
    { id: "empresas", giro: "Oficinas y empresas", denue: "servicios", palabras: ["empresa", "oficina", "consultor", "despacho", "agencia", "corporativo", "servicios", "contable", "abogados", "coworking", "soluciones"] },
    { id: "tiendas", giro: "Tiendas y boutiques", denue: "tienda", palabras: ["tienda", "boutique", "moda", "ropa", "accesorios", "zapatería", "joyería", "papelería", "regalos", "farmacia", "store"] },
  ] satisfies GiroBuscado[],
  centro: { lugar: "CDMX · Benito Juárez", zona: "Benito Juárez, Ciudad de México", lat: 19.38, lon: -99.16 },
  radioKm: 3,
  tamanos: ["micro", "pequena"] as Tamano[],
  senales: ["con-correo"],
  /** Máximo de correos nuevos (paso 0) por semana y de envíos por corrida. */
  limites: { nuevosPorSemana: 40, enviosPorCorrida: 25, esperaEntreEnviosMs: 3000, resultadosPorBusqueda: 25 },
  /** Días de cada toque: día 0, día 3 y día 10. */
  secuenciaDias: [0, 3, 10],
  revisionDias: 14,
  retencionMeses: 12,
  /** Zona horaria del negocio: CDMX no tiene horario de verano desde 2022 (UTC-6). */
  zonaHoraria: "America/Mexico_City",
  modeloIA: "claude-haiku-5-5",
};

/** Lee las variables de entorno en el momento (no al importar), para que las pruebas puedan cambiarlas. */
export function entorno() {
  const e = process.env;
  return {
    exaKey: e.EXA_API_KEY,
    exaTipo: e.EXA_SEARCH_TYPE || "auto",
    denueToken: e.DENUE_TOKEN,
    placesKey: e.GOOGLE_PLACES_KEY,
    millionVerifierKey: e.MILLIONVERIFIER_KEY,
    anthropicKey: e.ANTHROPIC_API_KEY,
    supabaseUrl: e.NEXT_PUBLIC_SUPABASE_URL,
    supabaseSecret: e.SUPABASE_SECRET_KEY,
    resendKey: e.RESEND_API_KEY,
    /** Remitente de prospección, p. ej. «Mtro. Hector · Mathfra <hector@mathfra.app>» (dominio verificado en Resend). */
    from: e.PROSPECCION_FROM,
    /** Buzón donde llegan las respuestas (el mismo que lee IMAP). */
    replyTo: e.PROSPECCION_REPLY_TO || e.IMAP_USER,
    /** Domicilio completo (LFPC art. 17): calle, número, colonia, municipio/alcaldía, estado, CP y país. */
    domicilio: e.PROSPECCION_DOMICILIO,
    secreto: e.PROSPECCION_SECRET || e.NEWSLETTER_TOKEN_SECRET,
    avisoA: e.EMAIL_TO_BUSINESS || config.contacto,
    whatsapp: (e.NEXT_PUBLIC_WHATSAPP || "12024577161").replace(/\D/g, ""),
    sitio: (e.NEXT_PUBLIC_SITE_URL || config.sitio).replace(/\/$/, ""),
    agentUrl: e.AGENTE_WEBHOOK_URL,
    agentSecret: e.AGENTE_WEBHOOK_SECRET,
    imap: { host: e.IMAP_HOST, port: Number(e.IMAP_PORT || 993), user: e.IMAP_USER, pass: e.IMAP_PASS, buzon: e.IMAP_MAILBOX || "INBOX" },
    pausado: e.PROSPECCION_PAUSADO === "1",
    admins: (e.PROSPECCION_ADMINS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  };
}

export type Entorno = ReturnType<typeof entorno>;
