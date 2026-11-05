import React, { useState } from "react";
import { TextField } from "./TextField.jsx";
import { SelectField } from "./SelectField.jsx";
import { Checkbox } from "./Checkbox.jsx";
import { Button } from "../actions/Button.jsx";
import { Icon } from "../actions/Icon.jsx";
/** Formulario corto de respaldo (para quien no quiere abrir WhatsApp). 3 campos + aviso. */
export function ContactForm({ onSubmit, initialErrors }) {
  const [errors, setErrors] = useState(initialErrors || {});
  const [state, setState] = useState("idle");
  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget), er = {};
    if (!String(f.get("nombre") || "").trim()) er.nombre = "Escribe tu nombre.";
    if (!/^\d{10}$/.test(String(f.get("tel") || "").replace(/\D/g, ""))) er.tel = "Escribe 10 dígitos, sin lada de país.";
    if (!f.get("situacion")) er.situacion = "Elige una opción.";
    if (!f.get("priv")) er.priv = "Necesitamos tu permiso para escribirte.";
    setErrors(er); if (Object.keys(er).length) return;
    setState("loading"); await (onSubmit ? onSubmit(f) : new Promise(r => setTimeout(r, 900))); setState("done");
  };
  const list = Object.values(errors);
  if (state === "done") return <div className="mf-alert mf-alert--success" role="status"><Icon name="check-circle" /><span>Listo. Te escribimos por WhatsApp hoy mismo.</span></div>;
  return <form className="mf-form" noValidate onSubmit={submit}>
    {list.length > 0 && <div className="mf-alert mf-alert--error" role="alert"><Icon name="alert" /><div>Revisa {list.length === 1 ? "1 campo" : `${list.length} campos`}:<ul>{list.map(m => <li key={m}>{m}</li>)}</ul></div></div>}
    <div className="mf-form__row">
      <TextField id="nombre" name="nombre" label="Nombre" autoComplete="given-name" error={errors.nombre} />
      <TextField id="tel" name="tel" label="Tu WhatsApp" type="tel" inputMode="tel" autoComplete="tel-national" help="10 dígitos" error={errors.tel} />
    </div>
    <SelectField id="situacion" name="situacion" label="¿En qué vas?" options={["Estoy terminando la secundaria", "Ya terminé la secundaria", "Ya hice el examen y quiero intentarlo otra vez"]} error={errors.situacion} />
    <Checkbox id="priv" name="priv" label="Acepto que me contacten por WhatsApp según el aviso de privacidad." error={!!errors.priv} />
    <Button type="submit" size="lg" loading={state === "loading"} block>Quiero que me escriban</Button>
  </form>;
}
