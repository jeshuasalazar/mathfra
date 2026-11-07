#!/usr/bin/env node
// Revisión determinista anti «hecho por IA» (skill Constructor web aiLearning).
// Uso: node .claude/skills/constructor-web-ailearning/scripts/anti-ia.mjs [carpeta=src|app]
// Sale con código 1 si encuentra algo de prioridad alta. No usa IA: solo reglas.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const raices = process.argv.slice(2).length ? process.argv.slice(2) : ['app', 'src', 'components', 'content'].filter(existsSync);
const EXT = new Set(['.tsx', '.ts', '.jsx', '.js', '.mdx', '.md', '.css', '.json']);
const IGNORAR = /node_modules|\.next|dist|\.git|design-system|\.claude/;

// [prioridad, expresión, qué es, qué hacer]
const REGLAS = [
  ['alta', /lorem ipsum|dolor sit amet/i, 'Texto de relleno', 'Escribe el texto real o deja [COMPLETAR].'],
  ['alta', /t[ií]tulo aqu[ií]|texto aqu[ií]|your (title|text) here/i, 'Marcador de plantilla', 'Reemplázalo por contenido real.'],
  ['alta', /\bINAI\b/, 'Mención al INAI (ya no existe)', 'La autoridad es la Secretaría Anticorrupción y Buen Gobierno.'],
  ['alta', /(john|jane) doe|juan p[eé]rez|mar[ií]a garc[ií]a/i, 'Persona de ejemplo (testimonio inventado)', 'Solo testimonios reales.'],
  ['media', /siguiente nivel|soluciones innovadoras|en un mundo (cada vez )?m[aá]s|revoluciona|potencia(r)? tu|transforma tu negocio|desbloquea tu potencial|next level|unlock your/i, 'Frase de relleno de IA', 'Di qué obtiene el cliente, en cuánto tiempo y por qué creerte.'],
  ['media', /from-(purple|violet|fuchsia)-\d+[^"'`]*to-(pink|purple|blue|indigo)-\d+|from-(indigo|blue)-\d+[^"'`]*to-(purple|violet)-\d+/, 'Degradado morado genérico', 'Usa los colores del sistema de diseño.'],
  ['media', /#[0-9a-fA-F]{6}\b/, 'Color hex suelto en el código', 'Usa los tokens del sistema (variables CSS o clases del tema).', /\.(tsx|jsx|ts|js)$/],
  ['media', /\+\s?\d{2,}[,.]?\d*\s?(clientes|usuarios|proyectos) (felices|satisfechos)/i, 'Cifra de relleno', 'Solo cifras reales confirmadas.'],
  ['baja', /[\u{1F300}-\u{1FAFF}]/u, 'Emoji (¿usado como ícono?)', 'Usa el set de íconos del sistema.', /\.(tsx|jsx)$/],
  ['baja', /shadow-(2xl|\[0_\d{2,}px)/, 'Sombra exagerada', 'Usa la sombra de los tokens.']
];

function* archivos(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (IGNORAR.test(p)) continue;
    const s = statSync(p);
    if (s.isDirectory()) yield* archivos(p);
    else if (EXT.has(extname(n))) yield p;
  }
}

const hallazgos = [];
for (const raiz of raices) {
  for (const f of archivos(raiz)) {
    const lineas = readFileSync(f, 'utf8').split('\n');
    lineas.forEach((l, i) => {
      for (const [prio, re, que, hacer, soloEn] of REGLAS) {
        if (soloEn && !soloEn.test(f)) continue;
        if (re.test(l)) hallazgos.push({ prio, f, linea: i + 1, que, hacer });
      }
    });
  }
}

// Todo centrado: si más de 70 % de las secciones llevan text-center.
let secciones = 0, centradas = 0;
for (const raiz of raices) for (const f of archivos(raiz)) {
  if (!/\.(tsx|jsx)$/.test(f)) continue;
  const t = readFileSync(f, 'utf8');
  for (const m of t.matchAll(/<section[^>]*>/g)) { secciones++; if (/text-center/.test(m[0])) centradas++; }
}
if (secciones >= 4 && centradas / secciones > 0.7) hallazgos.push({ prio: 'media', f: '(todo el sitio)', linea: 0, que: `Casi todo centrado (${centradas}/${secciones} secciones)`, hacer: 'Alterna alineaciones y usa una retícula con tensión.' });

const orden = { alta: 0, media: 1, baja: 2 };
hallazgos.sort((a, b) => orden[a.prio] - orden[b.prio]);
if (!hallazgos.length) { console.log('✓ Revisión anti-IA limpia.'); process.exit(0); }
for (const h of hallazgos) console.log(`[${h.prio}] ${h.f}${h.linea ? ':' + h.linea : ''} — ${h.que}. ${h.hacer}`);
console.log(`\n${hallazgos.length} hallazgo(s). Corrige los de prioridad alta antes de publicar.`);
process.exit(hallazgos.some((h) => h.prio === 'alta') ? 1 : 0);
