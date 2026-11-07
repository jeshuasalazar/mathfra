#!/usr/bin/env node
// Capturas de revisión en 390, 768 y 1440 px (skill Constructor web aiLearning).
// Uso: node .claude/skills/constructor-web-ailearning/scripts/capturas.mjs http://localhost:3000 [/ruta ...]
// Sin rutas, lee /sitemap.xml y toma hasta 12. Guarda en ./capturas/<ancho>/<ruta>.png
// Requiere @playwright/test (npm i -D @playwright/test && npx playwright install chromium).
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [base = 'http://localhost:3000', ...rutasArg] = process.argv.slice(2);
let chromium;
try { ({ chromium } = await import('@playwright/test')); }
catch { console.error('Falta Playwright: npm i -D @playwright/test && npx playwright install chromium'); process.exit(1); }

async function rutas() {
  if (rutasArg.length) return rutasArg;
  try {
    const xml = await (await fetch(new URL('/sitemap.xml', base))).text();
    const r = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
    if (r.length) return [...new Set(r)].slice(0, 12);
  } catch { /* sin sitemap todavía */ }
  return ['/'];
}

const ANCHOS = [390, 768, 1440];
const navegador = await chromium.launch();
const lista = await rutas();
for (const ancho of ANCHOS) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: ancho < 800 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const pag = await ctx.newPage();
  const dir = join('capturas', String(ancho)); mkdirSync(dir, { recursive: true });
  for (const r of lista) {
    await pag.goto(new URL(r, base).href, { waitUntil: 'networkidle' });
    const desborde = await pag.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    const archivo = join(dir, (r === '/' ? 'inicio' : r.replace(/^\/|\/$/g, '').replace(/\//g, '_')) + '.png');
    await pag.screenshot({ path: archivo, fullPage: true });
    console.log(`${desborde ? '✗ DESBORDE HORIZONTAL ' : '✓ '}${ancho}px ${r} → ${archivo}`);
  }
  await ctx.close();
}
await navegador.close();
console.log('\nAbre las capturas y revísalas como director de arte: corrige los 3 peores problemas y repite (máximo 3 rondas).');
