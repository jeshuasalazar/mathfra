import type { IconName } from "../actions/Icon";
export interface ServiceCardProps {
  icon?: IconName;
  eyebrow?: string;
  title: string;
  description?: string;
  points?: string[];
  children?: React.ReactNode;
}
export declare function ServiceCard(props: ServiceCardProps): JSX.Element;
