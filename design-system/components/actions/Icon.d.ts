export type IconName = "whatsapp"|"arrow-right"|"arrow-up-right"|"arrow-down"|"check"|"x"|"plus"|"minus"|"chevron-down"|"menu"|"sun"|"moon"|"alert"|"check-circle"|"info"|"target"|"calculator"|"flask"|"atom"|"clipboard-check"|"timer"|"map-pin"|"calendar"|"list-checks"|"settings"|"loader"|"mail"|"quote";
export interface IconProps {
  name: IconName;
  /** sm 16 · md 20 · lg 24 · xl 32 */
  size?: "sm" | "md" | "lg" | "xl";
  /** Solo si el ícono transmite significado sin texto al lado. */
  label?: string;
  className?: string;
}
export declare function Icon(props: IconProps): JSX.Element;
