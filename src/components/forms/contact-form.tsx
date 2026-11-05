"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { lazyZodResolver } from "@/lib/lazy-resolver";
import { Icon } from "@/components/ui/icon";
import type { ContactInput } from "@/lib/validation";
import { enviarContacto, type FormState } from "@/app/actions/contacto";
import { avisoSimplificado } from "@/content/legal";
import { track } from "@/lib/analytics";
import { Field, FormAlert, SubmitButton, describedBy } from "./field";
import { Turnstile } from "./turnstile";

const opciones = [
  ["completo", "Curso completo"], ["intensivo", "Intensivo"], ["simulacros", "Simulacros"], ["diagnostico", "Diagnóstico"], ["otro", "Otra cosa"],
] as const;

/** Formulario de contacto (respaldo de WhatsApp). Valida al enviar en cliente y en servidor. */
export function ContactForm() {
  const path = usePathname();
  const [state, setState] = useState<FormState | null>(null);
  const [pending, start] = useTransition();
  const [token, setToken] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const onToken = useCallback((t: string) => setToken(t), []);
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<ContactInput>({
    resolver: lazyZodResolver<ContactInput>((m) => m.contactSchema as never),
    mode: "onSubmit",
    defaultValues: { nombre: "", email: "", telefono: "", mensaje: "", publicidad: false, website: "" },
  });

  const onSubmit = (data: ContactInput) =>
    start(async () => {
      const res = await enviarContacto({ ...data, pagina: path }, token);
      setState(res);
      if (res.ok) { reset(); track("formulario_contacto", { pagina: path || "/" }); }
      else if (res.fieldErrors) Object.entries(res.fieldErrors).forEach(([k, m]) => setError(k as keyof ContactInput, { message: m }));
      setResetKey((k) => k + 1);
    });

  const errList = Object.values(errors).map((e) => e?.message).filter(Boolean) as string[];
  const e = (k: keyof ContactInput) => errors[k]?.message;

  return (
    <form className="mf-form" noValidate onSubmit={handleSubmit(onSubmit)} aria-labelledby="t-form">
      {errList.length > 0 && !state?.ok && <FormAlert ok={false} message="Revisa estos campos:" errors={errList} />}
      {state && (state.ok || errList.length === 0) && <FormAlert ok={state.ok} message={state.message} />}
      <div className="mf-form__row">
        <Field id="nombre" label="Nombre" error={e("nombre")}>
          <input id="nombre" className="mf-input" autoComplete="name" aria-invalid={!!e("nombre")} aria-describedby={describedBy("nombre", !!e("nombre"))} {...register("nombre")} />
        </Field>
        <Field id="email" label="Correo" error={e("email")}>
          <input id="email" type="email" className="mf-input" autoComplete="email" inputMode="email" aria-invalid={!!e("email")} aria-describedby={describedBy("email", !!e("email"))} {...register("email")} />
        </Field>
      </div>
      <div className="mf-form__row">
        <Field id="telefono" label="WhatsApp o teléfono" optional error={e("telefono")}>
          <input id="telefono" type="tel" className="mf-input" autoComplete="tel" inputMode="tel" aria-invalid={!!e("telefono")} aria-describedby={describedBy("telefono", !!e("telefono"))} {...register("telefono")} />
        </Field>
        <Field id="interes" label="¿Qué te interesa?" error={e("interes")}>
          <div className="mf-select-wrap">
            <select id="interes" className="mf-select" defaultValue="" aria-invalid={!!e("interes")} aria-describedby={describedBy("interes", !!e("interes"))} {...register("interes")}>
              <option value="" disabled>Elige una opción</option>
              {opciones.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <Icon name="chevron-down" />
          </div>
        </Field>
      </div>
      <Field id="mensaje" label="Mensaje" help="Cuántas semanas te quedan y qué área te cuesta más." error={e("mensaje")}>
        <textarea id="mensaje" className="mf-input" rows={4} aria-invalid={!!e("mensaje")} aria-describedby={describedBy("mensaje", !!e("mensaje"), true)} {...register("mensaje")} />
      </Field>
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px" }}>
        <label htmlFor="website">No llenar</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>
      <p className="mf-simple-notice">
        <strong>Aviso de privacidad simplificado.</strong> {avisoSimplificado}{" "}
        <Link className="mf-link--inline" href="/aviso-de-privacidad">Consulta el aviso integral</Link>.
      </p>
      <div>
        <label className="mf-check" htmlFor="privacidad">
          <input id="privacidad" type="checkbox" aria-invalid={!!e("privacidad")} aria-describedby={describedBy("privacidad", !!e("privacidad"))} {...register("privacidad")} />
          <span className="mf-check__text">He leído el aviso de privacidad y acepto que usen mis datos para responderme.</span>
        </label>
        {e("privacidad") && <p className="mf-errmsg" id="privacidad-err"><Icon name="alert" />{e("privacidad")}</p>}
        <label className="mf-check" htmlFor="publicidad">
          <input id="publicidad" type="checkbox" {...register("publicidad")} />
          <span className="mf-check__text">Quiero recibir fechas del ECOEMS y promociones (opcional).</span>
        </label>
      </div>
      <Turnstile onToken={onToken} resetKey={resetKey} />
      <div><SubmitButton busy={pending} label="Enviar mensaje" /></div>
    </form>
  );
}
