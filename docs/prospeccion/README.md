# Prospección automática — cómo operarla

Código: `src/lib/prospeccion/` (una función por paso) · worker: `scripts/prospeccion.ts` · cola: `/panel/prospeccion` · pruebas: `npm run test:unit`.

## Poner en marcha (una sola vez)
1. **Base:** aplica `supabase/migrations/20261106000000_prospeccion.sql` (`supabase db push` o pégala en el SQL Editor).
2. **Railway → New Service** desde este mismo repositorio. En *Settings → Config-as-code* usa `railway.prospeccion.json`. Corre cada hora (`0 * * * *`): los lunes a las 14:00 UTC (8:00 en CDMX) hace la corrida semanal y, cada hora, procesa respuestas, bajas y seguimientos.
3. **Variables** (solo en Railway; lista completa en `.env.example`): `EXA_API_KEY`, `DENUE_TOKEN`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `PROSPECCION_FROM`, `PROSPECCION_DOMICILIO`, `PROSPECCION_SECRET`, `PROSPECCION_ADMINS`, `IMAP_*`, las de Supabase, y en el servicio web también `PROSPECCION_SECRET`, `PROSPECCION_DOMICILIO` y `PROSPECCION_ADMINS`.
4. **Prueba sin enviar:** `npm run prospeccion -- prueba` (busca, limpia y califica; no guarda nada).
5. **Tu CSV de aiLearning:** `npm run prospeccion -- importar ~/Downloads/prospectos-2026-11-06.csv` (vista previa) y luego con `--guardar` para dejarlos en la cola.

## Día a día
- **Ver y aprobar la cola:** entra a `https://mathfra.app/panel/prospeccion` con un correo de `PROSPECCION_ADMINS`. «Aprobar y enviar» lo manda en ese momento (lunes a viernes de 8:00 a 19:00 CDMX; fuera de ese horario lo manda el worker después).
- **Pausar:** botón «Pausar prospección» en el panel, o `PROSPECCION_PAUSADO=1` en Railway. Las bajas se siguen aplicando aunque esté en pausa.
- **Modo revisión:** los primeros 14 días desde la primera corrida todo pasa por la cola. Después los correos salen solos; para volver a revisarlos, cambia `revision_hasta` en `prospeccion_ajustes`.
- **Baja manual:** formulario al final del panel. La lista de bajas nunca se borra.
- **Resumen:** cada lunes, después de enviar, te llega un correo a `EMAIL_TO_BUSINESS` con nuevos, enviados, respuestas, interesados, bajas y costo.

## Reglas que el código hace cumplir
- Solo correos genéricos (contacto@, ventas@, hola@…) del mismo dominio que la página del negocio y con registro MX. Nunca Gmail, Hotmail ni correos con nombre de persona.
- Cada dato guarda su fuente (URL y fecha). Se borra a los 12 meses sin respuesta.
- Ningún correo sale sin el pie legal completo (quién soy, domicilio, contacto, de dónde salió el dato, aviso de privacidad y baja en un clic). Si falta el domicilio o el remitente, el envío se bloquea y el panel te avisa.
- WhatsApp nunca en frío: solo un enlace wa.me para que ellos te escriban. Llamadas: solo tú, después de revisar el REPEP (https://repep.profeco.gob.mx).
- Máximo 3 toques (día 0, 3 y 10). Cualquier respuesta detiene la secuencia.

## Costo mensual estimado
Exa: unas 13 búsquedas y hasta 200 lecturas de página, entre US$0.50 y US$1.50 (dentro de los US$10 gratis). DENUE: gratis. Claude Haiku: menos de US$0.05. Resend: gratis hasta 3,000 correos. Railway: unas 3 horas de cómputo dentro de tu plan. **Total: menos de US$2 al mes en APIs.**
