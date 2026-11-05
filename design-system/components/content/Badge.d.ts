import type { IconName } from "../actions/Icon";
export interface BadgeProps {
  /** accent = «área difícil / foco». primary = solo para «Recomendado». */
  tone?: "neutral" | "accent" | "primary" | "success" | "warning" | "error";
  icon?: IconName;
  children?: React.ReactNode;
}
export declare function Badge(props: BadgeProps): JSX.Element;
