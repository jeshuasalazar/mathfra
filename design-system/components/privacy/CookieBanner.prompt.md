Aviso de cookies flotante abajo; «Aceptar», «Rechazar» y «Configurar» tienen exactamente el mismo peso visual.
```jsx
<CookieBanner onAccept={...} onReject={...} onConfigure={() => setPrefs(true)} />
```
- No bloquea la página. Recuerda la elección (localStorage) y se reabre desde el pie («Cookies»).
