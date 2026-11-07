/**
 * Paso 4 · Personalizar. Para calientes y tibios, Claude Haiku escribe el primer correo (≤ 90 palabras)
 * usando SOLO datos del registro. Salida JSON {asunto, texto} validada; si falla, plantilla fija.
 */
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { config, type Entorno } from "./config.ts";
import type { Correo, Prospecto } from "./tipos.ts";
import { contarPalabras, sinAcentos } from "./texto.ts";

const Salida = z.object({ asunto: z.string().min(5).max(80), texto: z.string().min(30).max(900) });

/** Datos que la IA puede usar. Nada más. */
export function datosPermitidos(p: Prospecto) {
  return { nombre: p.nombre, colonia: p.colonia ?? null, giro: p.giro, tiene_pagina: !!p.web };
}

const PROHIBIDO = [
  "mejor", "increible", "excelente", "felicit", "lider", "garantiz", "satisfech", "premiad", "encant", "admir",
  "impresion", "fantastic", "maravill", "exito", "clientes como", "miles", "cientos", "experiencia de", "anos de",
  "aprobacion", "100", "%", "gratis", "oferta", "descuento", "urgente", "ultima oportunidad",
];

/** Reglas de contenido: sin cifras, sin halagos, sin clientes inventados, ≤ 90 palabras y con el nombre del negocio. */
export function validarCuerpo(c: { asunto: string; texto: string }, p: Prospecto): string[] {
  const e: string[] = [];
  const todo = `${c.asunto} ${c.texto}`;
  const plano = sinAcentos(todo);
  if (contarPalabras(c.texto) > 90) e.push(`más de 90 palabras (${contarPalabras(c.texto)})`);
  if (/\d/.test(todo)) e.push("trae cifras");
  if (/https?:\/\/|www\./i.test(todo)) e.push("trae enlaces (los pone el sistema)");
  for (const w of PROHIBIDO) if (plano.includes(w)) e.push(`palabra prohibida: «${w}»`);
  if (!sinAcentos(c.texto).includes(sinAcentos(p.nombre).slice(0, 12))) e.push("no menciona el nombre del negocio");
  if (!c.texto.includes(config.firma)) e.push("no firma el Mtro. Hector");
  if (p.colonia === undefined && /\bcolonia\b/i.test(todo)) e.push("menciona una colonia que no está en el registro");
  return e;
}

export function plantillaFija(p: Prospecto, beneficio?: string): { asunto: string; texto: string } {
  const lugar = p.colonia ? `en la colonia ${p.colonia}` : "en Benito Juárez";
  return {
    asunto: `Una alianza para ${p.nombre}`.slice(0, 80),
    texto: [
      `Hola, equipo de ${p.nombre}:`,
      `Soy el ${config.firma}, de Mathfra. Damos cursos de ingreso al bachillerato con el examen ECOEMS. Buscamos negocios ${lugar} que quieran recomendarnos a sus clientes o a su equipo con hijos en secundaria.${beneficio ? ` ${beneficio}` : ""}`,
      `¿Les interesa que les mande la información? Basta con responder este correo.`,
      `Saludos,\n${config.firma}`,
    ].join("\n\n"),
  };
}

const SISTEMA = `Escribes el primer correo de ${config.firma}, de Mathfra (cursos de ingreso al bachillerato con el examen ECOEMS), a un negocio de Ciudad de México para proponerle una alianza: que recomiende el curso a sus clientes o a su equipo con hijos en secundaria.
Reglas:
- Español de México, trato de «ustedes», tono cordial y directo. Máximo 80 palabras en "texto".
- Usa SOLO los datos del registro que te paso (nombre, colonia, giro, si tiene página). Si colonia es null, no menciones colonia.
- Prohibido: cifras o números de cualquier tipo, halagos («excelente», «nos encanta», «líderes»…), clientes, resultados o casos inventados, promesas, enlaces, urgencia, descuentos.
- Termina con una pregunta simple para que respondan el correo y firma exactamente: "Saludos,\\n${config.firma}".
- No agregues domicilio, aviso de privacidad ni baja: el sistema los añade.
Devuelve JSON con "asunto" (máximo 60 caracteres, sin cifras) y "texto".`;

let cliente: Anthropic | null = null;

/** Precio de Claude Haiku 5.5: US$0.10 entrada y US$0.50 salida por millón de tokens. */
const costo = (u: { input_tokens: number; output_tokens: number }) => (u.input_tokens * 0.1 + u.output_tokens * 0.5) / 1_000_000;

export async function personalizar(p: Prospecto, env: Entorno, beneficio?: string): Promise<Correo> {
  const fija = (): Correo => ({ ...plantillaFija(p, beneficio), generadoPor: "plantilla", costoUsd: 0 });
  if (!env.anthropicKey || p.nivel === "frio") return fija();
  try {
    cliente ??= new Anthropic({ apiKey: env.anthropicKey, maxRetries: 2, timeout: 30_000 });
    const r = await cliente.messages.parse({
      model: config.modeloIA,
      max_tokens: 1024,
      output_config: { effort: "low", format: zodOutputFormat(Salida) },
      system: SISTEMA,
      messages: [{ role: "user", content: `Registro: ${JSON.stringify(datosPermitidos(p))}` }],
    });
    const gasto = costo(r.usage);
    if (r.stop_reason === "refusal" || !r.parsed_output) return { ...fija(), costoUsd: gasto };
    const salida = { asunto: r.parsed_output.asunto.trim(), texto: r.parsed_output.texto.trim() };
    if (validarCuerpo(salida, p).length) return { ...fija(), costoUsd: gasto };
    // El beneficio lo escribes tú (PROSPECCION_BENEFICIO_ALIADO): se inserta tal cual, antes de la firma.
    if (beneficio) salida.texto = salida.texto.replace(/\n*Saludos,/, `\n\n${beneficio}\n\nSaludos,`);
    return { ...salida, generadoPor: "ia", costoUsd: gasto };
  } catch (e) {
    console.warn("[prospección] IA no disponible, uso plantilla:", (e as Error).message);
    return fija();
  }
}

/** Seguimientos (día 3 y día 10): cortos, fijos, sin IA. */
export function seguimiento(paso: 1 | 2, p: Prospecto): { asunto: string; texto: string } {
  if (paso === 1) {
    return {
      asunto: `Re: Una alianza para ${p.nombre}`.slice(0, 80),
      texto: `Hola, equipo de ${p.nombre}:\n\nLes escribí hace unos días sobre recomendar nuestro curso de ingreso ECOEMS. Si les interesa, respondan este correo y les mando la información.\n\nSaludos,\n${config.firma}`,
    };
  }
  return {
    asunto: `Último correo de Mathfra para ${p.nombre}`.slice(0, 80),
    texto: `Hola, equipo de ${p.nombre}:\n\nEste es mi último correo sobre la alianza. Si más adelante les interesa, aquí estamos. No volveremos a escribirles.\n\nSaludos,\n${config.firma}`,
  };
}

/** Enlace wa.me para que ELLOS escriban primero (lo atiende el agente 24/7). Nunca escribimos en frío por WhatsApp. */
export function lineaWhatsapp(env: Entorno, p: Prospecto): string {
  const msg = `Hola, soy de ${p.nombre}. Me interesa la alianza con Mathfra.`;
  return `Si prefieren WhatsApp, escríbannos aquí: https://wa.me/${env.whatsapp}?text=${encodeURIComponent(msg)}`;
}
