/**
 * @startingPoint section="Navegación" subtitle="Barra de navegación con menú móvil y selector de modo" viewport="700x420"
 */
export interface NavLink { label: string; href: string; current?: boolean }
export interface NavbarProps {
  links: NavLink[];
  ctaHref?: string;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  defaultOpen?: boolean;
}
export declare function Navbar(props: NavbarProps): JSX.Element;
