"use client";
import Link from "next/link";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { lazyZodResolver } from "@/lib/lazy-resolver";
import { Icon } from "@/components/ui/icon";
import type { NewsletterInput } from "@/lib/validation";
import { suscribirBoletin } from "@/app/actions/boletin";
import type { FormState } from "@/app/actions/contacto";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { Field, FormAlert, SubmitButton, describedBy } from "./field";
import { Turnstile } from "./turnstile";

export function NewsletterForm() {
  const [state, setState] = useState<FormState | null>(null);
  const [pending, start] = useTransition();
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const onToken = useCallback((t: string) => setToken(t), []);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterInput>({
    resolver: lazyZodResolver<NewsletterInput>((m) => m.newsletterSchema as never),
    defaultValues: { email: "", website: "" },
  });
  const onSubmit = (d: NewsletterInput) =>
    start(async () => {
      const r = await suscribirBoletin(d, token);
      setState(r);
      if (r.ok) { reset(); track("boletin_suscripcion"); }
      setResetKey((k) => k + 1);
    });
  const em = errors.email?.message, ce = errors.consentimiento?.message;
  return (
    <form className="mf-form" noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Suscripción al boletín">
      {state && <FormAlert ok={state.ok} message={state.message} />}
      <Field id="nl-email" label="Tu correo" error={em}>
        <input id="nl-email" type="email" className="mf-input" autoComplete="email" inputMode="email" aria-invalid={!!em} aria-describedby={describedBy("nl-email", !!em)} {...register("email")} />
      </Field>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
        <label htmlFor="nl-website">No llenar</label><input id="nl-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <div>
        <label className="mf-check" htmlFor="nl-consent">
          <input id="nl-consent" type="checkbox" aria-invalid={!!ce} aria-describedby={describedBy("nl-consent", !!ce)} {...register("consentimiento")} />
          <span className="mf-check__text">
            Acepto recibir el boletín de {site.name}. Usaremos tu correo solo para eso; te das de baja en cada envío.{" "}
            <Link className="mf-link--inline" href="/aviso-de-privacidad">Aviso de privacidad</Link>.
          </span>
        </label>
        {ce && <p className="mf-errmsg" id="nl-consent-err"><Icon name="alert" />{ce}</p>}
      </div>
      <Turnstile onToken={onToken} resetKey={resetKey} />
      <div><SubmitButton busy={pending} label="Suscribirme" /></div>
    </form>
  );
}
