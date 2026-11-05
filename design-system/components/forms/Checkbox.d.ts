export interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  description?: string;
  error?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: (e: any) => void;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
