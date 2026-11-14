# Casos de prueba V3 — Mismos textos y controles en Suscripciones (US-95)

**Historia:** [#356](https://github.com/Joaconz/Biyu/issues/356) · hallazgo 6 de la auditoría [#352](https://github.com/Joaconz/Biyu/issues/352) · US-52, US-59.
**Oráculo:** la historia: la moneda se muestra como «US$», «Medio de pago» pasa a «Cuenta», categoría y cuenta se eligen con chips como en Registrar (no con selects) y la acción de alta tiene el mismo estilo que en Deudas.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14).
**Automatización:** `e2e/ux-suscripciones.spec.ts` (CP-SUS-160 a 162); los textos de dominio, en `tests/domain/subscriptions.test.ts`, `tests/domain/subscriptionEdit.test.ts` y `tests/domain/committed-total.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-SUS-160 | El alta muestra «US$», «Cuenta» y chips en lugar de selects | Moneda, cuenta y chips | Casos de uso | Positivo | UI | Media | Sí |
| CP-SUS-161 | La edición muestra «US$» y los chips con lo elegido | Moneda y chips en edición | Casos de uso | Positivo | UI | Media | Sí |
| CP-SUS-162 | La lista ofrece «Nueva suscripción» y el detalle dice «Cuenta» | Mismo texto de alta y de cuenta | Casos de uso | Positivo | UI | Baja | Sí |

## CP-SUS-160 — Alta con los controles de Registrar
**Pre-requisitos:** PR-01 con `cp-sus-160@biyu.test`, configuración inicial salteada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions/new` y mirar el selector de moneda. | Las opciones son «ARS» y «US$». |
| 2 | Mirar los controles de categoría y cuenta. | La cuenta se rotula «Cuenta» (no «Medio de pago»); categoría y cuenta son chips, no hay ningún `select`. |
| 3 | Tocar «Guardar suscripción» sin elegir nada. | Debajo de «Cuenta» se lee «Elegí una cuenta». |
| 4 | Tocar el chip «Entretenimiento» y el chip «Efectivo». | Ambos quedan marcados y el error de cuenta desaparece. |

## CP-SUS-161 — Edición con los controles de Registrar
**Pre-requisitos:** PR-01 con `cp-sus-161@biyu.test`; suscripción «Figma» en dólares (US$15,00, «Entretenimiento», «Efectivo») creada por la API.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions/{id}/edit`. | La moneda, solo lectura, dice «US$». |
| 2 | Mirar categoría y cuenta. | Son chips; «Entretenimiento» y «Efectivo» están marcados; no hay `select`. |

## CP-SUS-162 — Alta y detalle con los mismos textos
**Pre-requisitos:** PR-01 con `cp-sus-162@biyu.test`; suscripción «Netflix» en pesos creada por la API.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/subscriptions`. | El botón de alta dice «Nueva suscripción», como «Nueva deuda» en Deudas. |
| 2 | Abrir el detalle de «Netflix». | Entre los datos figura «Cuenta» y no «Medio de pago». |
