export interface TextFieldProps {
  id: string;
  label: string;
  help?: string;
  /** Mensaje de error: activa aria-invalid y borde rojo. */
  error?: string;
  optional?: boolean;
  multiline?: boolean;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  inputMode?: string;
  onChange?: (e: any) => void;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
