Botón del sistema: `primary` (azul, la única acción principal; máx. uno por sección) y `secondary` (blanco con borde).
```jsx
<Button href="https://wa.me/52XXXXXXXXXX" icon="whatsapp" size="lg">Escríbenos por WhatsApp</Button>
<Button variant="secondary" iconEnd="arrow-down" href="#metodo">Ver cómo funciona</Button>
<Button type="submit" loading>Enviar</Button>
```
- Estados: hover sube 2 px y la sombra crece; active se hunde; foco con contorno 3 px; disabled sin sombra; loading con spinner.
- Altura mínima 48 px (sm 44 px).
