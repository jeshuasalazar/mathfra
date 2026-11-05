export interface CookieChoice { analitica: boolean; marketing: boolean }
export interface CookiePreferencesProps {
  open?: boolean;
  initial?: Partial<CookieChoice>;
  onSave?: (v: CookieChoice) => void;
  onClose?: () => void;
  isStatic?: boolean;
}
export declare function CookiePreferences(props: CookiePreferencesProps): JSX.Element;
