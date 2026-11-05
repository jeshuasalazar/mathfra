Construye el sitio web de «Mathfra» de principio a fin y déjalo en producción. Trabaja de forma autónoma: decide tú lo técnico, no me hagas preguntas salvo que te falte un dato que no puedas inferir (en ese caso usa un marcador [COMPLETAR: …] y sigue).

<contexto>
- Negocio: Educación en Santa Clara. Vende: Cursos de ingreso ECOEMS. Cliente ideal: Estudiantes a punto dee terminar la secundaria oo secundaria terminada que se quiere quedar en su primera opción.
- Diferenciador: Metodo efectivo centrado en las áreas de conocimiento mas difíciles del exámen.
- Objetivo: que me escriban por whatsapp. Botón principal en todo el sitio: «Escríbenos por WhatsApp».
- Idioma: español de México, tratando de tú.
</contexto>

<cliente_ideal>
- Le vende a: personas.
- Edad: 18–24 años.
- Poder de compra: gasto medio.
- Lo que le duele: Pierde tiempo buscando.
- Lo que quiere lograr: Resolverlo rápido.
- Lo que lo frena para comprar: no tiene tiempo.
- Dónde lo busca: Recomendación.
Escribe cada texto para esta persona: el titular responde a lo que quiere lograr, los beneficios a lo que le duele, y las preguntas frecuentes y la garantía quitan cada freno. Prioriza los canales donde lo busca (Google Business y reseñas si usa Maps; enlaces y vista previa cuidada si llega por Instagram, TikTok o WhatsApp; llms.txt si pregunta a una IA).
</cliente_ideal>

<sistema_de_diseno>
En ./design-system está el sistema de diseño exportado de Claude Design. Antes de escribir código, léelo completo y conviértelo en la única fuente de verdad: tokens en CSS variables + tema de Tailwind, y componentes de shadcn/ui ajustados a esos tokens. No inventes colores, letras ni radios fuera del sistema. Si la carpeta no existe, detente y pídemela.
</sistema_de_diseno>

<skills>
- Si existe .claude/skills/constructor-web-ailearning/SKILL.md, síguelo: es la metodología de aiLearning (plantillas legales, reglas anti «hecho por IA», revisión P0–P3 y publicación).
- Si no tienes el skill frontend-design de Anthropic (github.com/anthropics/skills, carpeta skills/frontend-design), instálalo en .claude/skills/ y úsalo para el diseño.
</skills>

<arquitectura>
- Tipo: base para app — cuentas de usuario y panel: lista para crecer.
- Stack: Next.js 16 (App Router, TypeScript estricto) + Tailwind CSS 4 + shadcn/ui (npx shadcn@latest init), Supabase (Postgres + Auth + RLS), Motion (paquete motion, import desde motion/react) para animaciones, next/image + sharp para imágenes. Usa las versiones estables más recientes y fíjalas en package.json.
- Páginas: Inicio, Contacto, Servicios, Nosotros, Precios o paquetes, Casos de éxito, Clases y horarios, Nuestra causa, Ubicación, más Aviso de privacidad, Términos y condiciones, Política de cookies y una página 404 útil.
- Secciones del inicio, en este orden: Portada con frase y botón → Beneficios → Servicios → Reseñas y testimonios → Preguntas frecuentes → Suscríbete al boletín → Temario → Equipo → Horarios → Certificaciones → Llamado final.
- La portada abre con lo más característico del mundo de este negocio (no con una cifra gigante sobre un degradado). El llamado principal aparece arriba sin hacer scroll y otra vez después de los testimonios.
- Textos reales y persuasivos para este negocio (titular de beneficio, no de característica). Nada de lorem ipsum ni cifras, reseñas o clientes inventados: si falta un dato real, deja la sección lista con [COMPLETAR].
- Componentes reutilizables por sección, contenido separado del diseño (archivo content/ o MDX) para editarlo sin tocar código.
</arquitectura>

