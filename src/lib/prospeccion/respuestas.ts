/**
 * Paso 7 · Respuestas. Lee el buzón por IMAP y clasifica: interesado / no ahora / baja.
 * Cualquier respuesta detiene la secuencia; «baja» entra a la lista permanente al instante.
 */
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import type { Entorno } from "./config.ts";
import type { Clasificacion } from "./tipos.ts";
import { sinAcentos } from "./texto.ts";

const BAJA = /\b(baja|darme de baja|darnos de baja|no me interesa|no nos interesa|no gracias|no, gracias|dejen de|dejar de recibir|eliminar|elimine|eliminen|borren|unsubscribe|remove|stop|no escriban|no vuelvan|no nos escriban|spam|no autoriz)/;
const NO_AHORA = /\b(ahora no|por ahora no|por el momento no|no por el momento|mas adelante|en otro momento|despues|el proximo (mes|ano|ciclo)|quiza luego|tal vez luego|no es buen momento)/;
const INTERESADO = /\b(me interesa|nos interesa|si,|si me|si nos|si claro|claro|me gustaria|nos gustaria|mandame|mandenos|mandeme|envienme|envienos|enviame|informacion|info\b|platicar|llamen|llamar|agendar|reunion|cuando|precio|costo|como funciona|adelante)/;

/** Quita el texto citado del correo original para clasificar solo lo que ellos escribieron. */
export function soloRespuesta(texto: string): string {
  const lineas: string[] = [];
  for (const l of texto.split(/\r?\n/)) {
    if (/^\s*>/.test(l)) break;
    if (/^(El|On) .+(escribi[oó]|wrote):?\s*$/i.test(l.trim())) break;
    if (/^-{2,}\s*(Original|Mensaje original)/i.test(l.trim())) break;
    if (/^(De|From):\s/i.test(l.trim())) break;
    lineas.push(l);
  }
  return lineas.join("\n").trim();
}

export function clasificar(textoCompleto: string, asunto = ""): Clasificacion {
  const t = sinAcentos(`${asunto.replace(/^(re|fw|fwd):\s*/i, "")} ${soloRespuesta(textoCompleto)}`).replace(/\s+/g, " ").trim();
  if (BAJA.test(t) || /^no[.!]?$/.test(sinAcentos(soloRespuesta(textoCompleto)).trim())) return "baja";
  if (NO_AHORA.test(t)) return "no_ahora";
  if (INTERESADO.test(t)) return "interesado";
  return "otro";
}

export type Mensaje = { messageId: string; de: string; asunto: string; texto: string; automatico: boolean; fecha: Date };

/** Lee los correos de los últimos 7 días. No los marca como leídos (deduplicamos por Message-ID). */
export async function leerBuzon(env: Entorno, dias = 7): Promise<Mensaje[]> {
  const { host, port, user, pass, buzon } = env.imap;
  if (!host || !user || !pass) throw new Error("Faltan IMAP_HOST, IMAP_USER o IMAP_PASS");
  const cliente = new ImapFlow({ host, port, secure: port === 993, auth: { user, pass }, logger: false });
  const salida: Mensaje[] = [];
  await cliente.connect();
  const candado = await cliente.getMailboxLock(buzon);
  try {
    const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);
    const uids = await cliente.search({ since: desde }, { uid: true });
    for await (const m of cliente.fetch(uids || [], { source: true, envelope: true }, { uid: true })) {
      if (!m.source) continue;
      const p = await simpleParser(m.source);
      const de = (p.from?.value?.[0]?.address || "").toLowerCase();
      if (!de || de === user.toLowerCase()) continue;
      const auto = String(p.headers.get("auto-submitted") || "no").toLowerCase();
      salida.push({
        messageId: p.messageId || `${m.uid}@${buzon}`,
        de,
        asunto: p.subject || "",
        texto: (p.text || "").slice(0, 8000),
        automatico: (auto !== "no" && auto !== "") || /fuera de la oficina|out of office|respuesta autom/i.test(p.subject || ""),
        fecha: p.date || new Date(),
      });
    }
  } finally {
    candado.release();
    await cliente.logout();
  }
  return salida;
}
