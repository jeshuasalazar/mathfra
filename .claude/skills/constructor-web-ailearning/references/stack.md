# Stack recomendado (versiones vigentes al 4-nov-2026)

Instala siempre la versión estable más reciente y fíjala en `package.json`. Si una versión de esta tabla ya no es la última, usa la última.

| Necesidad | Librería | Notas |
|---|---|---|
| Framework | Next.js 16 (App Router, TypeScript estricto) | Server Components; Metadata API; `sitemap.ts`, `robots.ts` y `opengraph-image` integrados. Si es un sitio solo de contenido y nunca será app, Astro 7 también sirve. |
| Estilos | Tailwind CSS 4 | Se configura en CSS (`@theme`). Ahí se cargan los tokens del sistema de diseño. |
| Componentes | shadcn/ui (`npx shadcn@latest init`) | Usa `tw-animate-css` y Sonner para avisos. Ajusta cada componente a los tokens. |
| Animación | Motion (`motion`, importa desde `motion/react`) | Respeta `prefers-reduced-motion`. |
| Formularios | React Hook Form 7 + Zod 4 | El mismo esquema valida en el cliente y en el servidor (Server Action). |
| Anti-bots | Cloudflare Turnstile (`@marsidev/react-turnstile`) | El token se verifica **siempre** en el servidor con `siteverify`. |
| Correo | Resend + React Email | Aviso al negocio y acuse al cliente. Los dominios de envío se verifican con DNS. |
| Base de datos | Postgres en Railway + Drizzle ORM | Usa migraciones. Si hay cuentas de usuario: Supabase (Auth + RLS). |
| Aviso de cookies | `vanilla-cookieconsent` v3 | Ligero y compatible con Consent Mode. Alternativa: c15t (`@c15t/nextjs`), si se necesitan registros de consentimiento o IAB TCF. |
| Analítica | Umami o Plausible (sin cookies) | GA4 solo con consentimiento + Consent Mode v2. |
| SEO estructurado | `schema-dts` | JSON-LD tipado: LocalBusiness (o el subtipo del giro), Organization, BreadcrumbList, FAQPage. |
| Idiomas | next-intl 4 | Rutas `/es` y `/en` con `hreflang`. |
| Agenda | Cal.com (incrustado) | |
| Pagos | Stripe Checkout (tarjeta y OXXO) o Mercado Pago | Webhooks verificados. Precios en MXN con IVA. |
| Blog | MDX en el repositorio o Keystatic | Payload CMS 3 solo si se necesita un panel completo. |
| Imágenes | `next/image` + sharp | AVIF y WebP, con `sizes` correctos. |
| Pruebas | Playwright + `@axe-core/playwright` | |

## Visible para las IA (llms.txt)
- `/llms.txt` (llmstxt.org) lleva:
  - un H1 con el nombre del negocio;
  - una cita (`>`) con el resumen;
  - secciones H2 con enlaces a las páginas clave: servicios, precios, contacto, preguntas.
- Cada página clave tiene una copia en Markdown, enlazada con `<link rel="alternate" type="text/markdown">`.
- `robots.ts` permite los rastreadores de IA, salvo que la persona diga lo contrario.

## Encabezados de seguridad (next.config)
`Content-Security-Policy` (con nonce si hay scripts en línea), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (sin cámara, micrófono ni geolocalización salvo que se usen) y `X-Frame-Options: DENY`.

## Skills que conviene tener
- `frontend-design` de Anthropic (github.com/anthropics/skills, carpeta `skills/frontend-design`): sirve para la dirección de arte.
- `webapp-testing` del mismo repositorio: sirve para probar en el navegador.
