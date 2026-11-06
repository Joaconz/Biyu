# Casos de prueba V3 — Importar una compra en cuotas ya empezada (US-80)

**Historia:** [#268](https://github.com/Joaconz/Biyu/issues/268) · ADR-039, ADR-035 · C3, C4, C6 · I1, I1', I2, I3, I6.
**Oráculo:** la columna opcional «Cuotas pendientes» (P) guarda solo las últimas P cuotas del calendario de N, numeradas de N−P+1 a N, una por mes **desde el mes de hoy (H)**. El monto del movimiento es lo que falta pagar; en US$ el equivalente en pesos es lo que falta × TC redondeado half-up y se reparte con base truncada y resto en la última (I1'). La base revalida K = N − P (C6).
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina; «una fecha de H−4» es cualquier día de ese mes. Montos ficticios (C14). Archivos de la planilla armados con los encabezados de la plantilla. Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/create_transaction` e `import_transactions`.
**Automatización:** `e2e/import-started-purchase.spec.ts`, `supabase/tests/database/installments_paid.test.sql`, `supabase/tests/database/import_transactions.test.sql`, `tests/domain/import-rows.test.ts` y `tests/domain/import-result.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-IMP-042 | La plantilla y la hoja «Instrucciones» traen «Cuotas pendientes» | CA-1 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-043 | Una compra de 6 cuotas con 3 pendientes se imputa desde este mes y se ve en Movimientos | CA-2, CA-3, CA-13, CA-17 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-IMP-044 | Con resto, con todas pendientes y sin la columna | CA-4, CA-5, CA-6 | Valores límite | Positivo | UI | Alta | Sí |
| CP-IMP-045 | «Cuotas pendientes» solo va en una compra en cuotas y entre 1 y N | CA-7, CA-8 (F19, F20) | Particiones | Negativo | UI | Alta | Sí |
| CP-IMP-046 | Con esa fecha todavía no puede haber tantas cuotas pagadas | CA-9 (F21) | Valores límite | Negativo | UI | Alta | Sí |
| CP-IMP-047 | Un error anterior de la fila oculta los de «Cuotas pendientes» | CA-10 | Tabla de decisión | Negativo | UI | Media | Sí |
| CP-IMP-048 | En US$, con y sin resto en pesos | CA-11, CA-12 | Particiones | Positivo | UI | Alta | Sí |
| CP-IMP-049 | La cuota de este mes entra en «Cuotas de meses anteriores» del Resumen | CA-14 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-050 | El diálogo de borrado muestra las imputaciones guardadas, no un calendario recalculado | CA-15 | Casos de uso | Positivo | UI | Media | Sí |
| CP-IMP-051 | `create_transaction` rechaza cuotas pagadas inválidas | CA-16 | Valores límite | Negativo | API | Alta | Sí |
| CP-IMP-052 | `import_transactions` rechaza solo la fila inválida; `anon` no puede | CA-16 | Adivinación de errores | Negativo | API | Media | Sí |

## CP-IMP-042 — Plantilla e Instrucciones
**Pre-requisitos:** PR-01 con `imp-042@biyu.test`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/import` y tocar «Descargar plantilla». | Baja `biyu-plantilla-importacion.xlsx`. |
| 2 | Abrir la hoja 1. | La fila 1, de A a J: Fecha, Tipo, Monto, Moneda, Tipo de cambio, Categoría, Cuenta, Cuotas, Cuotas pendientes, Nota. |
| 3 | Abrir la hoja «Instrucciones». | Tiene la fila de «Cuotas pendientes»: no es obligatoria, vacía se imputa desde el mes de la fecha, y acepta entero en celda numérica o texto. |

## CP-IMP-043 — Compra empezada de 6 cuotas con 3 pendientes
**Pre-requisitos:** PR-01; archivo con una fila: fecha de H−4 · Gasto · 120000 · ARS · Otros · Tarjeta de crédito · Cuotas 6 · Cuotas pendientes 3 · «Heladera».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Elegir el archivo. | Fila «Lista» con «Faltan 3 de 6 cuotas ($60.000,00)» en `import-row-1-pending`; «Vas a importar 1 movimiento: $60.000,00 en gastos y $0,00 en ingresos (en pesos).». |
| 2 | Importar. | Paso 3: «$60.000,00 en gastos y $0,00 en ingresos (en pesos).»; «Ver en Movimientos» lleva a `?period=` de H. |
| 3 | Revisar en la base. | `amount` 60000,00, `installments_count` 6, `installments_paid` 3, `occurred_on` la de la fila, `first_period` día 1 de H; 3 imputaciones de $20.000,00, números 4, 5 y 6, en H, H+1 y H+2. |
| 4 | Recorrer Movimientos de H−4 a H+3. | «4/6» en H, «5/6» en H+1, «6/6» en H+2; nada de H−4 a H−1 ni en H+3. |

## CP-IMP-044 — Resto, todas pendientes y sin la columna
**Pre-requisitos:** PR-01; tres archivos.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Fecha de H−1 · 100000 · 3 cuotas · pendientes 2. | Cuota 2/3 de $33.333,33 en H y 3/3 de $33.333,34 en H+1; monto del movimiento $66.666,67. |
| 2 | Fecha de H−1 · 120000 · 6 cuotas · pendientes 6. | Seis cuotas de $20.000,00, de 1/6 en H a 6/6 en H+5; monto $120.000,00; `installments_paid` 0 y `first_period` H. |
| 3 | Fecha de H−1 · 240000 · 6 cuotas, con «Cuotas pendientes» vacía; repetir con un archivo sin la columna. | Se importa como en US-77: de H−1 a H+4. |

## CP-IMP-045 — F19 y F20
**Pre-requisitos:** PR-01; filas de gasto con tarjeta de crédito.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cuotas vacía con pendientes 1; Cuotas 1 con pendientes 1. | «Las cuotas pendientes solo van en una compra en cuotas». |
| 2 | Cuotas 6 con pendientes `0`, `-1`, `7`, `2,5` y `dos`. | «Las cuotas pendientes van de 1 a 6» en las cinco. |
| 3 | Cuotas 6 con pendientes `1` y `6` (fecha de H−1). | Las dos quedan «Lista». |

## CP-IMP-046 — F21, valores límite
**Pre-requisitos:** PR-01; Cuotas 6 y pendientes 3 (K = 3).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Fecha de H−3. | «Lista». |
| 2 | Fecha de H−2. | «Con esa fecha todavía no puede haber 3 cuotas pagadas». |
| 3 | Fecha de H con Cuotas 6 y pendientes 5 (K = 1). | «Con esa fecha todavía no puede haber 1 cuota pagada» (singular). |

## CP-IMP-047 — Dependencias entre errores
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cuenta «Efectivo» con Cuotas 3 y pendientes 2. | Solo «Solo los gastos con tarjeta de crédito admiten cuotas». |
| 2 | Cuotas `13` con pendientes 2. | Solo «Las cuotas van de 1 a 12». |

## CP-IMP-048 — US$ con y sin resto
**Pre-requisitos:** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Fecha de H−2 · US$300 · TC 1000 · 3 cuotas · pendientes 1. | «Falta 1 de 3 cuotas (US$100,00)»; una sola imputación, la 3/3, de US$100,00 y $100.000,00 en H; `amount` 100,00 y `amount_ars` 100000,00. |
| 2 | Fecha de H−1 · US$100 · TC 1000 · 3 cuotas · pendientes 2. | «Faltan 2 de 3 cuotas (US$66,67)»; 2/3 de US$33,33 y 3/3 de US$33,34; cada una de $33.335,00 en pesos; suman $66.670,00, igual a `amount_ars`; «Vas a importar…» suma $66.670,00. |

## CP-IMP-049 y CP-IMP-050 — Resumen y borrado
**Pre-requisitos:** PR-01; la compra de CP-IMP-043 importada.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el Resumen de H. | `dashboard-inherited-installments-amount` = $20.000,00 (su cuota de H es la 4/6). |
| 2 | En Movimientos de H, tocar la papelera de la compra. | El diálogo lista solo H con la cuota 4/6 de $20.000,00: no lista meses cerrados ni un calendario recalculado desde la fecha. |

## CP-IMP-051 y CP-IMP-052 — API
**Pre-requisitos:** PR-01 y PR-04; `create_transaction` con `p_installments_count` 6 y una cuenta de tarjeta.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | `p_installments_paid` `6` y `-1`. | HTTP 400, `23514`, «Las cuotas ya pagadas tienen que ser menos que el total de cuotas»; sin filas nuevas. |
| 2 | `p_installments_count` 1 con `p_installments_paid` 0. | `23514`, «Las cuotas ya pagadas solo van en una compra en cuotas». |
| 3 | Fecha de hoy con `p_installments_paid` 1. | `23514`, «Con esa fecha todavía no puede haber tantas cuotas pagadas». |
| 4 | `p_installments_paid` con `p_shared_persons`/`p_shared_amounts`. | `23514`, «Una compra empezada no se puede compartir». |
| 5 | `p_installments_paid` 1.5. | `22P02`. |
| 6 | `p_installments_paid` `null` o ausente. | Compra normal. |
| 7 | `import_transactions` con una fila `"installments_paid": 6` y 6 cuotas, y otra válida. | La primera vuelve `status: "rejected"`; la otra se importa. |
| 8 | Cualquiera de las anteriores con el rol `anon`. | `42501`. |
