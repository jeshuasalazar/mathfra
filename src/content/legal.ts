/**
 * Documentos legales. Plantilla generada con IA: revísala con un abogado antes de publicar.
 * Bloques: string = párrafo · { list } = lista · { table } = tabla.
 */
import { site } from "./site";

export type Block = string | { list: string[] } | { table: { head: string[]; rows: string[][] } };
export type LegalDoc = { updatedAt: string; intro: string; sections: { title: string; blocks: Block[] }[] };

const domicilio = `${site.address.street}, ${site.address.neighborhood}, ${site.address.city}, ${site.address.region}, CP ${site.address.postalCode}`;
export const legalDisclaimer = "Plantilla generada con IA; revísala con un abogado antes de publicar.";

export const avisoSimplificado =
  `${site.legalName} usa tus datos para responder tu solicitud (finalidad primaria) y, si lo aceptas, para enviarte información del curso y del ECOEMS (finalidad secundaria). Puedes negarte a la secundaria escribiendo a ${site.privacyEmail}.`;

export const avisoPrivacidad: LegalDoc = {
  updatedAt: site.updatedAt,
  intro:
    `Este aviso se emite conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares publicada en el Diario Oficial de la Federación el 20 de marzo de 2025 (la «Ley») y su normativa aplicable.`,
  sections: [
    {
      title: "1. Identidad y domicilio del responsable",
      blocks: [
        `${site.legalName} («Mathfra»), con domicilio en ${domicilio}, es responsable del tratamiento de tus datos personales. Contacto de privacidad: ${site.privacyEmail}.`,
        "[COMPLETAR: RFC y domicilio fiscal completo del responsable]",
      ],
    },
    {
      title: "2. Datos personales que recabamos",
      blocks: [
        "Recabamos los datos que tú nos das en el formulario de contacto, el boletín, WhatsApp, el pago o al crear una cuenta:",
        {
          list: [
            "Identificación y contacto: nombre, correo electrónico, número de teléfono o WhatsApp.",
            "Académicos: grado escolar, escuela de procedencia y escuelas de interés (si nos los compartes).",
            "Pago: nombre del titular, monto y estado del pago. Los datos de la tarjeta los recibe y procesa directamente Stripe; Mathfra no los ve ni los guarda.",
            "Técnicos: dirección IP (para limitar envíos y prevenir abuso), y datos de navegación anónimos solo si aceptas la medición.",
          ],
        },
        "No recabamos datos personales sensibles. Si eres menor de edad, necesitamos el consentimiento de tu madre, padre o tutor; te lo pediremos antes de inscribirte.",
      ],
    },
    {
      title: "3. Finalidades del tratamiento",
      blocks: [
        "Finalidades primarias (necesarias para el servicio que pides):",
        {
          list: [
            "Responder tus mensajes y solicitudes de información.",
            "Inscribirte, darte acceso a clases, materiales y simulacros.",
            "Procesar pagos, emitir comprobantes y atender aclaraciones, cancelaciones y garantías.",
            "Confirmar tu suscripción al boletín cuando la pides.",
            "Cumplir obligaciones legales y fiscales.",
          ],
        },
        "Finalidades secundarias (no son necesarias; puedes negarte):",
        {
          list: [
            "Enviarte el boletín, avisos de fechas del ECOEMS y promociones.",
            "Medir de forma agregada el uso del sitio para mejorarlo.",
            "Pedirte opinión sobre el curso.",
          ],
        },
        `Si no quieres que usemos tus datos para las finalidades secundarias, escribe a ${site.privacyEmail} con el asunto «Negativa a finalidades secundarias», o desmarca la casilla correspondiente en el formulario. Negarte no afecta el servicio que contrataste.`,
      ],
    },
    {
      title: "4. Transferencias y encargados",
      blocks: [
        "No vendemos ni cedemos tus datos. Para operar el sitio usamos proveedores que tratan datos por cuenta nuestra (encargados), con obligaciones de confidencialidad:",
        {
          list: [
            "Supabase (base de datos y cuentas de usuario).",
            "Resend (envío de correos).",
            "Stripe (procesamiento de pagos con tarjeta y OXXO).",
            "Cloudflare Turnstile (protección contra bots en formularios).",
            "Railway (alojamiento del sitio).",
            "Umami (medición anónima, solo con tu consentimiento).",
          ],
        },
        "Algunos de estos proveedores están fuera de México. Solo haremos transferencias que requieran tu consentimiento si nos lo das, salvo las excepciones que prevé la Ley (por ejemplo, requerimientos de autoridad competente).",
      ],
    },
    {
      title: "5. Derechos ARCO y revocación del consentimiento",
      blocks: [
        "Tienes derecho a Acceder a tus datos, Rectificarlos, Cancelarlos y Oponerte a su tratamiento (derechos ARCO), así como a revocar tu consentimiento.",
        `Para ejercerlos, envía un correo a ${site.privacyEmail} con: tu nombre, un medio para responderte, copia de una identificación (o la de tu representante y el documento que lo acredite), la descripción clara del derecho que quieres ejercer y cualquier dato que nos ayude a ubicar tu información.`,
        "Te responderemos en un plazo máximo de 20 días hábiles y, si procede, haremos efectiva tu solicitud dentro de los 15 días hábiles siguientes. Si no estás de acuerdo con la respuesta, puedes acudir a la Secretaría Anticorrupción y Buen Gobierno, autoridad garante en materia de protección de datos personales.",
        "Para limitar el uso de tus datos con fines publicitarios también puedes inscribirte en el Registro Público para Evitar Publicidad (REPEP) de la Profeco.",
      ],
    },
    {
      title: "6. Uso de cookies y tecnologías similares",
      blocks: [
        "Usamos almacenamiento local necesario para recordar tu decisión sobre cookies y el modo claro u oscuro. Solo si lo aceptas cargamos la medición anónima (Umami, sin cookies). No usamos cookies de publicidad.",
        "Puedes cambiar tu decisión en cualquier momento con el enlace «Preferencias de cookies» al pie de cada página. El detalle está en la Política de cookies.",
      ],
    },
    {
      title: "7. Conservación y seguridad",
      blocks: [
        "Conservamos tus datos solo el tiempo necesario para las finalidades descritas y los plazos legales (por ejemplo, fiscales). Los mensajes de contacto sin inscripción se eliminan a los 12 meses. Aplicamos medidas administrativas, técnicas y físicas para protegerlos.",
      ],
    },
    {
      title: "8. Cambios a este aviso",
      blocks: [
        "Cualquier cambio se publicará en esta página con su nueva fecha de actualización y, si es relevante, te lo avisaremos por correo.",
      ],
    },
  ],
};

