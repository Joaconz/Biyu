# Casos de prueba V3 — Esqueletos de carga y transiciones entre pantallas (US-97)

**Historia:** [#358](https://github.com/Joaconz/Biyu/issues/358) · ADR-049 · NFR-06.
**Oráculo:** los criterios CA-1 a CA-4 de la historia adaptada. Las cuatro pantallas con listado muestran esqueletos con la forma del contenido; las navegaciones se animan con View Transitions según su clase (`none`, `tab`, `forward`, `back`) y el movimiento reducido deja solo el fundido.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Para ver el esqueleto, en DevTools → Network elegir «Slow 4G» o demorar las llamadas a `/rest/v1/`. Para ver las transiciones, Chrome (View Transitions). Montos ficticios (C14).
**Automatización:** `e2e/ux-navegacion.spec.ts` (CP-NAV-033 a 036) y `tests/lib/viewTransitions.test.ts` (clasificación). CP-NAV-037 es de inspección manual.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-NAV-033 | El Resumen, Movimientos, Deudas y Suscripciones muestran un esqueleto y después el contenido | CA-1 | Casos de uso | Positivo | UI | Media | Sí |
| CP-NAV-034 | Cambiar de mes o de filtro no dispara transición | CA-2 | Particiones | Negativo | UI | Media | Sí |
| CP-NAV-035 | Cambiar de pestaña funde y entrar a un detalle o volver desplaza y funde | CA-1 | Transición de estados | Positivo | UI | Media | Sí |
| CP-NAV-036 | Con movimiento reducido no hay desplazamiento ni pulso, solo fundido | CA-3 | Valores límite | Límite | UI | Media | Sí |
| CP-NAV-037 | El «atrás» del navegador no usa la dirección de la navegación anterior | CA-4 | Adivinación de errores | Negativo | UI | Baja | No |

## CP-NAV-033 — Esqueleto y contenido
**Pre-requisitos:** PR-01 con `esqueleto-033@biyu.test`; un gasto, una deuda y una suscripción; red en «Slow 4G».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard`. | Primero se ve el esqueleto (`dashboard-loading`) con la forma de las tarjetas, no el texto «Cargando…». Después aparece el contenido sin que la pantalla salte. |
| 2 | Repetir con `/transactions`, `/debts` y `/subscriptions`. | Cada una muestra su esqueleto (`transactions-loading`, `debts-loading`, `subscriptions-loading`) y después el contenido. |
| 3 | Con un lector de pantalla (o leyendo el DOM) revisar el esqueleto. | Tiene un texto solo para lectores de pantalla. |

## CP-NAV-034 — Misma ruta, sin transición
**Pre-requisitos:** PR-01 con `esqueleto-034@biyu.test`; un gasto en H−1 y otro en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/dashboard` tocar la flecha del mes anterior. | El período cambia en la URL y el contenido se actualiza sin desplazamiento ni fundido de la pantalla. |
| 2 | En `/transactions` cambiar entre «Activos» y «Eliminados». | Sin transición de pantalla. |

## CP-NAV-035 — Pestaña, detalle y volver
**Pre-requisitos:** PR-01 con `esqueleto-035@biyu.test`; una suscripción activa.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Desde `/dashboard` tocar «Deudas» en la barra. | La pantalla funde (unos 180 ms), sin desplazarse. La barra y el encabezado no parpadean. |
| 2 | Desde `/subscriptions` abrir el detalle de la suscripción. | El contenido se desplaza hacia adelante unos 28 px y funde (unos 260 ms). |
| 3 | Volver con el botón atrás de la pantalla. | El contenido se desplaza en sentido contrario y funde. |

## CP-NAV-036 — Movimiento reducido
**Pre-requisitos:** PR-01 con `esqueleto-036@biyu.test`; DevTools → Rendering → «Emulate CSS prefers-reduced-motion: reduce».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Navegar entre pestañas y entrar y salir de un detalle. | Solo hay fundido: ningún desplazamiento. |
| 2 | Abrir una pantalla con la red lenta. | El esqueleto no pulsa. |

## CP-NAV-037 — Atrás del navegador
**Pre-requisitos:** PR-01 con `esqueleto-037@biyu.test`; una suscripción activa.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Entrar al detalle de la suscripción y después a Deudas con la barra. | Cada navegación usa su transición. |
| 2 | Tocar atrás en el navegador. | Se usa el fundido de base: no repite el desplazamiento de la navegación anterior (`data-nav` en `<html>` se borra a los 600 ms). |
