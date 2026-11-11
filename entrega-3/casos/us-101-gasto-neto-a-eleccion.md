# Casos de prueba V3 — Qué entra en el número del Resumen, a elección (US-101)

**Historia:** [#371](https://github.com/Joaconz/Biyu/issues/371) · ADR-047, ADR-051 y ADR-053 (en vigor) · US-83, US-82, ADR-045 · C1, C2, C5, C7.
**Oráculo:** el héroe del Resumen muestra un solo número, el gasto neto: `gastos − Σ aporte de cada opción incluida`. Las cuatro opciones (ingresos, deudas sueltas, reembolsos, suscripciones por cobrar) arrancan apagadas, así que el predeterminado es «Solo gastos». Se eligen desde la pill bajo el número (hoja en el celular, popover desde `sm`) y desde Ajustes → Resumen; la elección vive en `user_preferences` y no reescribe ninguna transacción (C5). El número puede ser negativo, con el signo menos. El rótulo dice «Gastado en {mes}» sin opciones y «Gastado neto en {mes}» con alguna.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina. Todos los casos de Resumen parten de este mes con: un ingreso de $100.000,00, un gasto compartido de $120.000,00 con Sofía (que debe $60.000,00) y una deuda suelta «Me deben» de Juan por $20.000,00, todos con fecha de H. Montos ficticios (C14).
**Automatización:** `e2e/dashboard-balance-options.spec.ts` y `e2e/settings-summary.spec.ts` (CP-DAS-027 a 031 y CP-CFG-040), `tests/domain/balance.test.ts` (la cuenta) y `supabase/tests/database/user_preferences.test.sql` (CP-CFG-041).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DAS-027 | El predeterminado es «Solo gastos»: el número es lo gastado y las cuatro opciones están apagadas | CA-1 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DAS-028 | Cada opción mueve el número al instante, con su signo, y la elección queda guardada | CA-2, CA-3 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-DAS-029 | «Solo gastos» apaga todas las opciones de un toque | CA-4 | Transición de estados | Positivo | UI | Media | Sí |
| CP-DAS-030 | El desglose suma exactamente el número y «Fuera del número» muestra lo que moverían las opciones apagadas | CA-5 | Particiones | Positivo | UI | Alta | Sí |
| CP-DAS-031 | El ícono de la esquina abre la misma hoja y, en la compu, el popover nace de la pill y Escape devuelve el foco | CA-6 | Casos de uso | Positivo | UI | Media | Sí |
| CP-DAS-032 | El rótulo cambia a «Gastado neto» con una opción y el número negativo lleva el signo menos | CA-2, CA-7 | Valores límite | Positivo | UI | Media | Sí |
| CP-CFG-040 | En Ajustes cada interruptor cambia solo el número del Resumen y la elección sobrevive al recargar | CA-8 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-CFG-041 | La preferencia es de cada usuario: otro usuario no la ve ni la modifica | CA-9 | Adivinación de errores | Negativo | API | Alta | Sí |

## CP-DAS-027 — Predeterminado
**Pre-requisitos:** PR-01 con `neto-027@biyu.test`, configuración inicial salteada, y los movimientos de las convenciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard`. | El número es $120.000,00 (lo gastado) y la fórmula de la pill dice «Solo gastos». |
| 2 | Abrir `/settings`. | Los cuatro interruptores de «Resumen» están apagados. |

## CP-DAS-028 — Las opciones mueven el número
**Pre-requisitos:** PR-01 con `neto-028@biyu.test` y los movimientos de las convenciones; Resumen de H en el celular.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar la pill bajo el número. | Se abre la hoja con el número en vivo ($120.000,00), el desglose y los cuatro interruptores, cada uno con lo que mueve este mes: ingresos «-$100.000,00», deudas sueltas «+$20.000,00», reembolsos «-$60.000,00» y suscripciones por cobrar «Nada este mes». |
| 2 | Encender «Ingresos». | El número baja al instante a $20.000,00 y la fórmula dice «Gastos − ingresos»; la elección se guarda con un `POST` a `user_preferences`. |
| 3 | Encender «Reembolsos». | El número pasa a −$40.000,00. |
| 4 | Encender «Deudas sueltas». | El número pasa a −$20.000,00 y la fórmula dice «Gastos − ingresos + deudas sueltas − reembolsos». |
| 5 | Dejar solo «Ingresos», tocar «Listo» y recargar. | El héroe muestra $20.000,00 y sigue así al recargar. |

## CP-DAS-029 — «Solo gastos»
**Pre-requisitos:** PR-01 con `neto-029@biyu.test`, los movimientos de las convenciones y las cuatro opciones encendidas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la hoja, tocar «Solo gastos». | El botón queda presionado, los cuatro interruptores se apagan y el número vuelve a $120.000,00. |

## CP-DAS-030 — Desglose
**Pre-requisitos:** PR-01 con `neto-030@biyu.test` y los movimientos de las convenciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la hoja sin opciones. | «Gastado» $120.000,00 está dentro del número (`data-included="true"`). Ingresos ($100.000,00), Deudas sueltas y Reembolsos ($60.000,00) figuran «fuera del número» (`data-included="false"`). |
| 2 | Encender una opción y mirar el desglose. | La línea pasa adentro con su signo (suma o resta) y las líneas de adentro suman exactamente el número. |
| 3 | Comparar «Gastado» antes y después. | No cambia: lo gastado no depende de las opciones. |

## CP-DAS-031 — Ícono y popover
**Pre-requisitos:** PR-01 con `neto-031@biyu.test` y los movimientos de las convenciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En el celular, tocar el ícono de la esquina del héroe. | Se abre la misma hoja, con el número en $120.000,00. |
| 2 | A 1280 × 900, tocar la pill. | Un popover nace de la pill, debajo, y no tapa el héroe. |
| 3 | Encender «Deudas sueltas» y apretar Escape. | El número pasa a $140.000,00; el popover se cierra y el foco vuelve a la pill. |

## CP-DAS-032 — Rótulo y signo
**Pre-requisitos:** PR-01 con `neto-032@biyu.test` y los movimientos de las convenciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Sin opciones, leer el rótulo del héroe. | «Gastado en {mes}». |
| 2 | Encender «Ingresos» y «Reembolsos». | El rótulo pasa a «Gastado neto en {mes}» y el número es −$40.000,00, con el signo menos. |

## CP-CFG-040 — Ajustes
**Pre-requisitos:** PR-01 con `neto-040@biyu.test`, configuración inicial salteada, y los movimientos de las convenciones.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En `/settings`, encender «Ingresos» y volver al Resumen. | El número es $20.000,00. |
| 2 | Encender «Reembolsos». | El número es −$40.000,00 y la hoja del Resumen muestra «Gastado» en $120.000,00. |
| 3 | Encender y apagar «Deudas sueltas», recargar `/settings`. | «Deudas sueltas» sigue apagada; «Ingresos» y «Reembolsos» siguen encendidos. |

## CP-CFG-041 — Autorización
**Pre-requisitos:** dos usuarios A y B con PR-01 y PR-04; A con una fila en `user_preferences`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, `GET /rest/v1/user_preferences`. | Solo la fila de B (o ninguna): cero filas de A. |
| 2 | Con el token de B, `PATCH` de la fila de A. | No cambia ninguna fila. |
| 3 | Con el rol `anon`, `GET` de `user_preferences`. | 401, `42501`. |
