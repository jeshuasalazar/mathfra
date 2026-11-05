export interface CardProps {
  as?: "div" | "article" | "section" | "li";
  /** Si se da, la tarjeta completa es un enlace con hover/active. */
  href?: string;
  /** Sin sombra (para tarjetas dentro de otra superficie). */
  flat?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Card(props: CardProps): JSX.Element;
