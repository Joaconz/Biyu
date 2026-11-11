# Casos de prueba V3 — Dona y tendencias en el Resumen (US-103)

**Historia:** [#411](https://github.com/Joaconz/Biyu/issues/411) · ADR-050, ADR-038 §5 · C1, C2, I10.
**Oráculo:** los criterios CA-1 a CA-5 de la historia. La dona muestra una porción por categoría con el total compacto en el hueco; tres tarjetas de tendencia (`dashboard-flow`, `dashboard-pace`, `dashboard-upcoming`) salen de una sola lectura de `ledger_entries` sin movimientos eliminados.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina; H−1 el anterior. Montos ficticios (C14).
**Automatización:** `e2e/ux-resumen.spec.ts` (CP-DAS-022 a 026) y `tests/domain/dashboard-trends.test.ts` (las tres series).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DAS-022 | La dona tiene una porción por categoría con monto y porcentaje y el total compacto en el hueco | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-023 | «Gastado vs ingresos» muestra 6 meses con dos columnas por mes en una sola escala | CA-2 | Particiones | Positivo | UI | Media | Sí |
| CP-DAS-024 | «Ritmo del mes» termina en el total de lo gastado y se corta en hoy | CA-3 | Valores límite | Límite | UI | Alta | Sí |
| CP-DAS-025 | «Cuotas que vienen» suma solo imputaciones de gastos no eliminados ya existentes | CA-4 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-026 | Si falla la lectura de las tendencias, el resto del Resumen sigue visible | CA-5 | Adivinación de errores | Negativo | UI | Media | Sí |

## CP-DAS-022 — Dona
**Pre-requisitos:** PR-01 con `dona-022@biyu.test`; gastos en H: $6.000,00 «Comida y supermercado», $3.000,00 «Transporte», $1.000,00 «Salud», más un ingreso de $50.000,00 y un gasto de $2.000,00 eliminado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>`. | La dona muestra tres porciones, sin ingresos ni el gasto eliminado. |
| 2 | Leer la leyenda. | Comida y supermercado 60 %, Transporte 30 %, Salud 10 %, cada una con su monto. |
| 3 | Leer el hueco. | Muestra el total en formato compacto, por ejemplo «$10 mil»; el monto exacto sigue en la tarjeta de lo gastado. |

## CP-DAS-023 — Gastado vs ingresos
**Pre-requisitos:** PR-01 con `dona-023@biyu.test`; un gasto y un ingreso en cada uno de H−2, H−1 y H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>` y mirar `dashboard-flow`. | Seis meses que terminan en H, con una columna de gastos y otra de ingresos por mes, en la misma escala. |
| 2 | Cambiar al mes anterior. | Los seis meses terminan en H−1. |

## CP-DAS-024 — Ritmo del mes
**Pre-requisitos:** PR-01 con `dona-024@biyu.test`; un gasto de $1.000,00 hace dos días y una compra en 3 cuotas de $9.000,00 iniciada el mes pasado (cuota 2 en H).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>` y mirar `dashboard-pace`. | La línea del mes en curso se corta en hoy y se compara con el mes anterior a ese mismo día. |
| 2 | Comparar el final de la línea con la tarjeta «Gastado en». | Coinciden: la cuota 2 cae el día 1 y el gasto el día que se cargó. |
| 3 | Ir al mes siguiente. | La línea del mes no se dibuja (su total es $0,00) y solo se ve la del mes anterior. |

## CP-DAS-025 — Cuotas que vienen
**Pre-requisitos:** PR-01 con `dona-025@biyu.test`; una compra de $30.000,00 en 3 cuotas con «Tarjeta de crédito» hoy, una suscripción activa de $5.000,00 y un gasto en cuotas eliminado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>` y mirar `dashboard-upcoming`. | Muestra $10.000,00 en cada uno de los dos meses siguientes. |
| 2 | Revisar si aparece la suscripción o el gasto eliminado. | No aparecen. |

## CP-DAS-026 — Falla de lectura
**Pre-requisitos:** PR-01 con `dona-026@biyu.test`; un gasto en H. DevTools → Network → bloquear las llamadas a `ledger_entries` que traen las tendencias.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H>` con el bloqueo. | Las tres tarjetas de tendencia no se dibujan. |
| 2 | Mirar el resto del Resumen. | El número principal, la dona y los últimos movimientos siguen visibles, sin mensaje de error de pantalla completa. |
