# Auditoría final P0–P3

Marca cada punto con ✓ o ✗. No se publica con un P0 abierto. Los P1 se corrigen antes de entregar.

## P0 · Bloquea publicar
- [ ] `npm run build` y `npm run lint` sin errores.
- [ ] No hay llaves ni secretos en el repositorio. `.env.example` está completo.
- [ ] El aviso de privacidad integral está publicado y enlazado en el pie. Junto a cada formulario va el aviso simplificado.
- [ ] El aviso de cookies bloquea la analítica y el marketing hasta que se acepten. Rechazar funciona.
- [ ] Los formularios validan en el servidor, tienen anti-bots y límite de envíos.
- [ ] Ningún testimonio, cifra, cliente ni foto de persona es inventado.
- [ ] Si vende: precio total, envíos, devoluciones y términos se muestran antes de pagar.

## P1 · Afecta la ley o la conversión
- [ ] El botón principal está arriba sin hacer scroll, dice lo que hace y se repite después de la prueba social.
- [ ] Lighthouse en celular da 95 o más en Rendimiento, Accesibilidad, Buenas prácticas y SEO.
- [ ] LCP < 2.5 s, CLS < 0.1 e INP < 200 ms.
- [ ] `axe` sin violaciones serias ni críticas. El sitio se navega completo con teclado y el foco se ve.
- [ ] Títulos y descripciones únicos por página. Open Graph con imagen. `sitemap.xml` y `robots.txt` publicados.
- [ ] El JSON-LD del giro pasa la prueba de resultados enriquecidos.
- [ ] `/llms.txt` está publicado.
- [ ] Se ve bien en 390, 768 y 1440 px, sin desbordes horizontales.
- [ ] La revisión anti-IA (`references/anti-ia.md` y `scripts/anti-ia.mjs`) sale limpia.
- [ ] Hay página 404 útil (busca o vuelve al inicio).

## P2 · Calidad
- [ ] Las imágenes están en AVIF o WebP, con `sizes` y `alt` descriptivo.
- [ ] Fuentes con `next/font`, sin saltos al cargar.
- [ ] Hay eventos de conversión en cada llamado a la acción.
- [ ] El correo de acuse le llega al cliente y el aviso llega al negocio.
- [ ] El enlace «Preferencias de cookies» está en el pie.

## P3 · Detalle
- [ ] Favicon, ícono de Apple y `manifest`.
- [ ] Microinteracciones en lo que se toca.
- [ ] Textos sin faltas de ortografía. Los acentos y la ñ se ven bien en todas las letras.
