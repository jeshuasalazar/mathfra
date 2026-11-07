# Imanes para atraer PERSONAS (sin contacto en frío)

Regla común: **ellos escriben, el agente 24/7 contesta.** Cada enlace abre tu WhatsApp con un mensaje prellenado que dice de dónde vienen, para que el agente (y tú) sepan la fuente. Número: +1 202 457 7161 (`NEXT_PUBLIC_WHATSAPP`).

> El agente 24/7 está conectado cuando `AGENTE_WEBHOOK_URL` y `NEXT_PUBLIC_CHAT_WIDGET_SRC` tienen valor en Railway. Hoy están vacíos: hasta conectarlo, los mensajes llegan a tu WhatsApp normal.

Ningún texto trae cifras, testimonios ni promesas de calificación. Donde falta un dato tuyo dice `[COMPLETAR: …]`.

---

## 1. Anuncio que abre tu WhatsApp (Meta Ads · desde $100 MXN al día)

**Objetivo de campaña:** Interacción → Mensajes → WhatsApp. La conversación que abre el anuncio no cuesta.

**Público sugerido:** Ciudad de México y área metropolitana, radio alrededor de tu sede. Mamás, papás y tutores de 30 a 55 años, más jóvenes de 15 a 24 años. Sin segmentar por datos sensibles.

**Mensaje prellenado** (en «Plantilla de mensaje»): `Hola, vengo del anuncio y quiero información del curso ECOEMS.`

**Texto principal — versión A (para mamás y papás)**
> El ECOEMS se gana en las áreas difíciles. En Mathfra empezamos por habilidad matemática, matemáticas, física y química, y cada semana te decimos qué estudiar. Escríbenos y te mandamos fechas, horarios y precio.

**Versión B (para quien presenta)**
> ¿Presentas el ECOEMS y no sabes por dónde empezar? Te decimos qué estudiar cada semana, empezando por lo más difícil. Escríbenos por WhatsApp.

**Versión C (tiempo)**
> Poco tiempo para estudiar para el ECOEMS: empieza por las áreas que más cuestan. Pregúntanos por los grupos matutino, vespertino y sabatino.

**Titular:** `Curso de ingreso ECOEMS` · **Botón:** `Enviar mensaje`

**Respuesta de bienvenida del agente** (la primera que manda):
> ¡Hola! Soy el asistente de Mathfra. Te paso fechas, horarios y precio del curso ECOEMS. ¿El curso es para ti o para tu hijo o hija?

---

## 2. Tu Perfil de Empresa en Google (gratis)

**Nombre:** Mathfra · **Categoría principal:** Centro de preparación para exámenes · **Secundarias:** Academia, Servicio de tutoría
**Sitio web:** https://mathfra.app/?utm_source=google&utm_medium=perfil
**Botón «Chat» o enlace de WhatsApp:** https://wa.me/12024577161?text=Hola%2C%20te%20encontr%C3%A9%20en%20Google%20y%20quiero%20informaci%C3%B3n%20del%20curso%20ECOEMS.
**Domicilio y horario:** [COMPLETAR: domicilio exacto y horario; deben coincidir con el aviso de privacidad y con `PROSPECCION_DOMICILIO`]

**Descripción (menos de 750 caracteres)**
> Mathfra da cursos de ingreso al bachillerato con el examen ECOEMS (Comipems). Nuestro método no reparte el tiempo parejo: primero hacemos un diagnóstico y atacamos las áreas más difíciles del examen —habilidad matemática, matemáticas, física y química— y cada semana te decimos qué estudiar. Hay grupos matutino, vespertino y sabatino. Escríbenos por WhatsApp para recibir fechas, horarios y precio.

**Fotos:** salón, pizarrón, material y fachada. Solo fotos reales tuyas: nada de bancos de imágenes ni personas generadas por IA.

**Mensaje para pedir reseñas** (mándalo a alumnos que terminaron el curso):
> Hola, [nombre]. Gracias por estudiar con Mathfra. Si te sirvió el curso, ¿nos dejas una reseña en Google? Nos ayuda a que otras familias nos encuentren: [COMPLETAR: enlace de reseñas de tu perfil, y guárdalo también en `site.googleReviewsUrl`]

---

## 3. Tus clientes te recomiendan

**Mensaje para quien ya te compró** (por WhatsApp, a tus propios alumnos; ellos ya te escribieron antes):
> Hola, [nombre]. ¿Conoces a alguien que vaya a presentar el ECOEMS? Si se inscribe con tu recomendación, a los dos les damos [COMPLETAR: beneficio para ambos, p. ej. una sesión extra de repaso]. Solo pásale este enlace: https://wa.me/12024577161?text=Hola%2C%20me%20recomend%C3%B3%20[nombre]%20y%20quiero%20informaci%C3%B3n%20del%20curso%20ECOEMS.

El agente lee «me recomendó [nombre]» y lo registra como fuente para dar el beneficio.

---

## 4. Un regalo en tu página

Página lista: **https://mathfra.app/guia-ecoems**. Usa el formulario del boletín: casilla de permiso **sin marcar**, doble confirmación por correo y baja en un clic.

Pendiente: [COMPLETAR: sube la guía PDF a `public/guia-ecoems.pdf` y su enlace al correo de bienvenida del boletín]. Comparte la página en tu perfil de Google, en tu anuncio y en tus estados de WhatsApp.

---

## 5. Aliados (lo que hace el worker)

El worker escribe **un correo 1 a 1** a negocios de Benito Juárez (cafés, oficinas y tiendas) para proponerles que recomienden el curso. Si quieres ofrecerles algo, define `PROSPECCION_BENEFICIO_ALIADO` en Railway; sin cifras ni promesas, por ejemplo: «A cambio, sus clientes reciben una clase muestra sin costo.» Los correos incluyen un enlace wa.me para que **ellos** te escriban.
