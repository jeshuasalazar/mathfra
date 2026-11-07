import type { Tamano } from "./config.ts";

export type Fuente = { campo: string; url: string; fecha: string; proveedor: "exa" | "denue" | "places" | "csv" };

/** Lo que sale de «encontrar»: datos crudos, tal como los publica el negocio. */
export type Candidato = {
  nombre: string;
  giroId: string;
  web?: string;
  correos: string[];
  telefonos: string[];
  clee?: string;
  tamano?: Tamano;
  colonia?: string;
  direccion?: string;
  lat?: number;
  lon?: number;
  textoPagina?: string;
  fuentes: Fuente[];
};

export type Nivel = "caliente" | "tibio" | "frio";

/** Registro limpio y calificado, listo para guardar en «prospectos». */
export type Prospecto = {
  id?: string;
  clee?: string;
  nombre: string;
  giroId: string;
  giro: string;
  tamano?: Tamano;
  colonia?: string;
  direccion?: string;
  lat?: number;
  lon?: number;
  km?: number;
  telefono?: string;
  correo?: string;
  correoVerificado?: "mx" | "millionverifier" | "sin_verificar";
  web?: string;
  dominio?: string;
  puntos: number;
  nivel: Nivel;
  motivos: string[];
  fuentes: Fuente[];
};

export type Correo = { asunto: string; texto: string; generadoPor: "ia" | "plantilla"; costoUsd: number };

export type Clasificacion = "interesado" | "no_ahora" | "baja" | "otro";
