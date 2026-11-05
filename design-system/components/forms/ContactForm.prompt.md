Formulario completo de respaldo: nombre, WhatsApp, situación y permiso; resumen de errores arriba, error por campo, estado de envío y confirmación.
```jsx
<ContactForm onSubmit={async (data) => fetch("/api/lead", { method: "POST", body: data })} />
```
- Valida al enviar (no mientras escribe). El resumen usa role="alert".
- Es secundario: la acción principal de la página sigue siendo WhatsApp.