export const terminos: LegalDoc = {
  updatedAt: site.updatedAt,
  intro:
    "Al usar mathfra.app o comprar un curso aceptas estos términos. Se rigen por la Ley Federal de Protección al Consumidor (LFPC) y la NMX-COE-001-SCFI-2018 sobre comercio electrónico.",
  sections: [
    {
      title: "1. Proveedor",
      blocks: [
        `${site.legalName}, domicilio: ${domicilio}. Correo: ${site.email}. WhatsApp: ${site.whatsappDisplay}.`,
        "[COMPLETAR: RFC]",
      ],
    },
    {
      title: "2. Uso del sitio",
      blocks: [
        "El contenido del sitio es informativo y propiedad de Mathfra. No puedes copiarlo con fines comerciales sin permiso. No debes usar los formularios para enviar spam o contenido ilícito.",
      ],
    },
    {
      title: "3. Servicios y precios",
      blocks: [
        "Ofrecemos cursos de preparación para el examen ECOEMS. Las características, duración y horarios de cada curso se describen en las páginas de Servicios, Precios y Clases y horarios.",
        "Todos los precios están en pesos mexicanos (MXN) e incluyen el IVA. El precio que ves antes de pagar es el total; no hay cargos ocultos.",
        "No hay cobros recurrentes ni membresías. Si en el futuro ofrecemos alguno, lo informaremos de forma destacada y pediremos tu consentimiento expreso, con recordatorio al menos 5 días naturales antes de cada renovación y cancelación inmediata desde el sitio.",
      ],
    },
    {
      title: "4. Formas de pago",
      blocks: [
        {
          list: [
            "Tarjeta de crédito o débito y efectivo en OXXO, mediante Stripe Checkout.",
            "Transferencia bancaria, solicitándola por WhatsApp.",
            "[COMPLETAR: meses sin intereses, si se ofrecen]",
          ],
        },
        "Antes de pagar debes aceptar estos términos. Recibirás un recibo por correo al confirmarse el pago. El pago en OXXO se confirma cuando Stripe nos lo notifica (hasta 3 días después de generar la ficha).",
      ],
    },
    {
      title: "5. Entrega del servicio",
      blocks: [
        "Los cursos son presenciales; no hay envío de productos físicos. Al confirmarse tu pago te enviamos el grupo, la fecha de inicio y la dirección por correo y WhatsApp.",
      ],
    },
    {
      title: "6. Cancelación y devoluciones",
      blocks: [
        "Tienes 5 días hábiles contados desde la confirmación del pago para revocar tu compra sin costo ni explicación (art. 56 LFPC). Te devolvemos el total por el mismo medio de pago en un máximo de 10 días hábiles.",
        "Después de ese plazo y antes de que empiece el curso: [COMPLETAR: política de reembolso parcial]. Una vez iniciado el curso: [COMPLETAR: política].",
        `Para cancelar, escribe a ${site.email} o por WhatsApp con tu nombre y el correo con el que pagaste.`,
      ],
    },
    {
      title: "7. Garantía",
      blocks: [
        "Si el curso no se presta como se ofreció (por ejemplo, se cancelan clases sin reponerlas), tienes 90 días naturales desde que lo detectes para reclamar la garantía: te reponemos las sesiones o te reembolsamos la parte proporcional.",
        "No garantizamos un puntaje ni la asignación a una escuela: depende de tu desempeño y de la demanda de cada opción.",
      ],
    },
    {
      title: "8. Quejas y aclaraciones",
      blocks: [
        `Escríbenos a ${site.email}. Respondemos en un máximo de 5 días hábiles. También puedes acudir a la Procuraduría Federal del Consumidor (Profeco): Teléfono del Consumidor 55 5568 8722 / 800 468 8722, o en profeco.gob.mx.`,
      ],
    },
    {
      title: "9. Publicidad",
      blocks: [
        "Solo te enviamos publicidad si lo aceptaste. Puedes darte de baja con el enlace de cada correo, escribiéndonos, o inscribiéndote en el REPEP de Profeco.",
      ],
    },
    {
      title: "10. Cuentas de usuario",
      blocks: [
        "Si creas una cuenta, eres responsable de mantener el acceso a tu correo. Podemos suspender cuentas usadas para abuso.",
      ],
    },
    {
      title: "11. Legislación y jurisdicción",
      blocks: [
        "Estos términos se rigen por las leyes federales de los Estados Unidos Mexicanos. [COMPLETAR: tribunales competentes según el domicilio del proveedor]",
      ],
    },
  ],
};

