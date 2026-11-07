# Publicar: GitHub + Railway + dominio

Requisitos: `gh` y `railway` instalados y con sesión iniciada (`gh auth status`, `railway whoami`). Si falta alguno, dile a la persona el comando exacto. En Mac es `brew install gh railway`.

## 1 · Repositorio
```bash
git init && git add -A && git commit -m "Primera versión del sitio"
gh repo create <nombre-del-negocio>-web --private --source . --push
```
Antes del primer commit, revisa que `.gitignore` incluya `.env*` (salvo `.env.example`), `node_modules` y `.next`.

## 2 · Railway
```bash
railway init                 # proyecto nuevo con el nombre del negocio
railway add --database postgres   # si el sitio guarda formularios o boletín
railway up                   # primer despliegue
```
- Conecta el servicio al repositorio de GitHub desde Railway para que cada push se despliegue solo.
- Las variables se cargan con `railway variables --set "CLAVE=valor"`. **Nunca imprimas los valores.** Pídele a la persona que las pegue ella si son suyas (Resend, Turnstile, Stripe).
- Genera la URL pública con `railway domain` y verifica que responda con 200.

## 3 · Dominio
1. Si aún no tiene dominio, mándala a Herramientas › Dominios de aiLearning (plataforma.ailearning.mx/#/alumno/dominios) para comprarlo al mejor precio.
2. `railway domain <tudominio.mx>`: Railway devuelve el registro (CNAME o A) y un TXT de verificación.
3. Dale a la persona los **registros DNS exactos** (tipo, nombre y valor) para su registrador. Si usa Cloudflare, el proxy debe estar en modo Full.
4. Si hay correo con Resend, agrega también los registros SPF, DKIM y DMARC que Resend indique.
5. Cuando el dominio responda, actualiza `NEXT_PUBLIC_SITE_URL` y vuelve a generar el sitemap.

## 4 · Variables típicas (`.env.example`)
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP=
DATABASE_URL=
RESEND_API_KEY=
CORREO_AVISOS=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
AGENTE_WEBHOOK_URL=
AGENTE_WEBHOOK_SECRETO=
```
