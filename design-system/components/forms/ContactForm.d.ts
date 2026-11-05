/**
 * @startingPoint section="Formularios" subtitle="Formulario de contacto con validación y mensajes de error" viewport="700x620"
 */
export interface ContactFormProps {
  /** Recibe FormData; debe devolver una promesa. */
  onSubmit?: (data: FormData) => Promise<void>;
  /** Para documentación: muestra errores de inicio. */
  initialErrors?: Partial<Record<"nombre" | "tel" | "situacion" | "priv", string>>;
}
export declare function ContactForm(props: ContactFormProps): JSX.Element;
