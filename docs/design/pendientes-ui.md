# Pendientes de UI (para el final del rediseño)

Notas del rediseño de V1 (ADR-023) que quedaron para la última etapa. Al retomarlas, trabajarlas
con las skills `emil-design-eng` y `apple-design`.

## 1. Tipografía — hecho

Se pasó a la fuente del sistema con Inter de respaldo y se sacó Playfair (ADR-023). Problema original:

La tipografía todavía no convence. Revisar la elección de fuentes (Inter + Playfair), la escala
(`text-display` … `text-tab` en `src/index.css`), los pesos y la jerarquía en todas las pantallas.
Evaluar la fuente del sistema (`system-ui`, SF Pro en iOS), que `apple-design` §15 recomienda como
punto de partida.

## 2. Login y registro de cuenta, demasiado vacíos — hecho

Panel verde con la marca y tres líneas sobre qué hace la app; el formulario sube como hoja desde abajo. Problema original:

`/login` y `/signup` (`AuthForm.tsx`, `AuthLayout.tsx`) tienen mucho espacio muerto: wordmark,
lema y un formulario suelto. Falta presencia de marca o una composición que llene la pantalla sin
agregar ruido.

## 3. Registrar un gasto paso a paso — hecho

Monto → categoría (avanza sola) → detalles, sobre un único borrador (ADR-024). Problema original:

Hoy todos los campos están en una sola pantalla. La idea: que el registro arranque desde un botón
y se complete pantalla por pantalla (monto → categoría → …).

Restricciones que el diseño tiene que respetar:

- **NFR-07:** como máximo 4 pasos y menos de 10 segundos para quien ya conoce la app. Un paso
  por campo (monto, moneda, categoría, cuenta, fecha, nota) da 6 y no cumple.
- **US-01:** el registro es la pantalla de inicio. Si pasa a abrirse desde un botón, hay que
  decidir qué es la pantalla de inicio y revisar US-01 y CP-REG-001.
- Los `data-testid` del formulario (`transaction-form-*`) y los casos CP-REG-* dependen de la
  estructura actual.

Propuesta inicial para discutir: monto (con moneda) → categoría, que avanza sola al tocarla →
confirmación con cuenta, fecha y nota ya precargadas y editables → Guardar. Son 3 pasos con los
valores por defecto (última cuenta usada, hoy). Probablemente necesite un ADR y ajustar US-01.

## 4. Login y registro de cuenta en tablet

Entre el celular y el desktop (probado a ~730 px de ancho), `/login` y `/signup` usan la composición
de celular: el panel verde de `AuthLayout.tsx` se estira a casi toda la pantalla, con la marca arriba,
las tres líneas abajo y un vacío grande en el medio; el formulario queda como una hoja angosta al pie.
Definir el corte: pasar antes a las dos columnas de desktop, o limitar el alto del panel y centrar el
contenido en tablet.

## 5. Página para rutas que no existen

Una URL desconocida (p. ej. `/no-existe`) muestra la pantalla de error por defecto de React Router
("Unexpected Application Error! 404 Not Found"), en inglés y sin estilo. No expone datos: las rutas
privadas ya redirigen a `/login` sin sesión. Falta una ruta `*` en `src/router.tsx` (y un
`errorElement` para errores de render) con una pantalla en castellano, con el sistema de diseño y un
acceso a Registrar (o a Entrar si no hay sesión).
