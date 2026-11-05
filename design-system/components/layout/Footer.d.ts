export interface FooterLink { label: string; href: string }
export interface FooterProps {
  address?: string;
  groups?: { title: string; links: FooterLink[] }[];
  /** Aviso de privacidad, Términos, Cookies (obligatorios). */
  legal: FooterLink[];
  year?: number;
}
export declare function Footer(props: FooterProps): JSX.Element;
