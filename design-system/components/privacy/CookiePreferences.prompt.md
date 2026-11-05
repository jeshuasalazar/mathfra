Modal de preferencias: categorías con casilla (Necesarias bloqueada), «Rechazar todo» y «Guardar selección» con el mismo peso.
```jsx
<CookiePreferences open={prefs} onSave={save} onClose={() => setPrefs(false)} />
```
- En celular sube como hoja inferior; en escritorio se centra. Cierra con Esc y clic fuera; devuelve el foco a «Configurar».
