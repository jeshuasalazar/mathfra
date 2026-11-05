@AGENTS.md

# CLAUDE.md — Mathfra web

Lee `PRODUCT.md` (negocio y tono) y `design-system/DESIGN.md` (reglas visuales obligatorias) antes de tocar la interfaz.

## Stack
- Next.js 16 (App Router, TypeScript estricto, Cache Components, Turbopack) · React 19
- Tailwind CSS 4 (tema en `src/app/globals.css`, mapeado a los tokens `--mf-*`) · shadcn/ui (`components.json`, `src/components/ui`)
- Supabase (Postgres + Auth + RLS) — migraciones en `supabase/migrations`
- Motion (`motion/react`), next/image + sharp, next/font (Archivo + Archivo Black)
- React Hook Form + Zod, Cloudflare Turnstile, Resend + React Email, Stripe Checkout, Umami (sin cookies, solo con consentimiento)
- Pruebas: Playwright + @axe-core/playwright (`tests/`)

## Comandos
- `npm run dev` · `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`
- `npm run test:e2e` (levanta el build en el puerto 3100)

## Estructura
- `src/content/` — TODO el texto editable (sitio, páginas, FAQ, temario, precios, legal). Cambia textos aquí, no en componentes.
- `src/components/sections/` — una sección = un componente. `src/components/layout/` — barra, pie, flotante. `src/components/privacy/` — cookies.
- `src/lib/` — lógica (whatsapp, supabase, correo, rate limit, validación, analítica). `src/app/api/v1/` — API versionada.
- `design-system/` — fuente de verdad visual exportada de Claude Design. `src/styles/mathfra.css` es su traducción.

## Reglas de diseño
- Solo tokens `--mf-*` (o sus alias de Tailwind `bg-mf-*`, `text-mf-*`). No inventes colores, fuentes, radios ni sombras.
- Un solo azul (`primary`) para actuar; el acento verde-agua solo marca (`.mf-mark`, insignias, paso clave). Nunca en botones ni enlaces.
- Bordes de tinta 2–3 px, sombras sólidas 2/4/6 px. Radios 6/10/16/píldora.
- Máximo 2 botones por sección. Un solo `h1` por página. Alinear a la izquierda.
- Íconos: Lucide (`lucide-react`) vía `<Icon name=…>`; WhatsApp es la única marca.

## Nunca hagas
- Degradados, glassmorphism, blur, sombras difusas o > 6 px, emojis como íconos.
- 3+ tarjetas idénticas en fila. Todo centrado. La cifra gigante sobre degradado.
- Fotos de stock o personas generadas presentadas como alumnos.
- Inventar cifras, reseñas, testimonios, precios o fechas: usa `[COMPLETAR: …]`.
- Mencionar al INAI (la autoridad es la Secretaría Anticorrupción y Buen Gobierno).
- Cargar analítica o marketing antes del consentimiento. Casillas de consentimiento premarcadas.
- Subir llaves al repositorio: solo `.env.local` / variables de Railway. Documenta en `.env.example`.
