import type { IconName } from "./Icon";
/**
 * @startingPoint section="Acciones" subtitle="Botón principal y secundario con todos sus estados" viewport="700x360"
 */
export interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  /** Si se da, se renderiza como <a>. */
  href?: string;
  icon?: IconName;
  iconEnd?: IconName;
  /** Muestra spinner + «Enviando…» y aria-busy. */
  loading?: boolean;
  disabled?: boolean;
  block?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
