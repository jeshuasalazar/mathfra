/**
 * Estructura del ECOEMS según la guía oficial de la Comipems: 128 reactivos en 10 áreas.
 * Verifica contra la convocatoria vigente antes de cada generación.
 */
export type Area = {
  slug: string;
  name: string;
  reactivos: number;
  focus: boolean; // área difícil: la trabajamos primero
  temas: string[];
};

export const areas: Area[] = [
  { slug: "habilidad-verbal", name: "Habilidad verbal", reactivos: 16, focus: false, temas: ["Comprensión de lectura", "Sinónimos y antónimos", "Analogías"] },
  { slug: "habilidad-matematica", name: "Habilidad matemática", reactivos: 16, focus: true, temas: ["Sucesiones numéricas y alfanuméricas", "Series espaciales", "Imaginación espacial", "Problemas de razonamiento"] },
  { slug: "espanol", name: "Español", reactivos: 12, focus: false, temas: ["Gramática y ortografía", "Tipos de texto", "Literatura"] },
  { slug: "historia", name: "Historia", reactivos: 12, focus: false, temas: ["Historia universal", "Historia de México"] },
  { slug: "geografia", name: "Geografía", reactivos: 12, focus: false, temas: ["Geografía física", "Población y economía", "Cartografía"] },
  { slug: "formacion-civica", name: "Formación cívica y ética", reactivos: 12, focus: false, temas: ["Derechos humanos", "Democracia y participación", "Identidad y convivencia"] },
  { slug: "matematicas", name: "Matemáticas", reactivos: 12, focus: true, temas: ["Aritmética y fracciones", "Álgebra y ecuaciones", "Geometría y trigonometría", "Probabilidad y estadística"] },
  { slug: "fisica", name: "Física", reactivos: 12, focus: true, temas: ["Movimiento y fuerzas (leyes de Newton)", "Energía y trabajo", "Electricidad y magnetismo", "Ondas y calor"] },
  { slug: "quimica", name: "Química", reactivos: 12, focus: true, temas: ["Materia y sus propiedades", "Tabla periódica y enlaces", "Reacciones y balanceo", "Ácidos, bases y pH"] },
  { slug: "biologia", name: "Biología", reactivos: 12, focus: false, temas: ["Célula y seres vivos", "Genética y evolución", "Cuerpo humano y salud", "Ecología"] },
];

export const totalReactivos = areas.reduce((n, a) => n + a.reactivos, 0);
export const reactivosFoco = areas.filter((a) => a.focus).reduce((n, a) => n + a.reactivos, 0);
export const fuenteExamen = "Guía oficial del concurso de asignación Comipems. Verifica la convocatoria vigente.";
