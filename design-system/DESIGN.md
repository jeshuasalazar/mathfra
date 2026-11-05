# DESIGN.md — Mathfra

Reglas obligatorias para construir el sitio de Mathfra. Si algo no está aquí, usa el token más cercano; nunca inventes valores. Todo vive en `styles.css` (tokens + componentes). Prefijo de clases y tokens: `mf-`.

## 0. Concepto
1. **Lo que solo Mathfra tiene:** un método que no reparte el tiempo parejo: diagnostica y ataca primero las áreas más difíciles del ECOEMS (habilidad matemática, matemáticas, física, química).
2. **Concepto: «Lo difícil, marcado».** El sitio se comporta como una guía de estudio subrayada: tinta negra que ordena (bordes 2–3 px, sombras sólidas), un solo azul que actúa (botones) y un verde-agua que solo marca lo importante (marcatexto).
3. **Clichés que evitamos:** birretes/lápices/focos y fotos de stock de estudiantes sonriendo · la cifra gigante de «98 % aprobados» sobre degradado · rejilla de 3 tarjetas idénticas de «beneficios» con íconos de colores.

## 1. Color
Usa solo tokens semánticos (`--mf-color-*`). Modo oscuro: `data-theme="dark"` en `<html>`; selector en la barra (ícono luna/sol, se guarda en `localStorage["mathfra-theme"]`; por defecto sigue `prefers-color-scheme`).

| Token | Claro | Oscuro | Uso |
|---|---|---|---|
| primary | #1E5EFF | #1E5EFF | ÚNICO color de acción (botón principal, casilla marcada, foco en claro) |
| primary-hover / active | #1449D6 / #0F3AB0 | #3B74FF / #1449D6 | estados del botón |
| on-primary | #FFFFFF | #FFFFFF | texto sobre primario (5.12:1) |
| secondary | #0B1B3F | #172A55 | bloques de contraste (CTA final, pie) |
| accent | #22C3A6 | #22C3A6 | marcatexto, «área difícil», paso clave. **Nunca** en botones ni enlaces |
| accent-soft | #C8F2EA | #0F4A47 | fondo de acordeón abierto, avatar |
| bg | #F6F8FC | #081127 | fondo de página |
| surface / surface-2 | #FFFFFF / #E9EEF8 | #0F1D3D / #172A55 | tarjetas / bandas alternas, hover |
| border | #0E1726 | #E4EBFA | bordes de tinta |
| border-soft | #C5CEDF | #33466F | divisores internos (decorativos) |
| text / text-soft | #0E1726 / #46536B | #F6F8FC / #B4C0D9 | texto |
| link | #1E5EFF | #8EAEFF | enlaces |
| success / warning / error | #0B7A47 / #A35200 / #C4221F | #3DDC97 / #F5B544 / #FF8A80 | estados (+ `-soft` para fondos) |
| focus | #1E5EFF | #22C3A6 | contorno de foco |
| shadow | #0E1726 | #E4EBFA | sombras sólidas |

**Contraste verificado (WCAG 2.2 AA):** texto/fondo 16.89 · texto suave/fondo 7.29 · blanco/primario 5.12 · enlace/fondo 4.82 · tinta/acento 8.06 · éxito 5.40 · aviso 5.58 · error 5.84. Oscuro: texto 17.64 · texto suave 10.25 · enlace 8.62 · primario vs fondo 3.66 (elemento ≥3:1) · error/superficie 7.28. Texto deshabilitado está exento.

## 2. Tipografía
- Títulos: **Archivo Black** (`--mf-font-display`), peso 400 (ya es black). Texto: **Archivo** 400/500/600/700 (`--mf-font-body`). Respaldo: `system-ui`.
- Escala fluida (390 → 1440 px): display 42→88 · h1 36→64 · h2 28→44 · h3 20→26 · lead 18→20 · cuerpo 16 · pequeño 14 · etiqueta 13 (mayúsculas, +0.08em, 700).
- Interlineado: display 0.95 · títulos 1.05 · h3 1.3 · cuerpo 1.6. Interletrado: display −0.025em · títulos −0.015em.
- Párrafos máx. `--mf-measure` (62ch). `text-wrap: balance` en títulos, `pretty` en párrafos.
- **Marcatexto** `.mf-mark`: máximo UN fragmento por titular (2–3 palabras), siempre lo difícil o lo importante. Variante `.mf-mark--sweep` + `.is-in` anima el barrido.

