/**
 * Reglas legales (México, 5 nov 2026). Ningún correo sale sin pasar por `armarCorreoFinal`, que agrega el pie
 * y lo valida con `revisarPieLegal`. Si falta un dato obligatorio (domicilio, remitente, secreto), no se envía.
 *  - LFPC art. 17: quién soy, domicilio y contacto; derecho a no recibir publicidad (arts. 18 bis y 76 bis).
 *  - Ley Federal de Protección de Datos Personales en Posesión de los Particulares (2025): origen del dato,
 *    aviso de privacidad y medio sencillo para oponerse (baja en un clic).
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { config, type Entorno } from "./config.ts";
import type { Fuente } from "./tipos.ts";

/** Token de baja firmado (HMAC): no requiere buscar nada en la base para validarlo. */
export function tokenBaja(correo: string, secreto: string): string {
  const c = correo.trim().toLowerCase();
  const firma = createHmac("sha256", secreto).update(`baja:${c}`).digest("base64url").slice(0, 24);
  return `${Buffer.from(c).toString("base64url")}.${firma}`;
}

export function leerTokenBaja(token: string, secreto: string): string | undefined {
  const [b64, firma] = token.split(".");
  if (!b64 || !firma) return undefined;
  let correo: string;
  try { correo = Buffer.from(b64, "base64url").toString("utf8"); } catch { return undefined; }
  if (!/^[^@\s]+@[^@\s]+$/.test(correo)) return undefined;
  const esperada = tokenBaja(correo, secreto).split(".")[1];
  const a = Buffer.from(firma), b = Buffer.from(esperada);
  return a.length === b.length && timingSafeEqual(a, b) ? correo : undefined;
}

export function urlBaja(correo: string, env: Pick<Entorno, "sitio" | "secreto">): string {
  return `${env.sitio}/api/v1/prospeccion/baja?t=${tokenBaja(correo, env.secreto!)}`;
}

/** De dónde sacamos el correo, en palabras simples. */
export function origenDelDato(fuentes: Fuente[]): string {
  const f = fuentes.find((x) => x.campo === "correo") || fuentes.find((x) => x.campo === "web");
  if (!f) return "su página web";
  return `su página web (${f.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}, consultada el ${f.fecha})`;
}

const falta = (v: string | undefined) => !v || /\[COMPLETAR/i.test(v) || v.trim().length < 3;

/** ¿Está todo lo legal listo para enviar? Devuelve la lista de faltantes (vacía = listo). */
export function faltantesLegales(env: Entorno): string[] {
  const f: string[] = [];
  if (falta(env.domicilio) || (env.domicilio || "").length < 25) f.push("PROSPECCION_DOMICILIO (domicilio completo: calle, número, colonia, alcaldía o municipio, estado, CP y país)");
  if (falta(env.from)) f.push("PROSPECCION_FROM (remitente en el dominio verificado de Resend)");
  if (falta(env.replyTo)) f.push("PROSPECCION_REPLY_TO o IMAP_USER (buzón donde llegan las respuestas)");
  if (falta(env.secreto) || (env.secreto || "").length < 24) f.push("PROSPECCION_SECRET (cadena aleatoria de 24+ caracteres para los enlaces de baja)");
  if (!env.resendKey) f.push("RESEND_API_KEY");
  return f;
}

export function pieLegal(datos: { correo: string; fuentes: Fuente[] }, env: Entorno): string {
  return [
    "—",
    `${config.firma} · ${config.razonSocial}`,
    `Domicilio: ${env.domicilio}`,
    `Contacto: ${config.contacto} · WhatsApp ${config.whatsappDisplay}`,
    `Obtuvimos este correo de ${origenDelDato(datos.fuentes)}, donde lo publican como contacto del negocio. No compramos ni vendemos bases de datos.`,
    `Aviso de privacidad: ${config.privacidadUrl}`,
    `Si no quieren recibir más correos, den clic aquí y no volveremos a escribirles: ${urlBaja(datos.correo, env)}`,
    "También pueden responder «baja».",
  ].join("\n");
}

/** Comprueba que el texto final lleve TODO lo obligatorio. Lo usa el envío y las pruebas. */
export function revisarPieLegal(texto: string, env: Entorno): string[] {
  const errores: string[] = [];
  if (!texto.includes(config.firma)) errores.push("falta quién soy (firma)");
  if (!texto.includes(config.razonSocial)) errores.push("falta la razón social");
  if (!env.domicilio || !texto.includes(env.domicilio)) errores.push("falta el domicilio");
  if (!texto.includes(config.contacto)) errores.push("falta el contacto");
  if (!/Obtuvimos este correo de /.test(texto)) errores.push("falta de dónde saqué el dato");
  if (!texto.includes(config.privacidadUrl)) errores.push("falta el aviso de privacidad");
  if (!/\/api\/v1\/prospeccion\/baja\?t=[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/.test(texto)) errores.push("falta la baja en un clic");
  if (/\[COMPLETAR/i.test(texto)) errores.push("quedó un [COMPLETAR]");
  return errores;
}

export type CorreoFinal = { asunto: string; texto: string; html: string; headers: Record<string, string> };

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Arma el correo completo (cuerpo + pie legal) y lanza error si algo obligatorio falta. */
export function armarCorreoFinal(cuerpo: { asunto: string; texto: string }, datos: { correo: string; fuentes: Fuente[] }, env: Entorno): CorreoFinal {
  const faltan = faltantesLegales(env);
  if (faltan.length) throw new Error(`No se envía: faltan datos legales → ${faltan.join("; ")}`);
  const pie = pieLegal(datos, env);
  const texto = `${cuerpo.texto.trim()}\n\n${pie}`;
  const errores = revisarPieLegal(texto, env);
  if (errores.length) throw new Error(`No se envía: ${errores.join("; ")}`);
  const baja = urlBaja(datos.correo, env);
  const enlazar = (s: string) => esc(s).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1">$1</a>');
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#0E1726;max-width:560px">`
    + cuerpo.texto.trim().split(/\n{2,}/).map((p) => `<p>${enlazar(p).replace(/\n/g, "<br>")}</p>`).join("")
    + `<p style="font-size:12px;color:#46536B;border-top:1px solid #C5CEDF;padding-top:10px">${enlazar(pie).replace(/\n/g, "<br>")}</p></div>`;
  return {
    asunto: cuerpo.asunto,
    texto,
    html,
    // Baja en un clic desde el propio cliente de correo (RFC 8058).
    headers: { "List-Unsubscribe": `<${baja}>, <mailto:${env.replyTo}?subject=baja>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
  };
}
