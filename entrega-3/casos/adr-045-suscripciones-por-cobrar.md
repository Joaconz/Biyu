# Casos de prueba V3 — Suscripciones por cobrar en el Resumen (ADR-045)

**Historia:** sin historia propia: nació de un pedido de producto y se decidió en [ADR-045](../../docs/adr/045-suscripciones-por-cobrar-en-el-resumen.md) (implementada en el PR [#370](https://github.com/Joaconz/Biyu/pull/370)). Su lugar en pantalla lo cambian ADR-051 y [ADR-053](../../docs/adr/053-un-solo-numero-de-gasto-neto-en-el-resumen.md); es una de las cuatro opciones de US-101 ([#371](https://github.com/Joaconz/Biyu/issues/371)) · R2, R5, US-55, US-59, ADR-031 · C1, C2.
**Oráculo:** el Resumen muestra aparte lo que las suscripciones activas todavía van a cobrar en el mes: el total en pesos y cuántos cobros faltan. Una suscripción genera su transacción recién el día de cobro (R5), así que hasta entonces no cambia lo gastado: lo pendiente se proyecta sin crear ningún movimiento. En un mes sin movimientos es la tarjeta `dashboard-pending-subscriptions`; en un mes con movimientos es una línea de la hoja del héroe (opción «Suscripciones por cobrar», apagada por defecto). Un mes pasado no tiene nada pendiente; en un mes futuro cuentan todas las activas que ya empezaron, cualquiera sea su día de cobro.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina y H+1 el siguiente. Para que el resultado no dependa del día en que se corre, los casos de UI miran el Resumen de H+1, que no tiene movimientos. Las suscripciones se crean por API con `create_subscription` (categoría «Servicios» o «Entretenimiento», cuenta «Efectivo», `p_start_period` = H). Montos ficticios (C14).
**Automatización:** `e2e/pending-subscriptions.spec.ts` (CP-SUS-062 a 065) y `tests/domain/pending-subscription-charges.test.ts` (CP-SUS-066).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-SUS-062 | Una suscripción activa que todavía no cobró aparece como por cobrar con su total y su cuenta de cobros | ADR-045 §1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-SUS-063 | Las pausadas y las canceladas no cuentan como por cobrar | ADR-045 §2 | Tabla de decisión | Negativo | UI | Alta | Sí |
| CP-SUS-064 | Una suscripción en US$ sin tipo de cambio del mes se informa aparte y no entra al total | ADR-045 §3 | Particiones | Límite | UI | Media | Sí |
| CP-SUS-065 | Si no se pueden leer las suscripciones, el Resumen se ve igual y sin la tarjeta | ADR-031 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-SUS-066 | En el mes en curso solo cuenta lo que su día de cobro todavía no llegó, y un mes pasado no tiene nada | ADR-045 §1, R5 | Valores límite | Límite | Dominio | Alta | Sí |

## CP-SUS-062 — Por cobrar
**Pre-requisitos:** PR-01 con `cobrar-062@biyu.test`, configuración inicial salteada; una suscripción «Netflix» activa de $5.000,00, cobro el día 1, desde H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H+1>`. | Tarjeta «Suscripciones por cobrar en {mes de H+1}» con $5.000,00 y «1 cobro que todavía no se cargó». |
| 2 | Tocar «Ver suscripciones». | Va a `/subscriptions`. |
| 3 | Revisar Movimientos de H+1. | Sin movimientos: lo por cobrar no generó ninguna transacción. |

## CP-SUS-063 — Pausadas y canceladas
**Pre-requisitos:** PR-01 con `cobrar-063@biyu.test`; tres suscripciones activas desde H: «Netflix» $1.000,00, «Spotify» $2.000,00 y «Gimnasio» $4.000,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Pausar «Netflix» y cancelar «Spotify». | Quedan «Gimnasio» activa y las otras dos fuera. |
| 2 | Abrir `/dashboard?period=<H+1>`. | La tarjeta muestra $4.000,00 y «1 cobro que todavía no se cargó». |
| 3 | Pausar también «Gimnasio» y recargar. | No hay tarjeta de suscripciones por cobrar. |

## CP-SUS-064 — US$ sin tipo de cambio
**Pre-requisitos:** PR-01 con `cobrar-064@biyu.test`; una suscripción en US$ de $10,00 y otra en pesos de $3.000,00, activas desde H; sin tipo de cambio cargado para H+1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H+1>`. | El total en pesos es $3.000,00 (solo la de pesos). |
| 2 | Leer el aviso de la tarjeta. | Dice «+ USD 10,00 sin tipo de cambio de {mes de H+1}»: la de dólares se informa aparte y no suma al total. |

## CP-SUS-065 — Falla de lectura
**Pre-requisitos:** PR-01 con `cobrar-065@biyu.test`; un gasto en H y una suscripción activa. DevTools → Network → bloquear las lecturas de `/rest/v1/subscriptions`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard` con el bloqueo. | El número del héroe y el resto del Resumen se ven; no hay pantalla de error ni tarjeta de suscripciones por cobrar. |

## CP-SUS-066 — Límite del día de cobro
**Pre-requisitos:** prueba de dominio con una suscripción de cobro el día 15 (`pendingSubscriptionCharges`, `today` como parámetro, C1).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | `today` = día 15 del mes. | No hay cobro pendiente: el día de cobro ya llegó (R5). |
| 2 | `today` = día 14. | Hay 1 cobro pendiente. |
| 3 | El mes ya tiene su transacción, aunque esté eliminada. | No cuenta (R2). |
| 4 | Un mes pasado; un mes futuro. | Pasado: nada. Futuro: todas las activas que ya empezaron, cualquiera sea el día. |
| 5 | Pausadas, canceladas, las que empiezan después y las que terminaron antes. | No cuentan. |
