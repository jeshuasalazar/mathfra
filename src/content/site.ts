/**
 * Datos del negocio. Edita aquí; los componentes leen de este archivo.
 * Todo lo que diga [COMPLETAR: …] se muestra resaltado en el sitio hasta que lo reemplaces.
 */
export const site = {
  name: "Mathfra",
  legalName: "Mathfra SA de CV",
  tagline: "Cursos de ingreso ECOEMS en Santa Clara",
  description:
    "Curso de ingreso al bachillerato (ECOEMS) en Santa Clara. Empezamos por habilidad matemática, matemáticas, física y química, y cada semana te decimos qué estudiar.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://mathfra.app").replace(/\/$/, ""),
  locale: "es_MX",
  email: "contacto@mathfra.com",
  privacyEmail: "contacto@mathfra.com",
  whatsappDisplay: "+1 202 457 7161",
  whatsappMessage: "Hola, quiero información del curso de ingreso ECOEMS.",
  address: {
    street: "[COMPLETAR: calle y número]",
    neighborhood: "[COMPLETAR: colonia]",
    city: "Santa Clara",
    region: "California",
    postalCode: "[COMPLETAR: código postal]",
    country: "[COMPLETAR: país de la sede (MX o US)]",
    mapsUrl: "",
    note: "[COMPLETAR: confirma la sede. El brief dice «Santa Clara, California», pero el ECOEMS se presenta en el Valle de México]",
  },
  hours: "[COMPLETAR: días y horario de atención]",
  responseNote: "Te contestamos el mismo día con fechas y precios.",
  googleReviewsUrl: "",
  socials: [] as { label: string; href: string }[],
  updatedAt: "2026-11-04",
} as const;

export type NavItem = { href: string; label: string };

/** Barra: 3 enlaces (DESIGN.md §6). El resto vive en el pie. */
export const mainNav: NavItem[] = [
  { href: "/servicios", label: "Cursos" },
  { href: "/precios", label: "Precios" },
  { href: "/clases-y-horarios", label: "Horarios" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Cursos",
    items: [
      { href: "/servicios", label: "Servicios" },
      { href: "/precios", label: "Precios y paquetes" },
      { href: "/clases-y-horarios", label: "Clases y horarios" },
      { href: "/casos-de-exito", label: "Casos de éxito" },
    ],
  },
  {
    title: "Mathfra",
    items: [
      { href: "/nosotros", label: "Nosotros" },
      { href: "/nuestra-causa", label: "Nuestra causa" },
      { href: "/ubicacion", label: "Ubicación" },
      { href: "/contacto", label: "Contacto" },
    ],
  },
];

export const legalNav: NavItem[] = [
  { href: "/aviso-de-privacidad", label: "Aviso de privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/politica-de-cookies", label: "Política de cookies" },
];

export const cta = {
  label: "Escríbenos por WhatsApp",
  secondaryHow: "Ver cómo funciona",
};
