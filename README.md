# Mathfra — sitio web

Cursos de ingreso ECOEMS en Santa Clara. Next.js 16 + Tailwind 4 + shadcn/ui + Supabase. Ver `CLAUDE.md` (reglas técnicas), `PRODUCT.md` (negocio y tono) y `design-system/DESIGN.md` (diseño).

## Empezar
```bash
cp .env.example .env.local   # llena las variables
npm install
npm run dev
```

## Editar textos
Todo el contenido está en `src/content/`. Busca `[COMPLETAR` para ver lo pendiente:
```bash
grep -rn "COMPLETAR" src/content
```

## Base de datos
Aplica `supabase/migrations/*.sql` en tu proyecto de Supabase (SQL Editor o `supabase db push`).

## Pruebas
```bash
npx playwright install chromium
npm run test:e2e
```

## Webhooks
- Stripe: `https://mathfra.app/api/v1/stripe/webhook` (eventos `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`).
- Agente de IA: cada formulario se reenvía firmado (`X-Mathfra-Signature: sha256=<HMAC del cuerpo>`) a `AGENTE_WEBHOOK_URL`. Integraciones externas pueden usar `POST /api/webhooks/formularios` con la misma firma.
