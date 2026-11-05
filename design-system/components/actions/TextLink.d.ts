export interface TextLinkProps {
  href?: string;
  /** Dentro de texto corrido (sin altura mínima de 44 px). */
  inline?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}
export declare function TextLink(props: TextLinkProps): JSX.Element;
