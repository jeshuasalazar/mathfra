export interface FaqItem { q: string; a: string; open?: boolean }
export interface FaqAccordionProps {
  items: FaqItem[];
  /** Mismo name = solo uno abierto a la vez. */
  name?: string;
}
export declare function FaqAccordion(props: FaqAccordionProps): JSX.Element;
