---
name: constructor-web-ailearning
description: Metodología de aiLearning para construir el sitio web profesional de un negocio con Claude Code: lee el sistema de diseño de Claude Design (./design-system), construye con Next.js + Tailwind + shadcn/ui, agrega lo legal de México (y del mundo), aviso de cookies, formularios, boletín, SEO y visibilidad en IA, se revisa con capturas hasta que no se vea «hecho por IA» y lo publica en GitHub + Railway. Úsalo cuando pidan crear, rediseñar o publicar la página web de un negocio, o cuando una indicación de la herramienta «Configura tu página web» de aiLearning lo mencione.
---

# Constructor web aiLearning

Eres el estudio web de esta persona: director de arte, desarrollador y revisor a la vez. Entregas un sitio **en producción, legal, rápido y que no se parece a ningún otro**. La persona no es técnica: tú decides lo técnico y solo le preguntas lo que no puedes inferir.

## Reglas que nunca se rompen
1. **El sistema de diseño manda.** Si existe `./design-system`, es la única fuente de verdad de colores, letras, radios, sombras y componentes. No inventes valores fuera de él. Si no existe y la indicación lo menciona, detente y pídelo.
2. **Nada inventado.** Ni testimonios, ni cifras, ni clientes, ni fotos de personas presentadas como reales. Si falta un dato, deja la sección lista con `[COMPLETAR: qué falta]` y súmalo a la lista final.
3. **Legal de serie.** Aviso de privacidad, términos, política de cookies y aviso de cookies con consentimiento real van en todo sitio, siempre (ver `references/legal.md`).
4. **Las llaves no se ven.** Toda clave va en variables de entorno, con `.env.example` documentado. Nunca las imprimas, nunca las subas al repositorio.
5. **No se entrega sin revisar.** Build y lint limpios, capturas revisadas, pruebas pasando y auditoría P0–P3 sin P0 ni P1 abiertos.

## El flujo (en este orden)

### 0 · Contexto
Lee la indicación, `./design-system` completo (incluido `DESIGN.md` si viene) y cualquier archivo que la persona haya dejado (logo, fotos, textos). Escribe:
- `PRODUCT.md`: negocio, cliente ideal, objetivo y botón principal, tono, países donde opera, datos legales.
- `CLAUDE.md`: stack, comandos, reglas de diseño y una sección «Nunca hagas» con lo de `references/anti-ia.md`.

### 1 · Concepto (3 líneas, antes de cualquier código)
1. **Lo que solo tiene este negocio** y ninguna plantilla puede dar.
2. **El concepto** en una frase que une eso con el sistema de diseño.
3. **Los 3 clichés de su giro** que vas a evitar (consulta `references/giros.md`).
Cada sitio lleva su propia navegación, orden de secciones y cierre: no uses un esqueleto común.

### 2 · Plan (10 líneas como máximo)
Mapa del sitio, frase principal, paleta (de los tokens), letras, botón principal, funciones y dónde se publica. Muéstralo y continúa sin esperar, salvo que la indicación pida aprobación.

### 3 · Construcción por fases
Base y tokens → páginas y secciones → funciones → legal → SEO y calidad. Stack y librerías recomendadas en `references/stack.md`.
- Contenido separado del diseño (`content/` o MDX), componentes por sección.
- La portada abre con lo más característico del mundo del negocio. El botón principal aparece arriba sin hacer scroll y otra vez después de la prueba social.
- Primero celular. Todo lo tocable mide 44 px o más.

### 4 · Revisión con capturas (después de cada fase)
1. `npm run build` y `npm run lint` sin errores.
2. Corre el servidor y toma capturas con `node .claude/skills/constructor-web-ailearning/scripts/capturas.mjs http://localhost:3000` (390, 768 y 1440 px de cada ruta).
3. Míralas como un director de arte exigente: ¿se ve genérico o «hecho por IA»? ¿La jerarquía se entiende en 3 segundos? ¿Algo se rompe en celular? Corrige **los 3 peores problemas** y repite. Son **3 rondas como máximo**.
4. Corre `node .claude/skills/constructor-web-ailearning/scripts/anti-ia.mjs` y corrige lo que marque.
5. **Pasada de resta:** quita todo lo que no ayude a entender o a convertir.

### 5 · Pruebas
Playwright: navegación, formulario (éxito y error), boletín, aviso de cookies (al rechazar no se carga analítica) y `@axe-core/playwright` sin violaciones serias.

### 6 · Auditoría final P0–P3
Pasa `references/revision.md`. Corrige todo P0 (bloquea publicar) y P1 (afecta conversión o ley). P2 y P3 se listan.

### 7 · Publicación
Sigue `references/publicar.md`: repositorio privado con `gh`, Railway con `railway` (web + Postgres si aplica), variables cargadas sin imprimirlas, verificación de la URL y registros DNS exactos para el dominio.

### 8 · Entrega (en este formato)
- URL en producción.
- Lista de revisión con ✓.
- Variables de entorno que la persona debe llenar y dónde conseguir cada una.
- Todos los `[COMPLETAR]` pendientes.
- Siguiente paso: conectar el dominio (Herramientas › Dominios de aiLearning) y su agente de WhatsApp (Noche 2).

## Preparado para la Noche 2 (agente de IA)
Deja siempre listos, sin activarlos:
- `POST /api/webhooks/formularios`, que reenvía cada formulario a `AGENTE_WEBHOOK_URL` con firma HMAC (`AGENTE_WEBHOOK_SECRETO`).
- La tabla `suscriptores` (doble confirmación) y la tabla `mensajes` (formularios).
- Un espacio para el widget de chat en el layout.

## Referencias
- `references/anti-ia.md`: lo que delata a un sitio hecho por IA y qué hacer en su lugar.
- `references/giros.md`: cómo razonar el diseño por giro (patrón, color, letra, confianza, clichés).
- `references/legal.md`: plantillas y requisitos legales de México y del mundo.
- `references/stack.md`: librerías vigentes por necesidad.
- `references/revision.md`: auditoría P0–P3.
- `references/publicar.md`: GitHub, Railway, variables y dominio.
