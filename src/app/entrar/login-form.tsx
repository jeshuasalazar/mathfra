"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Field, FormAlert, SubmitButton } from "@/components/forms/field";

export function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [err, setErr] = useState<string>();
  const supabase = supabaseBrowser();
  if (!supabase) return <FormAlert ok={false} message="Las cuentas aún no están activas. Escríbenos por WhatsApp." />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("Escribe un correo válido, como nombre@correo.com."); return; }
    setErr(undefined); setBusy(true);
    const { error } = await supabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: `${location.origin}/auth/callback` } });
    setBusy(false);
    setMsg(error ? { ok: false, text: "No pudimos enviar el enlace. Intenta en unos minutos." } : { ok: true, text: "Revisa tu correo y abre el enlace para entrar." });
  }
  return (
    <form className="mf-form" noValidate onSubmit={onSubmit}>
      {msg && <FormAlert ok={msg.ok} message={msg.text} />}
      <Field id="login-email" label="Correo" error={err}>
        <input id="login-email" name="email" type="email" className="mf-input" autoComplete="email" aria-invalid={!!err} aria-describedby={err ? "login-email-err" : undefined} />
      </Field>
      <div><SubmitButton busy={busy} label="Mandarme el enlace" /></div>
    </form>
  );
}