<funciones>
- Botón flotante de WhatsApp (https://wa.me/<número>?text=…) con mensaje prellenado que incluya la página de origen; número desde NEXT_PUBLIC_WHATSAPP.
- Formulario de contacto con validación (React Hook Form + Zod) en cliente y servidor (Server Action), protección anti-bots con Cloudflare Turnstile y límite de envíos por IP; guarda cada envío en la base de datos y avisa por correo con Resend + React Email (aviso al negocio y acuse al cliente).
- Suscripción al boletín con doble confirmación (doble opt-in) por correo, casilla de consentimiento sin marcar, tabla `suscriptores` y enlace para darse de baja en cada envío.
- Analítica con Umami o Plausible (sin cookies); si se usa Google Analytics 4, solo tras consentimiento y con Consent Mode v2. Eventos de conversión en cada llamado a la acción.
- Deja preparada la conexión de un agente de IA: endpoint POST /api/webhooks/formularios que reenvía cada formulario a la URL de AGENTE_WEBHOOK_URL (firmado con HMAC) y un espacio para el widget de chat. No lo actives hasta tener la URL.
- Cobros con Stripe Checkout (tarjeta, OXXO y meses si aplica) o Mercado Pago, con webhooks verificados, página de éxito/cancelación y recibo por correo; precios en MXN con IVA explícito.
- Aviso de cookies propio con el estilo del sistema (vanilla-cookieconsent v3 o equivalente): «Aceptar», «Rechazar» y «Configurar» con el mismo peso, categorías (necesarias, analítica, marketing), bloqueo previo de scripts no esenciales, Google Consent Mode v2 si hay Google, y enlace permanente «Preferencias de cookies» en el pie.
</funciones>

<legal>
- México — Aviso de privacidad integral conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares vigente (publicada en el DOF el 20 de marzo de 2025): identidad y domicilio del responsable, datos que se recaban (señala si hay sensibles), finalidades primarias y secundarias con opción de negarse a las secundarias, transferencias, medios para ejercer derechos ARCO y revocar el consentimiento, uso de cookies y cómo se comunican los cambios. La autoridad ya no es el INAI: es la Secretaría Anticorrupción y Buen Gobierno (no menciones al INAI). Además, aviso simplificado (identidad, finalidades, cómo negarse y enlace al integral) junto a cada formulario, y la sección de cookies dentro del aviso.
- México — Comercio electrónico (Ley Federal de Protección al Consumidor y NMX-COE-001-SCFI-2018): identidad del proveedor y domicilio, precio total en MXN con impuestos, formas de pago, envío y entrega, devoluciones y garantía (mínimo 90 días), cancelación y medios de contacto y queja; términos aceptados antes de pagar; respeta a quien no quiera publicidad. Si hay cobros recurrentes o membresías (reforma DOF 12-dic-2025): avísalo de forma destacada con consentimiento expreso, recordatorio al menos 5 días naturales antes de cada renovación y cancelación inmediata sin penalización desde el sitio.
- Términos y condiciones de uso del sitio y de compra.
- Política de cookies con la tabla real de cookies que usa el sitio (nombre, proveedor, finalidad, duración).
- Datos del responsable: Mathfra SA de CV, domicilio Santa Clara California, correo de privacidad contacto@mathfra.com.
- Casillas de consentimiento sin marcar en formularios y fecha de última actualización en cada documento. Agrega al pie de cada documento: «Plantilla generada con IA; revísala con un abogado antes de publicar».
</legal>

<calidad_de_serie>
- SEO: metadatos por página con la Metadata API, Open Graph con imagen generada (opengraph-image), sitemap.ts, robots.ts, URLs limpias, datos estructurados JSON-LD LocalBusiness + Organization + BreadcrumbList + FAQPage donde aplique.
- Visible para las IA: /llms.txt (estándar llmstxt.org: H1 con el nombre, resumen en cita y secciones H2 con enlaces), copia en Markdown de cada página clave enlazada con rel="alternate" type="text/markdown", y robots.ts que permita a los rastreadores de IA.
- Rendimiento: Lighthouse 95+ en celular en las cuatro categorías, LCP < 2.5 s, CLS < 0.1, fuentes con next/font, imágenes AVIF/WebP con tamaños correctos.
- Accesibilidad WCAG 2.2 AA: HTML semántico, foco visible, navegación con teclado, alt en imágenes, etiquetas en campos, contraste verificado.
- Seguridad: encabezados (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy), llaves solo en variables de entorno (.env.example documentado, nunca en el repositorio), validación en servidor y límite de envíos.
- Preparada para crecer a app: rutas /api versionables, esquema de base de datos con migraciones, y separación clara entre contenido, componentes y lógica.
</calidad_de_serie>

<proceso>
1. Lee ./design-system y escribe PRODUCT.md (negocio, cliente, objetivo, tono) y CLAUDE.md (stack, comandos, reglas de diseño y «nunca hagas»). Muéstrame el plan en 10 líneas (mapa del sitio, frase principal, paleta, letras) y continúa sin esperar.
2. Construye por fases: base y sistema de diseño → páginas y secciones → funciones → legal → SEO y calidad.
3. Al terminar cada fase: npm run build y lint sin errores. Luego toma capturas en 390, 768 y 1440 px, critícalas como un director de arte exigente (¿se ve genérico o «hecho por IA»?, ¿jerarquía clara?, ¿algo roto en celular?) y corrige los 3 peores problemas; repite hasta 3 rondas. Cierra con una pasada de resta: quita lo que no ayude a entender o a convertir.
4. Pruebas con Playwright: navegación, formulario, aviso de cookies (rechazar no carga analítica) y una revisión de accesibilidad con @axe-core/playwright.
5. Publica: repositorio privado en GitHub con gh (commits claros), proyecto en Railway con railway (servicio web + Postgres si aplica), variables de entorno cargadas sin imprimirlas, y verifica que la URL de Railway responda.
6. Conecta el dominio mathfra.app en Railway y dame los registros DNS exactos que debo crear.
</proceso>

<entrega>
Haz una auditoría final con prioridades P0 (bloquea publicar) a P3 (detalle) y corrige todo P0 y P1. Termina con: la URL en producción, la lista de revisión con ✓ (legal, cookies, formularios, SEO, Lighthouse, accesibilidad, pruebas), las variables de entorno que debo llenar y la lista de todos los [COMPLETAR] pendientes.
</entrega>

<datos>
- WhatsApp: +1 2024577161
- Correo de contacto: contacto@mathfra.com
- Dominio: mathfra.app
</datos>