## 3. Espaciado y retícula
- Escala de 4 px: `--mf-space-1…32` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Sección: `--mf-section-y` clamp(64→128). Márgenes laterales `--mf-gutter` clamp(20→40). Contenedor 1200 px (`.mf-container`).
- Retícula: una columna en celular; en ≥900–1024 px, composiciones asimétricas (1.25fr / 1fr en portada; título a la izquierda + contenido a la derecha en Método y Preguntas). `grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr))`.
- **Prohibido** 3+ tarjetas idénticas en fila. Si hay 3 elementos, uno se distingue (p. ej. el paso 2 en acento) o se usan filas.
- Una idea por sección, máximo 2 botones por sección (principal + secundario).

## 4. Profundidad
- Bordes: 2 px (`--mf-border`) por defecto; 3 px (`--mf-border-strong`) para elementos protagonistas (mapa de áreas, plan recomendado, aviso de cookies, modal).
- Sombras sólidas sin desenfoque: sm 2 px (presionado), base 4 px (reposo), lg 6 px (hover/modal). Nunca más de 6 px, nunca difusas, nunca de color salvo: plan recomendado (6 px primario) y CTA final sobre azul marino (4 px acento).
- Radios: 6 (casilla, chips internos) · 10 (botones, campos) · 16 (tarjetas, modal) · píldora (insignias, flotante).
- Sin degradados, sin transparencias, sin blur. Única transparencia: fondo del modal (`--mf-color-overlay`).

## 5. Movimiento
- Duraciones: 80 (presión) · 140 (hover) · 220 (acordeón/modal) · 420 (entrada de sección) · 700 (marcatexto).
- Curvas: `--mf-ease-out` para entradas; `--mf-ease-in-out` para cambios; `--mf-ease-snap` solo para la palomita.
- Patrones: hover = sube 2 px y la sombra pasa de 4 a 6 px; active = baja 2 px y la sombra pasa a 2 px; entrada de sección = opacidad 0→1 + 12 px hacia arriba, una sola vez; marcatexto = barrido izquierda→derecha.
- `prefers-reduced-motion: reduce` anula todas las duraciones (tokens) y el desplazamiento. Nada parpadea ni se mueve en bucle salvo el spinner de carga.

## 6. Componentes (clases en `components/components.css`, React en `components/*/`)
Estados obligatorios en todo lo interactivo: normal · hover · foco visible (contorno 3 px `--mf-color-focus`, separación 3–4 px) · activo · deshabilitado · cargando (`aria-busy="true"` + spinner) · error (`aria-invalid="true"` + mensaje).

- **Botón** `.mf-btn .mf-btn--primary|--secondary [--sm|--lg|--block]`: 48 px de alto (sm 44, lg 56). Principal = WhatsApp siempre con ícono `whatsapp` y el texto «Escríbenos por WhatsApp». Secundario = blanco con borde. Cargando: texto «Enviando…».
- **Enlace** `.mf-link` (44 px de zona tocable) y `.mf-link--inline` en párrafos.
- **Campo** `.mf-field > .mf-label + [.mf-help] + .mf-input + [.mf-errmsg]`. Etiqueta siempre visible; nunca placeholder como etiqueta. Foco: borde y sombra azul 4 px. Error: borde y sombra roja + mensaje con ícono `alert`, enlazado por `aria-describedby`.
- **Selector** `.mf-select-wrap > select.mf-select + .mf-icon.mf-i-chevron-down` (nativo).
- **Casilla** `label.mf-check > input[type=checkbox] + span` (24 px, zona de 44 px).
- **Formulario** `.mf-form` (+ `.mf-form__row`): validar al enviar; resumen `.mf-alert--error role="alert"` arriba; confirmación `.mf-alert--success role="status"`. Es respaldo: la acción principal sigue siendo WhatsApp.
- **Tarjeta** `.mf-card` (+ `--interactive` si toda es enlace, `--flat` dentro de otra superficie).
- **Insignia** `.mf-badge` + tono `accent` (área difícil / foco), `primary` (solo «Recomendado»), `success|warning|error`.
- **Barra de navegación** `.mf-nav`: fija arriba; marca en texto «Mathfra» + cuadrito acento; 3 enlaces; selector de modo; CTA. <900 px: botón menú (`aria-expanded`, `aria-controls`) que abre panel con enlaces grandes y CTA de ancho completo. Esc cierra.
- **Pie** `.mf-footer`: azul marino; enlaces legales obligatorios: Aviso de privacidad, Términos y condiciones, Cookies (reabre preferencias).
- **Portada** `.mf-hero`: alineada a la izquierda; etiqueta + titular con marcatexto + lead + 2 botones + nota de respuesta. A la derecha, el **mapa de áreas** `.mf-areas` (las 10 áreas del ECOEMS con las difíciles en acento). En celular los botones ocupan el ancho completo.
- **Tarjeta de servicio** `.mf-card.mf-service`: ícono en bloque acento 52 px, etiqueta, título, texto y lista con palomitas.
- **Testimonio** `figure.mf-card.mf-quote`: cita en Archivo Black, iniciales en círculo (sin fotos). Solo testimonios reales con permiso; mientras tanto la insignia «Ejemplo · reemplazar…» es obligatoria.
- **Precios** `.mf-pricing > .mf-plan`: 2–3 planes; uno solo `--featured` con botón principal; los demás con secundario. Cada botón abre WhatsApp con el nombre del plan en el mensaje.
- **Acordeón** `.mf-faq > details[name] > summary + .mf-faq__body`: nativo, accesible sin JS; abierto = fondo acento suave e ícono + girado a ×.
- **Botón flotante** `.mf-fab`: abajo a la derecha, 56 px, respeta safe-area. Se oculta mientras el aviso de cookies, el modal o el menú móvil están abiertos.
- **Aviso de cookies** `.mf-cookie`: «Aceptar», «Rechazar», «Configurar» con la MISMA clase (`mf-btn--secondary mf-btn--sm`), mismo tamaño y orden fijo. No bloquea la página. Guarda en `localStorage["mathfra-cookies"]`.
- **Modal de preferencias** `.mf-modal-backdrop > .mf-modal[role=dialog][aria-modal=true]`: Necesarias (bloqueada), Medición, Publicidad; «Rechazar todo» y «Guardar selección» del mismo peso. Foco al abrir en «Cerrar»; Esc y clic fuera cierran; devolver foco al disparador.

