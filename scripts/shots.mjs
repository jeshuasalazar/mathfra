// Capturas de página completa en 390 / 768 / 1440 px. Uso: node scripts/shots.mjs [ruta...]
import { chromium } from "@playwright/test";
const base = process.env.BASE || "http://localhost:3100";
const out = process.env.OUT || "shots";
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ["/"];
const widths = (process.env.WIDTHS || "390,768,1440").split(",").map(Number);
const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: process.env.SCHEME || "light", reducedMotion: "reduce" });
  await ctx.addInitScript(() => localStorage.setItem("mathfra-cookies", JSON.stringify({ necesarias: true, analitica: false, marketing: false, fecha: new Date().toISOString(), version: 1 })));
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    const name = (p === "/" ? "inicio" : p.replace(/\//g, "_").replace(/^_/, "")) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(name, overflow ? "OVERFLOW-X" : "ok");
  }
  await ctx.close();
}
await browser.close();
