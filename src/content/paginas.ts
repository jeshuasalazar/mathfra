/** Encabezados y metadatos de cada página interior. */
export type PageKey =
  | "inicio" | "servicios" | "precios" | "clases-y-horarios" | "casos-de-exito" | "nosotros"
  | "nuestra-causa" | "ubicacion" | "contacto" | "aviso-de-privacidad" | "terminos-y-condiciones" | "politica-de-cookies";

export type PageInfo = {
  path: string;
  name: string; // para migas y menú
  title: string; // <title>
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
};

export const paginas: Record<PageKey, PageInfo> = {
  inicio: {
    path: "/",
    name: "Inicio",
    title: "Curso de ingreso ECOEMS en Santa Clara",
    description:
      "Curso de ingreso ECOEMS en Santa Clara. Empezamos por habilidad matemática, matemáticas, física y química, y cada semana te decimos qué estudiar.",
    eyebrow: "",
    h1: "Tu primera opción se gana en las áreas difíciles.",
    lead: "",
  },
  servicios: {
    path: "/servicios",
    name: "Servicios",
    title: "Cursos y servicios para el ECOEMS",
    description: "Curso completo, intensivo, simulacros y diagnóstico para el ECOEMS. Empezamos por las áreas que más aciertos quitan.",
    eyebrow: "Servicios",
    h1: "Un curso para cada tiempo que te queda.",
    lead: "Todos empiezan igual: un diagnóstico y lo difícil primero. Cambia cuánto cubrimos según las semanas que tienes.",
  },
  precios: {
    path: "/precios",
    name: "Precios",
    title: "Precios y paquetes del curso ECOEMS",
    description: "Precios del curso de ingreso ECOEMS en pesos con IVA incluido. Paga con tarjeta u OXXO, o pregunta por WhatsApp.",
    eyebrow: "Precios y paquetes",
    h1: "Elige según el tiempo que te queda.",
    lead: "Precios en pesos mexicanos con IVA incluido. Un solo pago, sin membresías ni cobros recurrentes.",
  },
  "clases-y-horarios": {
    path: "/clases-y-horarios",
    name: "Clases y horarios",
    title: "Clases y horarios del curso ECOEMS",
    description: "Grupos matutino, vespertino y sabatino del curso ECOEMS en Santa Clara. Aparta tu lugar por WhatsApp.",
    eyebrow: "Clases y horarios",
    h1: "Horario fijo. Sabes cuánto te toca desde el primer día.",
    lead: "Grupos pequeños con un plan por semana. Elige el que te quede y pregunta por lugares.",
  },
  "casos-de-exito": {
    path: "/casos-de-exito",
    name: "Casos de éxito",
    title: "Casos de éxito",
    description: "Historias reales de alumnos de Mathfra que presentaron el ECOEMS.",
    eyebrow: "Casos de éxito",
    h1: "Quiénes ya lo hicieron y cómo.",
    lead: "Aquí solo van historias reales, con nombre y permiso de cada alumno.",
  },
  nosotros: {
    path: "/nosotros",
    name: "Nosotros",
    title: "Nosotros",
    description: "Quiénes somos en Mathfra y por qué empezamos por las áreas difíciles del ECOEMS.",
    eyebrow: "Nosotros",
    h1: "Enseñamos primero lo que más cuesta.",
    lead: "Mathfra nació para que nadie pierda su primera opción por dejar matemáticas, física y química al final.",
  },
  "nuestra-causa": {
    path: "/nuestra-causa",
    name: "Nuestra causa",
    title: "Nuestra causa",
    description: "Por qué creemos que quedarte en tu primera opción no debería depender de cuánto tiempo tienes para buscar.",
    eyebrow: "Nuestra causa",
    h1: "Que tu primera opción no dependa del tiempo que te sobra.",
    lead: "Quien tiene menos tiempo es quien más necesita saber qué estudiar.",
  },
  ubicacion: {
    path: "/ubicacion",
    name: "Ubicación",
    title: "Ubicación",
    description: "Dónde están las clases de Mathfra en Santa Clara y cómo llegar.",
    eyebrow: "Ubicación",
    h1: "Clases en Santa Clara.",
    lead: "Te mandamos la ubicación exacta por WhatsApp cuando apartas tu lugar.",
  },
  contacto: {
    path: "/contacto",
    name: "Contacto",
    title: "Contacto",
    description: "Escríbenos por WhatsApp o deja tus datos y te contactamos con fechas, precio y horarios del curso ECOEMS.",
    eyebrow: "Contacto",
    h1: "Pregunta lo que necesites. Te contestamos hoy.",
    lead: "Lo más rápido es WhatsApp. Si prefieres, deja tus datos y te escribimos.",
  },
  "aviso-de-privacidad": {
    path: "/aviso-de-privacidad",
    name: "Aviso de privacidad",
    title: "Aviso de privacidad integral",
    description: "Aviso de privacidad integral de Mathfra SA de CV conforme a la LFPDPPP.",
    eyebrow: "Legal",
    h1: "Aviso de privacidad integral",
    lead: "Cómo tratamos tus datos personales y cómo ejercer tus derechos.",
  },
  "terminos-y-condiciones": {
    path: "/terminos-y-condiciones",
    name: "Términos y condiciones",
    title: "Términos y condiciones",
    description: "Términos y condiciones de uso del sitio y de compra de cursos de Mathfra.",
    eyebrow: "Legal",
    h1: "Términos y condiciones",
    lead: "Las reglas de uso del sitio y de compra de los cursos.",
  },
  "politica-de-cookies": {
    path: "/politica-de-cookies",
    name: "Política de cookies",
    title: "Política de cookies",
    description: "Qué cookies y almacenamiento usa mathfra.app, para qué y por cuánto tiempo.",
    eyebrow: "Legal",
    h1: "Política de cookies",
    lead: "Qué guardamos en tu navegador y cómo cambiar tu decisión.",
  },
};

export const nosotrosTexto = {
  historia: "[COMPLETAR: cómo y cuándo empezó Mathfra, quién la fundó y por qué]",
  principios: [
    { title: "Lo difícil, primero", text: "Si un área te quita más aciertos, le damos más horas y la ponemos al inicio." },
    { title: "Plan por semana", text: "Siempre sabes qué toca. No pierdes tiempo decidiendo qué estudiar." },
    { title: "Sin promesas vacías", text: "No prometemos calificaciones. Te decimos con datos en qué vas y qué falta." },
  ],
};

export const causaTexto = {
  parrafos: [
    "Cada año, miles de estudiantes presentan el ECOEMS para entrar al bachillerato. Muchos no se quedan en su primera opción por los mismos temas: habilidad matemática, matemáticas, física y química.",
    "Casi nunca es falta de capacidad. Es falta de tiempo y de saber por dónde empezar. Quien trabaja, ayuda en casa o vuelve a estudiar después de un tiempo pierde horas buscando qué estudiar.",
    "Por eso hacemos el trabajo de ordenar: un diagnóstico, un plan por semana y las áreas difíciles al inicio.",
  ],
  compromiso: "[COMPLETAR: compromiso social concreto, p. ej. becas o lugares con descuento por grupo, si existe]",
};
