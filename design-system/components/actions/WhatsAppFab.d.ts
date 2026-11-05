export interface WhatsAppFabProps {
  /** Número con lada país, sin + ni espacios. */
  phone?: string;
  message?: string;
  compact?: boolean;
  label?: string;
  /** Solo para documentación: desactiva position:fixed. */
  isStatic?: boolean;
}
export declare function WhatsAppFab(props: WhatsAppFabProps): JSX.Element;
