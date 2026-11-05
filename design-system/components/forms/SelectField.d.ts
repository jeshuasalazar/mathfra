export interface SelectFieldProps {
  id: string;
  label: string;
  options: Array<string | { value: string; label: string }>;
  placeholder?: string;
  help?: string;
  error?: string;
  disabled?: boolean;
  name?: string;
  onChange?: (e: any) => void;
}
export declare function SelectField(props: SelectFieldProps): JSX.Element;
