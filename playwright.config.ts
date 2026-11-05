import { defineConfig, devices } from "@playwright/test";

const PORT = 3101;
export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, locale: "es-MX" },
  projects: [
    { name: "celular", use: { ...devices["Pixel 7"] } },
    { name: "escritorio", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    port: PORT,
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
    // Umami de prueba (archivo local) para comprobar que solo se carga con consentimiento.
    env: { NEXT_PUBLIC_UMAMI_SRC: `http://localhost:${PORT}/test-umami.js`, NEXT_PUBLIC_UMAMI_WEBSITE_ID: "test" },
  },
});
