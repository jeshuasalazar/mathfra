export interface TestimonialProps {
  quote: string;
  name: string;
  /** Ej. «Generación 2026 · Quedó en su primera opción». */
  meta?: string;
  initials?: string;
  /** Muestra la insignia de ejemplo. Obligatorio mientras no haya testimonio real. */
  placeholder?: boolean;
}
export declare function Testimonial(props: TestimonialProps): JSX.Element;