## 7. Iconografía
Lucide (línea 2 px, extremos redondeados) desde CDN, pintado con `currentColor` vía `.mf-icon .mf-i-{nombre}` (ver `assets/icons.css`). Tamaños 16/20/24/32. La marca de WhatsApp (Simple Icons) es la única excepción y solo en acciones de WhatsApp. Íconos siempre con texto al lado (`aria-hidden="true"`); si van solos, el botón lleva `aria-label`. Prohibido: emojis, íconos rellenos, mezclar sets. En producción, sustituye el CDN por los SVG locales de `lucide-static@0.469.0`.

## 8. Imagen
- Ilustración plana con borde de tinta 2–3 px y colores de la paleta: hojas de examen, reactivos, listas marcadas, instrumentos (regla, matraz). El «mapa de áreas» es la ilustración principal y es tipográfica.
- Fotografía solo real: aula, materiales, equipo docente, con permiso; luz natural, sin filtros, recorte firme con borde de 2 px y radio 16.
- **Nunca** personas generadas o de stock presentadas como alumnos o clientes.

## 9. Voz y tono
De tú, español de México, frases cortas y verificables. Habla del tiempo (que no tiene) y de lo concreto (qué área, qué semana). Sin signos de exclamación en titulares, sin «siguiente nivel», sin «potencia», sin promesas de calificación.
Titulares de ejemplo:
1. «Tu primera opción se gana en las áreas difíciles.»
2. «Te decimos qué estudiar cada semana. Tú solo llegas.»
3. «Matemáticas, física y química primero. Lo demás cae solo.»
CTA: siempre «Escríbenos por WhatsApp». Mensaje prellenado: «Hola, quiero información del curso de ingreso ECOEMS.»

## 10. Qué sí y qué no
Sí: un azul para actuar · acento solo para marcar · alinear a la izquierda · asimetría con propósito · datos reales del examen · una idea por sección · bordes y sombras sólidas consistentes.
No: degradados (morado-rosa o cualquiera) · todo centrado · tarjetas idénticas en fila · cifra gigante + degradado · emojis como íconos · sombras >6 px o difusas · glassmorphism · frases de relleno · fotos de stock · acento en botones · más de 2 botones por sección.

## 11. Celular primero y accesibilidad
- Diseña a 390 px y escala hacia arriba; puntos de quiebre 600 / 900 / 1024 px.
- Todo lo tocable ≥44×44 px (`--mf-tap`); botones de 48 px.
- Enlace «Saltar al contenido» (`.mf-skip`), `lang="es-MX"`, un solo `h1`, jerarquía de títulos sin saltos, `nav` con `aria-label`.
- Foco siempre visible; nunca `outline: none` sin reemplazo.
- Errores: texto + ícono + color (nunca solo color).
- Respeta `prefers-reduced-motion` y `prefers-color-scheme`.
- Pasada de resta: antes de publicar, quita todo elemento que no ayude a entender o a escribir por WhatsApp.
