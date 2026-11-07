/**
 * Pruebas automáticas (node --test): puntaje, deduplicación, lista de bajas, reglas de correo,
 * y que NINGÚN correo salga sin pie legal. Sin red: el MX se simula.
 * Correr: npm run test:unit
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { calificar, nivelDe, puntosCercania } from "../calificar.ts";
import { limpiar, listasVacias, unirDuplicados } from "../limpiar.ts";
import { armarCorreoFinal, faltantesLegales, leerTokenBaja, revisarPieLegal, tokenBaja } from "../legal.ts";
import { normalizarTelefono, revisarCorreo } from "../texto.ts";
import { esExcluido, nombreDesde, tamanoDesdeEstrato } from "../encontrar.ts";
import { plantillaFija, seguimiento, validarCuerpo } from "../personalizar.ts";
import { clasificar } from "../respuestas.ts";
import { esCorridaSemanal, esHorarioDeEnvio, pasoQueToca } from "../secuencia.ts";
import { candidatosDesdeCsv } from "../importar-csv.ts";
import { config, entorno, type Entorno } from "../config.ts";
import type { Candidato, Prospecto } from "../tipos.ts";

const mxSi = async () => true;
const mxNo = async () => false;
const hoy = "2026-11-06";

const cand = (x: Partial<Candidato> = {}): Candidato => ({
  nombre: "Café Ejemplo", giroId: "restaurantes", web: "https://cafeejemplo.mx", correos: ["hola@cafeejemplo.mx"],
  telefonos: ["55 1234 5678"], textoPagina: "cafetería y brunch", fuentes: [
    { campo: "nombre", url: "https://cafeejemplo.mx", fecha: hoy, proveedor: "exa" },
    { campo: "web", url: "https://cafeejemplo.mx", fecha: hoy, proveedor: "exa" },
    { campo: "correo", url: "https://cafeejemplo.mx/contacto", fecha: hoy, proveedor: "exa" },
  ], ...x,
});

const envListo = (): Entorno => ({
  ...entorno(),
  domicilio: "Calle Ejemplo 123, Col. Del Valle, Benito Juárez, CDMX, CP 03100, México",
  from: "Mtro. Hector · Mathfra <hector@mathfra.app>",
  replyTo: "hector@mathfra.app",
  secreto: "s".repeat(32),
  resendKey: "re_test",
  sitio: "https://mathfra.app",
});

// ---------- Puntaje ----------

test("puntaje: tabla completa da 100 y caliente", () => {
  const p = calificar({ ...cand(), correo: "hola@cafeejemplo.mx", telefono: "+525512345678", tamano: "micro", lat: config.centro.lat, lon: config.centro.lon });
  assert.equal(p.puntos, 40 + 15 + 15 + 14 + 10 + 6);
  assert.equal(p.nivel, "caliente");
  assert.ok(p.motivos.some((m) => m.startsWith("+40")));
});

test("puntaje: sin tamaño ni ubicación → 70 tibio (como el CSV de aiLearning)", () => {
  const p = calificar({ ...cand(), correo: "hola@cafeejemplo.mx", telefono: "+525512345678" });
  assert.equal(p.puntos, 70);
  assert.equal(p.nivel, "tibio");
});

test("puntaje: tamaño fuera de mis tamaños no suma; giro no confirmado no suma 40", () => {
  const p = calificar({ ...cand({ nombre: "Zeta", textoPagina: "nada que ver", fuentes: [] }), correo: "hola@cafeejemplo.mx", tamano: "grande" });
  assert.equal(p.puntos, 14 + 6);
  assert.equal(p.nivel, "frio");
});

test("umbrales y cercanía", () => {
  assert.equal(nivelDe(75), "caliente");
  assert.equal(nivelDe(74), "tibio");
  assert.equal(nivelDe(55), "tibio");
  assert.equal(nivelDe(54), "frio");
  assert.equal(puntosCercania(0.2), 15);
  assert.equal(puntosCercania(3), 0);
  assert.equal(puntosCercania(5), 0);
  assert.equal(puntosCercania(undefined), 0);
  assert.ok(puntosCercania(1.75) > 0 && puntosCercania(1.75) < 15);
});

test("tamaño desde el Estrato de DENUE", () => {
  assert.equal(tamanoDesdeEstrato("0 a 5 personas"), "micro");
  assert.equal(tamanoDesdeEstrato("6 a 10 personas"), "micro");
  assert.equal(tamanoDesdeEstrato("11 a 30 personas"), "pequena");
  assert.equal(tamanoDesdeEstrato("31 a 50 personas"), "pequena");
  assert.equal(tamanoDesdeEstrato("51 a 100 personas"), "mediana");
  assert.equal(tamanoDesdeEstrato("251 y más personas"), "grande");
});

// ---------- Deduplicación ----------

test("dedup: mismo dominio, teléfono o CLEE se une en un solo negocio", () => {
  const a = cand();
  const b = cand({ nombre: "CAFE EJEMPLO SA DE CV", web: undefined, correos: [], telefonos: ["+52 55 1234 5678"], clee: "09014XXX", tamano: "micro", fuentes: [{ campo: "clee", url: "denue", fecha: hoy, proveedor: "denue" }] });
  const c = cand({ nombre: "Otro", web: "https://www.cafeejemplo.mx/menu", telefonos: [] });
  const u = unirDuplicados([a, b, c]);
  assert.equal(u.length, 1);
  assert.equal(u[0].clee, "09014XXX");
  assert.equal(u[0].tamano, "micro");
});

test("dedup: no repite lo que ya existe en la base", async () => {
  const l = listasVacias();
  l.existentes.dominios.add("cafeejemplo.mx");
  const r = await limpiar([cand()], l, { mx: mxSi });
  assert.equal(r.limpios.length, 0);
  assert.match(r.descartados[0].motivo, /ya existe/);
});

test("teléfonos a +52", () => {
  assert.equal(normalizarTelefono("55 1234 5678"), "+525512345678");
  assert.equal(normalizarTelefono("+52 1 55 1234 5678"), "+525512345678");
  assert.equal(normalizarTelefono("(55) 1234-5678"), "+525512345678");
  assert.equal(normalizarTelefono("+1 202 457 7161"), undefined);
  assert.equal(normalizarTelefono("123"), undefined);
});

// ---------- Lista de bajas ----------

test("bajas: correo, dominio o teléfono en la lista → nunca se guarda", async () => {
  for (const tipo of ["correo", "dominio", "telefono"] as const) {
    const l = listasVacias();
    if (tipo === "correo") l.bloqueados.correos.add("hola@cafeejemplo.mx");
    if (tipo === "dominio") l.bloqueados.dominios.add("cafeejemplo.mx");
    if (tipo === "telefono") l.bloqueados.telefonos.add("+525512345678");
    const r = await limpiar([cand()], l, { mx: mxSi });
    assert.equal(r.limpios.length, 0, tipo);
    assert.match(r.descartados[0].motivo, /bajas/);
  }
});

test("bajas: el token del enlace es válido solo con el secreto correcto", () => {
  const t = tokenBaja("Hola@CafeEjemplo.mx", "secreto-largo-de-prueba-123456");
  assert.equal(leerTokenBaja(t, "secreto-largo-de-prueba-123456"), "hola@cafeejemplo.mx");
  assert.equal(leerTokenBaja(t, "otro-secreto-largo-de-prueba-99"), undefined);
  assert.equal(leerTokenBaja(t.replace(/.$/, "x"), "secreto-largo-de-prueba-123456"), undefined);
  assert.equal(leerTokenBaja("basura", "secreto-largo-de-prueba-123456"), undefined);
});

test("respuestas: «no», «baja» y «no nos interesa» son baja; los demás se clasifican", () => {
  assert.equal(clasificar("No"), "baja");
  assert.equal(clasificar("Favor de darnos de baja"), "baja");
  assert.equal(clasificar("No nos interesa, gracias"), "baja");
  assert.equal(clasificar("Por ahora no, quizá más adelante"), "no_ahora");
  assert.equal(clasificar("Sí, nos interesa. ¿Me mandas información?"), "interesado");
  assert.equal(clasificar("Recibido.\n\nEl mar, 4 nov 2026 escribió:\n> Me interesa"), "otro");
});

// ---------- Reglas de correo y limpieza ----------

test("solo correos genéricos del dominio de su página", () => {
  assert.equal(revisarCorreo("hola@moven.com.mx", "https://moven.com.mx").ok, true);
  assert.equal(revisarCorreo("servicio@haut.mx", "https://hautboutique.com").ok, true);
  assert.equal(revisarCorreo("priscila.mtzb@gmail.com", "https://restaurante-nuusavi.com").ok, false);
  assert.equal(revisarCorreo("expressvillagecafe@gmail.com", "https://villagecafe.com.mx").ok, false);
  assert.equal(revisarCorreo("n@grupocantarell.com", "https://workspaces.centtro.mx").ok, false);
  assert.equal(revisarCorreo("glzchevez@gonzalezchevez.com", "https://gonzalezchevez.com").ok, false);
  assert.equal(revisarCorreo("info@cafenin.com.mx", "https://mbmarcobeteta.com").ok, false);
  assert.equal(revisarCorreo("290117@colegiowilliams.edu.mx", "https://esto-es-moda.ueniweb.com").ok, false);
});

test("descarta directorios, artículos tipo «los 10 mejores» y gobierno", async () => {
  assert.ok(esExcluido("https://www.facebook.com/cafe"));
  assert.ok(esExcluido("https://mexicocity.directory/benito-juarez"));
  assert.ok(esExcluido("https://blog.ejemplo.mx/x", "Los 10 mejores cafés de la Del Valle"));
  assert.equal(esExcluido("https://cafeejemplo.mx", "Café Ejemplo | Inicio"), undefined);
  const r = await limpiar([cand({ nombre: "Alcaldía Benito Juárez", web: "https://alcaldiabenitojuarez.gob.mx" })], listasVacias(), { mx: mxSi });
  assert.equal(r.limpios.length, 0);
});

test("sin MX el correo no se usa; sin correo ni teléfono se descarta", async () => {
  const r = await limpiar([cand({ telefonos: [] })], listasVacias(), { mx: mxNo });
  assert.equal(r.limpios.length, 0);
  const r2 = await limpiar([cand()], listasVacias(), { mx: mxNo });
  assert.equal(r2.limpios[0].correo, undefined);
  assert.equal(r2.limpios[0].telefono, "+525512345678");
});

test("nombre: de títulos de página al nombre real o al dominio", () => {
  assert.equal(nombreDesde("Sucursales | Café Mandrake", "https://cafemandrake.com"), "Café Mandrake");
  assert.equal(nombreDesde("CDMX", "https://log-on.com.mx"), "Log on");
  assert.equal(nombreDesde("Contacte con nosotros", "https://parquedelta.com.mx"), "Parquedelta");
});

test("importa el CSV de aiLearning y re-califica con las mismas reglas", async () => {
  const csv = "﻿puntos,nivel,nombre,giro,tamano,colonia,direccion,telefono,correo,web,km,canal,fuente,id_fuente,consultado\n"
    + "71,tibio,Möven,Oficinas y empresas,,,,5590003550,hola@moven.com.mx,https://moven.com.mx,,Correo 1 a 1,Página del negocio,web:moven.com.mx,2026-11-06\n"
    + "71,tibio,Restaurante Nuusavi,Restaurantes y cafés,,,,5545204192,priscila.mtzb@gmail.com,https://restaurante-nuusavi.com,,Correo 1 a 1,Página del negocio,web:restaurante-nuusavi.com,2026-11-06\n";
  const r = await limpiar(candidatosDesdeCsv(csv), listasVacias(), { mx: mxSi });
  const moven = r.limpios.find((x) => x.nombre === "Möven")!;
  assert.equal(moven.correo, "hola@moven.com.mx");
  assert.equal(r.limpios.find((x) => x.nombre === "Restaurante Nuusavi")!.correo, undefined); // personal: fuera
  assert.equal(calificar(moven).puntos, 70);
  assert.ok(moven.fuentes.some((f) => f.campo === "correo" && f.url === "https://moven.com.mx" && f.fecha === "2026-11-06"));
});

// ---------- Ningún correo sin pie legal ----------

const prospecto = (): Prospecto => calificar({ ...cand(), correo: "hola@cafeejemplo.mx", telefono: "+525512345678", colonia: "Del Valle" });

test("pie legal: el correo final lleva quién soy, domicilio, contacto, origen, aviso y baja", () => {
  const env = envListo();
  const p = prospecto();
  const f = armarCorreoFinal(plantillaFija(p), { correo: p.correo!, fuentes: p.fuentes }, env);
  assert.deepEqual(revisarPieLegal(f.texto, env), []);
  assert.match(f.texto, /Obtuvimos este correo de su página web \(cafeejemplo\.mx\/contacto, consultada el 2026-11-06\)/);
  assert.ok(f.texto.includes("https://mathfra.app/aviso-de-privacidad"));
  assert.ok(f.html.includes("/api/v1/prospeccion/baja?t="));
  assert.match(f.headers["List-Unsubscribe"], /\/api\/v1\/prospeccion\/baja\?t=/);
  assert.equal(f.headers["List-Unsubscribe-Post"], "List-Unsubscribe=One-Click");
});

test("pie legal: sin domicilio, remitente o secreto NO se arma el correo", () => {
  const p = prospecto();
  for (const quitar of ["domicilio", "from", "secreto", "resendKey"] as const) {
    const env = { ...envListo(), [quitar]: undefined };
    assert.throws(() => armarCorreoFinal(plantillaFija(p), { correo: p.correo!, fuentes: p.fuentes }, env), /No se envía/, quitar);
  }
  assert.throws(() => armarCorreoFinal(plantillaFija(p), { correo: p.correo!, fuentes: p.fuentes }, { ...envListo(), domicilio: "[COMPLETAR: domicilio exacto]" }), /No se envía/);
  assert.ok(faltantesLegales({ ...envListo(), domicilio: "Santa Clara California" }).length > 0);
});

test("pie legal: un texto sin pie no pasa la revisión", () => {
  const env = envListo();
  assert.ok(revisarPieLegal("Hola, equipo. Saludos, Mtro. Hector", env).length >= 5);
});

test("todas las plantillas (día 0, 3 y 10) pasan con pie legal", () => {
  const env = envListo();
  const p = prospecto();
  for (const c of [plantillaFija(p), seguimiento(1, p), seguimiento(2, p)]) {
    const f = armarCorreoFinal(c, { correo: p.correo!, fuentes: p.fuentes }, env);
    assert.deepEqual(revisarPieLegal(f.texto, env), []);
  }
});

// ---------- Contenido de la IA ----------

test("validación de la IA: sin cifras, halagos, enlaces ni más de 90 palabras", () => {
  const p = prospecto();
  assert.deepEqual(validarCuerpo(plantillaFija(p), p), []);
  assert.ok(validarCuerpo({ asunto: "Hola", texto: `Hola, equipo de ${p.nombre}: tienen el mejor café. Saludos,\n${config.firma}` }, p).length);
  assert.ok(validarCuerpo({ asunto: "Hola", texto: `Hola, equipo de ${p.nombre}: ayudamos a 300 alumnos. Saludos,\n${config.firma}` }, p).length);
  assert.ok(validarCuerpo({ asunto: "Hola", texto: `Hola, equipo de ${p.nombre}: ${"palabra ".repeat(95)} Saludos,\n${config.firma}` }, p).length);
  assert.ok(validarCuerpo({ asunto: "Hola", texto: `Hola, equipo: vean https://x.com. Saludos,\n${config.firma}` }, p).length);
});

// ---------- Secuencia ----------

test("secuencia: día 3 y día 10, y se detiene si contestan", () => {
  const d0 = new Date("2026-11-09T14:00:00Z");
  const dia = (n: number) => new Date(d0.getTime() + n * 86400000);
  const e0 = [{ paso: 0, enviado_en: d0.toISOString(), estado: "enviado" }];
  assert.equal(pasoQueToca("en_secuencia", e0, dia(2)), undefined);
  assert.equal(pasoQueToca("en_secuencia", e0, dia(3)), 1);
  const e1 = [...e0, { paso: 1, enviado_en: dia(3).toISOString(), estado: "enviado" }];
  assert.equal(pasoQueToca("en_secuencia", e1, dia(9)), undefined);
  assert.equal(pasoQueToca("en_secuencia", e1, dia(10)), 2);
  const e2 = [...e1, { paso: 2, enviado_en: dia(10).toISOString(), estado: "enviado" }];
  assert.equal(pasoQueToca("en_secuencia", e2, dia(30)), undefined); // máximo 3 toques
  for (const estado of ["respondio", "interesado", "no_ahora", "baja"]) assert.equal(pasoQueToca(estado, e1, dia(10)), undefined);
  // Si rechazaste el día 3 en la cola, no se manda el día 10.
  assert.equal(pasoQueToca("en_secuencia", [...e0, { paso: 1, enviado_en: null, estado: "rechazado" }], dia(10)), undefined);
});

test("horario: lunes 14:00 UTC es la corrida semanal (8:00 CDMX)", () => {
  assert.equal(esCorridaSemanal(new Date("2026-11-09T14:05:00Z")), true);
  assert.equal(esCorridaSemanal(new Date("2026-11-09T15:05:00Z")), false);
  assert.equal(esHorarioDeEnvio(new Date("2026-11-08T16:00:00Z")), false); // domingo
  assert.equal(esHorarioDeEnvio(new Date("2026-11-10T03:00:00Z")), false); // lunes 21:00 CDMX
});
