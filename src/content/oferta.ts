/** Servicios, planes, horarios, equipo y testimonios. */
export type IconName =
  | "target" | "calculator" | "flask" | "atom" | "clipboard-check" | "timer" | "map-pin" | "calendar"
  | "list-checks" | "mail" | "check" | "arrow-right" | "arrow-down" | "quote" | "info" | "alert";

export const servicios: {
  slug: string; icon: IconName; label: string; title: string; text: string; bullets: string[];
}[] = [
  {
    slug: "curso-completo",
    icon: "target",
    label: "Curso completo",
    title: "Las 10 áreas, empezando por las difíciles",
    text: "Para quien tiene tiempo antes del examen y quiere llegar con todo repasado.",
    bullets: ["Diagnóstico y plan semanal", "Las 10 áreas del ECOEMS", "Simulacros con revisión"],
  },
  {
    slug: "intensivo",
    icon: "timer",
    label: "Intensivo",
    title: "Solo lo que más aciertos te da",
    text: "Para quien tiene pocas semanas. Nos quedamos en las 4 áreas que más pesan.",
    bullets: ["Habilidad matemática, matemáticas, física y química", "Tareas cortas diarias", "Simulacros con revisión"],
  },
  {
    slug: "simulacros",
    icon: "clipboard-check",
    label: "Simulacros",
    title: "Practica como el día del examen",
    text: "128 reactivos con tiempo real y revisión de cada error.",
    bullets: ["Reactivos tipo ECOEMS", "Resultado por área", "Revisión de errores contigo"],
  },
  {
    slug: "diagnostico",
    icon: "list-checks",
    label: "Diagnóstico",
    title: "Sabe dónde estás antes de pagar",
    text: "Un examen corto que te dice qué áreas te quitan más aciertos.",
    bullets: ["Resultado por área", "Plan sugerido", "[COMPLETAR: ¿es gratis o tiene costo?]"],
  },
];

export type Plan = {
  slug: string;
  name: string;
  featured: boolean;
  /** Precio total en MXN con IVA incluido. null = [COMPLETAR]. */
  priceMXN: number | null;
  priceNote: string;
  summary: string;
  bullets: string[];
  waLabel: string;
};

export const IVA = 0.16;

export const planes: Plan[] = [
  {
    slug: "intensivo",
    name: "Intensivo",
    featured: false,
    priceMXN: null,
    priceNote: "pago único",
    summary: "Para quien tiene pocas semanas antes del examen.",
    bullets: ["Solo las 4 áreas difíciles", "Tareas cortas diarias", "Simulacros con revisión", "[COMPLETAR: duración en semanas y horas por semana]"],
    waLabel: "Preguntar por el intensivo",
  },
  {
    slug: "completo",
    name: "Completo",
    featured: true,
    priceMXN: null,
    priceNote: "pago único",
    summary: "Las 10 áreas del examen, empezando por las difíciles.",
    bullets: ["Diagnóstico y plan semanal", "Las 10 áreas, difíciles primero", "Simulacros con revisión", "[COMPLETAR: duración en semanas y horas por semana]"],
    waLabel: "Preguntar por el completo",
  },
];

export const pagosInfo = {
  formas: "Tarjeta de crédito o débito y efectivo en OXXO (vía Stripe). Transferencia: pídela por WhatsApp.",
  meses: "[COMPLETAR: ¿ofreces meses sin intereses? Stripe lo permite con tarjetas de crédito mexicanas participantes]",
  iva: "Todos los precios están en pesos mexicanos (MXN) e incluyen IVA del 16 %.",
  recurrente: "No hay cobros recurrentes ni membresías: pagas una sola vez por curso.",
  entrega:
    "El curso es un servicio presencial; no hay envío. Al confirmarse tu pago te enviamos por correo y WhatsApp el grupo, la fecha de inicio y la dirección.",
};

export const horarios: { group: string; days: string; time: string; modality: string; start: string }[] = [
  { group: "Matutino", days: "[COMPLETAR: días]", time: "[COMPLETAR: horario]", modality: "Presencial", start: "[COMPLETAR: fecha de inicio]" },
  { group: "Vespertino", days: "[COMPLETAR: días]", time: "[COMPLETAR: horario]", modality: "Presencial", start: "[COMPLETAR: fecha de inicio]" },
  { group: "Sabatino", days: "Sábado", time: "[COMPLETAR: horario]", modality: "Presencial", start: "[COMPLETAR: fecha de inicio]" },
];

export const equipo: { name: string; role: string; bio: string; initials: string }[] = [];

export const testimonios: { quote: string; name: string; meta: string; initials: string }[] = [];

export const certificaciones: { name: string; detail: string }[] = [];

export const casos: { title: string; text: string }[] = [];
