import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return <p className="mf-errmsg" id={id}><Icon name="alert" />{message}</p>;
}

export function Field({ id, label, optional, help, error, children }: {
  id: string; label: string; optional?: boolean; help?: string; error?: string; children: ReactNode;
}) {
  return (
    <div className="mf-field">
      <label className="mf-label" htmlFor={id}>{label}{optional && <span className="mf-label__opt"> (opcional)</span>}</label>
      {help && <p className="mf-help" id={`${id}-help`}>{help}</p>}
      {children}
      <FieldError id={`${id}-err`} message={error} />
    </div>
  );
}

export const describedBy = (id: string, hasErr: boolean, hasHelp = false) =>
  [hasHelp && `${id}-help`, hasErr && `${id}-err`].filter(Boolean).join(" ") || undefined;

export function FormAlert({ ok, message, errors }: { ok: boolean; message: string; errors?: string[] }) {
  return ok ? (
    <div className="mf-alert mf-alert--success" role="status"><Icon name="check-circle" /><span>{message}</span></div>
  ) : (
    <div className="mf-alert mf-alert--error" role="alert" tabIndex={-1}>
      <Icon name="alert" />
      <div>{message}{errors && errors.length > 0 && <ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul>}</div>
    </div>
  );
}

export function SubmitButton({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button type="submit" className="mf-btn mf-btn--secondary" aria-busy={busy || undefined} disabled={busy}>
      {busy ? <><Icon name="loader" className="mf-spin" /><span className="mf-btn__label">Enviando…</span></> : label}
    </button>
  );
}
