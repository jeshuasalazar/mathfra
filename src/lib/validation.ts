import { z } from "zod";

/** Esquemas compartidos entre cliente (React Hook Form) y servidor (Server Actions). */
export const contactSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre.").max(80, "Máximo 80 caracteres."),
  email: z.string().trim().email("Escribe un correo válido, como nombre@correo.com."),
  telefono: z
    .string()
    .trim()
    .max(20, "Máximo 20 caracteres.")
    .regex(/^[+\d\s()-]*$/, "Usa solo números, espacios y +.")
    .optional()
    .or(z.literal("")),
  interes: z.enum(["completo", "intensivo", "simulacros", "diagnostico", "otro"], { message: "Elige una opción." }),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(1500, "Máximo 1500 caracteres."),
  privacidad: z.literal(true, { message: "Necesitamos que aceptes el aviso de privacidad para responderte." }),
  publicidad: z.boolean().optional(),
  pagina: z.string().max(200).optional(),
  website: z.string().max(0).optional(), // trampa para bots (honeypot)
});
export type ContactInput = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Escribe un correo válido, como nombre@correo.com."),
  consentimiento: z.literal(true, { message: "Marca la casilla para recibir el boletín." }),
  website: z.string().max(0).optional(),
});
export type NewsletterInput = z.infer<typeof newsletterSchema>;

export const checkoutSchema = z.object({
  plan: z.string().min(1).max(40),
  terminos: z.literal(true),
});