export const politicaCookies: LegalDoc = {
  updatedAt: site.updatedAt,
  intro:
    "Las cookies y el almacenamiento local son pequeños datos que el sitio guarda en tu navegador. Aquí está la lista real de lo que usa mathfra.app.",
  sections: [
    {
      title: "1. Qué usamos",
      blocks: [
        {
          table: {
            head: ["Nombre", "Proveedor", "Categoría", "Finalidad", "Duración"],
            rows: [
              ["mathfra-cookies (almacenamiento local)", "mathfra.app", "Necesaria", "Recordar tu decisión sobre cookies", "12 meses"],
              ["mathfra-theme (almacenamiento local)", "mathfra.app", "Necesaria", "Recordar el modo claro u oscuro", "Hasta que lo borres"],
              ["sb-*-auth-token", "mathfra.app (Supabase)", "Necesaria", "Mantener tu sesión si entras a tu cuenta", "Sesión; se renueva hasta 7 días"],
              ["Turnstile (sin cookie en mathfra.app)", "Cloudflare", "Necesaria", "Comprobar que el formulario lo envía una persona", "Durante el envío"],
              ["Umami (sin cookies)", "Umami", "Medición", "Contar visitas de forma anónima. Solo se carga si aceptas", "No guarda nada en tu navegador"],
            ],
          },
        },
        "No usamos cookies de publicidad. La categoría «Publicidad» queda desactivada hasta que la necesitemos; si la activamos, actualizaremos esta tabla y te pediremos permiso otra vez.",
        "Al pagar, Stripe abre su propia página (checkout.stripe.com), que usa sus cookies bajo su política de privacidad.",
      ],
    },
    {
      title: "2. Cómo decides",
      blocks: [
        "La primera vez que entras te mostramos un aviso con tres botones del mismo tamaño: «Aceptar», «Rechazar» y «Configurar». Hasta que eliges, no cargamos nada que no sea necesario.",
        "Puedes cambiar tu decisión cuando quieras desde «Preferencias de cookies» al pie de cada página, o borrando los datos del sitio en tu navegador.",
      ],
    },
  ],
};
