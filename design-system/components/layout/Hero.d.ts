/**
 * @startingPoint section="Marketing" subtitle="Portada con mapa de áreas ECOEMS marcadas" viewport="1200x720"
 */
export interface HeroProps {
  eyebrow?: string;
  title: string;
  /** Fragmento exacto de title que lleva marcatexto. */
  mark: string;
  subtitle: string;
  ctaHref?: string;
  secondaryHref?: string;
  /** Áreas resaltadas (deben coincidir con los nombres oficiales). */
  focus?: string[];
}
export declare function Hero(props: HeroProps): JSX.Element;
