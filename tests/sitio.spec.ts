import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paginas = ["/", "/servicios", "/precios", "/clases-y-horarios", "/casos-de-exito", "/nosotros", "/nuestra-causa", "/ubicacion", "/contacto", "/aviso-de-privacidad", "/terminos-y-condiciones", "/politica-de-cookies"];

const rechazarCookies = async (page: import("@playwright/test").Page) => {
  await page.addInitScript(() => localStorage.setItem("mathfra-cookies", JSON.stringify({ necesarias: true, analitica: false, marketing: false, fecha: new Date().toISOString(), version: 1 })));
};

test.describe("navegación", () => {
  for (const p of paginas) {
    test(`carga ${p} con un h1 y el llamado a WhatsApp`, async ({ page }) => {
      await rechazarCookies(page);
      const res = await page.goto(p);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      const wa = page.locator('a[data-cta="whatsapp"]').first();
      await expect(wa).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
    });
  }

  test("el mensaje de WhatsApp incluye la página de origen", async ({ page }) => {
    await rechazarCookies(page);
    await page.goto("/precios");
    const href = await page.locator('a[data-cta="whatsapp"]').first().getAttribute("href");
    expect(decodeURIComponent(href!)).toContain("/precios");
  });

  test("404 útil", async ({ page }) => {
    const res = await page.goto("/no-existe");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("no existe");
  });

  test("menú móvil se abre y cierra con Esc", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo celular");
    await rechazarCookies(page);
    await page.goto("/");
    const btn = page.getByRole("button", { name: "Abrir menú" });
    await btn.click();
    await expect(page.locator("#menu-movil")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-movil")).toBeHidden();
  });

  test("llms.txt, sitemap, robots y Markdown", async ({ request }) => {
    expect((await request.get("/llms.txt")).ok()).toBeTruthy();
    expect(await (await request.get("/llms.txt")).text()).toMatch(/^# Mathfra/);
    expect((await request.get("/sitemap.xml")).ok()).toBeTruthy();
    expect(await (await request.get("/robots.txt")).text()).toContain("GPTBot");
    const md = await request.get("/precios.md");
    expect(md.headers()["content-type"]).toContain("text/markdown");
  });
});

test.describe("formulario de contacto", () => {
  test("muestra errores al enviar vacío", async ({ page }) => {
    await rechazarCookies(page);
    await page.goto("/contacto");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    await expect(page.getByRole("alert").first()).toContainText("Revisa");
    await expect(page.locator("#nombre")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#privacidad")).not.toBeChecked();
  });

  test("envía con datos válidos", async ({ page }) => {
    await rechazarCookies(page);
    await page.goto("/contacto");
    await page.fill("#nombre", "Prueba Automática");
    await page.fill("#email", "prueba@example.com");
    await page.selectOption("#interes", "intensivo");
    await page.fill("#mensaje", "Me quedan seis semanas y física me cuesta.");
    await page.check("#privacidad");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();
    // Con backend: confirmación. Sin Supabase/Resend (CI): aviso claro que manda a WhatsApp, nunca un falso «enviado».
    await expect(page.getByRole("status").or(page.getByRole("alert")).first()).toContainText(/recibimos tu mensaje|WhatsApp/);
  });
});

test.describe("boletín", () => {
  test("pide correo y consentimiento, que llega sin marcar", async ({ page }) => {
    await rechazarCookies(page);
    await page.goto("/");
    const form = page.getByRole("form", { name: "Suscripción al boletín" });
    await expect(form.locator("#nl-consent")).not.toBeChecked();
    await form.getByRole("button", { name: "Suscribirme" }).click();
    await expect(form.locator("#nl-email")).toHaveAttribute("aria-invalid", "true");
    await expect(form.locator("#nl-consent")).toHaveAttribute("aria-invalid", "true");
  });

  test("con datos válidos responde sin un falso «suscrito»", async ({ page }) => {
    await rechazarCookies(page);
    await page.goto("/");
    const form = page.getByRole("form", { name: "Suscripción al boletín" });
    await form.locator("#nl-email").fill("prueba@example.com");
    await form.locator("#nl-consent").check();
    await form.getByRole("button", { name: "Suscribirme" }).click();
    // Con backend: pide confirmar por correo (doble opt-in). Sin Supabase (CI): manda a WhatsApp.
    await expect(form.getByRole("status").or(form.getByRole("alert")).first()).toContainText(/confirmar|WhatsApp/);
  });
});

test.describe("aviso de cookies", () => {
  test("rechazar no carga analítica", async ({ page }) => {
    const pedidas: string[] = [];
    page.on("request", (r) => { if (r.url().includes("test-umami")) pedidas.push(r.url()); });
    await page.goto("/");
    const banner = page.getByTestId("cookie-banner");
    await expect(banner).toBeVisible();
    await expect(page.locator("#umami")).toHaveCount(0);
    await banner.getByRole("button", { name: "Rechazar" }).click();
    await expect(banner).toBeHidden();
    await page.reload();
    await expect(page.getByTestId("cookie-banner")).toHaveCount(0);
    await expect(page.locator("#umami")).toHaveCount(0);
    expect(pedidas).toHaveLength(0);
  });

  test("aceptar carga analítica y las preferencias se reabren desde el pie", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("cookie-banner").getByRole("button", { name: "Aceptar" }).click();
    await expect(page.locator("#umami")).toHaveCount(1);
    await page.getByRole("button", { name: "Preferencias de cookies" }).click();
    const dialog = page.getByRole("dialog", { name: "Preferencias de cookies" });
    await expect(dialog).toBeVisible();
    await expect(page.getByRole("button", { name: "Cerrar" })).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("los tres botones tienen el mismo peso", async ({ page }) => {
    await page.goto("/");
    const btns = page.getByTestId("cookie-banner").getByRole("button");
    await expect(btns).toHaveCount(3);
    const classes = await btns.evaluateAll((els) => els.map((e) => e.className));
    expect(new Set(classes).size).toBe(1);
  });
});

test.describe("accesibilidad (axe, WCAG 2.2 AA)", () => {
  for (const p of ["/", "/precios", "/contacto", "/aviso-de-privacidad", "/clases-y-horarios"]) {
    test(`sin violaciones en ${p}`, async ({ page }) => {
      await rechazarCookies(page);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(p);
      const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
    });
  }
});

test("modo oscuro sin violaciones de contraste", async ({ page }) => {
  await rechazarCookies(page);
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  for (const p of ["/", "/precios", "/contacto"]) {
    await page.goto(p);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    const r = await new AxeBuilder({ page }).withTags(["wcag2aa"]).analyze();
    expect(r.violations.map((v) => `${p} ${v.id}: ${v.nodes.map((n) => n.target.join(" ")).slice(0, 3).join(", ")}`)).toEqual([]);
  }
});
