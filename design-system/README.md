# Mathfra — Sistema de diseño

Mathfra ofrece cursos de ingreso al ECOEMS en Santa Clara para quien está terminando o ya terminó la secundaria y quiere quedarse en su primera opción. Su diferencia: un método que empieza por las áreas más difíciles del examen. El sitio tiene un solo objetivo: que el visitante escriba por WhatsApp («Escríbenos por WhatsApp»).

**Las reglas completas están en [`DESIGN.md`](DESIGN.md).** Este archivo es el índice.

## Concepto: «Lo difícil, marcado»
Tinta negra que ordena (bordes 2–3 px, sombras sólidas), un solo azul que actúa y un verde-agua que solo subraya lo importante, como una guía de estudio marcada. Estilo neo-brutalista equilibrado.

## Fuentes del brief
- Brief del cliente (paleta «Océano confiable», Archivo Black + Archivo, neo-brutalismo, claro/oscuro).
- Referencias citadas (solo inspiración; no se copió nada): 2 capturas de pantalla (no llegaron adjuntas al proyecto), Behance «COGNIX AI Education», Framer «Wrenly», Webflow «Education X», recent.design «1Password — A vision of the future» y «Shopify Expo Mode».
- No se entregó logotipo: la marca se escribe en Archivo Black («Mathfra» + cuadrito acento). No se dibujó un logo.

## Contenido (voz)
De tú, español de México, frases cortas y concretas; sin emojis; sin exclamaciones en titulares. Ver DESIGN.md §9.

## Fundamentos visuales
Ver DESIGN.md §1–5 y §7–8. Resumen: fondo #F6F8FC, tinta #0E1726, acción #1E5EFF, marca #22C3A6, bloques #0B1B3F; Archivo Black/Archivo; escala de 4 px; radios 6/10/16; sombras sólidas 2/4/6 px; movimiento sutil con reduced-motion.

## Iconografía
Lucide (línea 2 px) desde CDN pintado por máscara con `currentColor` — `assets/icons.css`. **Sustitución marcada:** no había set propio; Lucide es el elegido. WhatsApp (Simple Icons) es la única marca.

## Índice
- `styles.css` — punto de entrada (solo `@import`).
- `tokens/` — `fonts.css`, `colors.css` (claro + `[data-theme="dark"]`), `typography.css`, `spacing.css` (espacio, radios, bordes, sombras, retícula), `motion.css`, `base.css`.
- `assets/icons.css` — íconos.
- `components/components.css` — todas las clases `mf-*` con estados.
- `components/actions/` — Icon, Button, TextLink, WhatsAppFab.
- `components/forms/` — TextField, SelectField, Checkbox, ContactForm.
- `components/content/` — Card, Badge, ServiceCard, Testimonial, PricingTable, FaqAccordion.
- `components/layout/` — Navbar, Footer, Hero.
- `components/privacy/` — CookieBanner, CookiePreferences.
- `guidelines/` — tarjetas de fundamentos (color, contraste, tipo, espacio, profundidad, movimiento, íconos, concepto, voz, ilustración, sí/no).
- `Inicio Mathfra.dc.html` — página de inicio de ejemplo (responsiva, claro/oscuro, cookies funcionales).
- `ui_kits/sitio-web/index.html` — la página vista a 390 px y 1440 px.
- `DESIGN.md` — reglas para Claude Code. `SKILL.md` — para usar como skill.

## Adiciones intencionales
- `Icon` — envoltorio del set de íconos.
- `.mf-areas` (mapa de áreas) — ilustración tipográfica propia del concepto.

## Pendiente del cliente
Número de WhatsApp, precios, duración y fechas, dirección exacta, testimonios reales con permiso, textos legales.
