/**
 * @startingPoint section="Contenido" subtitle="Tabla de precios con plan recomendado" viewport="700x560"
 */
export interface Plan {
  name: string;
  price: string;
  period?: string;
  summary?: string;
  features: string[];
  featured?: boolean;
  cta?: string;
  href?: string;
}
export interface PricingTableProps {
  plans: Plan[];
  ctaHref?: string;
}
export declare function PricingTable(props: PricingTableProps): JSX.Element;
