# Casos de prueba V3 — Las deudas sueltas mueven el gasto neto del mes (US-83)

> **Reescrito el 2026-11-11 por [ADR-053](../../docs/adr/053-un-solo-numero-de-gasto-neto-en-el-resumen.md):** el Resumen ya no muestra una tarjeta de Balance sino un solo número, el gasto neto del héroe, con ingresos, deudas sueltas, reembolsos y suscripciones por cobrar como opciones que arrancan apagadas. Los pasos de abajo usan esa pantalla. Los montos son los de antes con el signo invertido: «Me deben» suma al gasto neto y «Debo» lo resta.

**Historia:** [#271](https://github.com/Joaconz/Biyu/issues/271) · ADR-041 (modifica ADR-037 §6 y US-36 · CA-12), ADR-053 · US-29, US-33, US-36, US-39, US-40, US-101 · C1, C5, C11.
**Oráculo:** gasto neto = gastos − Σ aporte de cada opción incluida. Las deudas sueltas aportan por eventos con su `amount_ars` congelado, en el período del día en que pasó cada uno (hora de Argentina): el alta en `incurred_on` («Me deben» suma, «Debo» resta) y el saldado en `settled_at` (al revés). Reabrir borra el evento «saldada». Las deudas vinculadas a un gasto no generan eventos. Gastado, Ingresos, el neto de reembolsos y los desgloses por categoría no dependen de las deudas sueltas.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina y H−1 el anterior; saldar ocurre hoy, en H. Cada caso arranca con un usuario sin movimientos y con las opciones del Resumen en su valor predeterminado (apagadas). «Incluir» una opción es tocar la pill bajo el número y encender su interruptor (`dashboard-spent-option-<opción>`). La línea de las deudas sueltas está en el desglose de esa hoja (`dashboard-spent-loose-debts`). Montos ficticios (C14).
**Automatización:** `e2e/dashboard-loose-debts.spec.ts` y `tests/domain/loose-debts-balance.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DAS-012 | «Me deben» suma al gasto neto y muestra la línea de deudas sueltas | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-013 | «Debo» resta del gasto neto | CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-014 | Saldar la deuda del mismo mes deja el número en −ingresos y la línea en $0,00 | CA-3 | Transición de estados | Positivo | UI | Alta | Sí |
| CP-DAS-015 | Una deuda de H−1 saldada hoy mueve H−1 y H, cada uno en su mes | CA-4, CA-6 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DAS-016 | Reabrir quita el evento de H y deja H−1 igual | CA-5 | Transición de estados | Positivo | UI | Media | Sí |
| CP-DAS-017 | En US$ el evento usa el tipo de cambio congelado | CA-7 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DAS-018 | Un gasto compartido no mueve las deudas sueltas y la deuda suelta no cambia Gastado ni Ingresos | CA-8, CA-10 | Particiones | Positivo | UI | Alta | Sí |
| CP-DAS-019 | Un mes con solo la deuda muestra el Resumen, no el estado vacío; la línea solo existe con eventos | CA-9, CA-14 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-DAS-020 | El mes viene de la URL; el borde de mes se calcula en hora de Argentina; si falla la lectura no hay números | CA-11, CA-12, CA-13 | Valores límite | Positivo y negativo | UI y dominio | Media | Sí |

## CP-DAS-012 a CP-DAS-014 — Alta y saldado en el mismo mes
**Pre-requisitos:** PR-01 con `das-012@biyu.test`; un ingreso de $100.000,00 con fecha de H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar «Me deben» a Juan por $20.000,00, fecha de H. En el Resumen de H, incluir «Ingresos» y «Deudas sueltas». | El número es −$80.000,00 (0 gastado − 100.000 de ingresos + 20.000 que prestó). En el desglose, «Deudas sueltas» suma $20.000,00 y «Gastado» sigue en $0,00. Ingresos sigue en $100.000,00. |
| 2 | Con otro usuario, cargar «Debo» a Marta por $50.000,00, fecha de H, más el mismo ingreso, e incluir las mismas dos opciones. | El número es −$150.000,00; «Deudas sueltas» resta $50.000,00. |
| 3 | En el caso 1, saldar la deuda de Juan y recargar. | El número es −$100.000,00; la línea «Deudas sueltas» queda en $0,00 y sigue en el desglose. |

## CP-DAS-015 y CP-DAS-016 — Deuda de H−1 saldada hoy
**Pre-requisitos:** PR-01; deuda «Me deben» de $20.000,00 con fecha de H−1; «Deudas sueltas» incluida.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Saldarla hoy; mirar el Resumen de H−1 y el de H. | H−1 suma $20.000,00 al número; H resta $20.000,00. |
| 2 | Reabrirla (US-40). | En H desaparece la línea (sin otros eventos) y el número vuelve a lo gastado; H−1 no cambia. |
| 3 | Con una deuda «Debo» de $50.000,00 fecha H−1, saldada hoy. | Resta $50.000,00 en H−1 y suma $50.000,00 en H. |

## CP-DAS-017 — US$ congelado
**Pre-requisitos:** PR-01; deuda «Me deben» de US$40,00 a TC 1250 con fecha de H−1; «Deudas sueltas» incluida.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Resumen de H−1. | La línea suma $50.000,00. |
| 2 | Cambiar el tipo de cambio de referencia de H a 1500 (US-20) y saldar la deuda. | En H la línea resta $50.000,00, no $60.000,00 (C5). |

## CP-DAS-018 y CP-DAS-019 — Compartida, Gastado y mes vacío
**Pre-requisitos:** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Gasto compartido de $120.000,00 con una deuda de $60.000,00, fecha de H; incluir «Deudas sueltas». | El número es $120.000,00 (lo gastado); en el desglose no hay línea de deudas sueltas, ni antes ni después de saldar la deuda. |
| 2 | Con cualquiera de los casos anteriores, revisar `dashboard-spent-expenses-amount`, `dashboard-total-income`, el neto de reembolsos y los desgloses por categoría y cuenta. | No cambian por la deuda suelta; los totales de Deudas siguen la regla de US-37. |
| 3 | Sin transacciones, solo una deuda «Me deben» de $20.000,00 en H. | Se ve el Resumen, no `dashboard-empty`. Sin incluirla, el número es $0,00 y «Deudas sueltas» figura «fuera del número». Al incluirla, el número es $20.000,00. No hay línea de Ingresos. |
| 4 | Un período sin imputaciones ni eventos. | Estado vacío de US-33; `dashboard-spent-loose-debts` no está en el DOM. |

## CP-DAS-020 — URL, zona horaria y error
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H−1>` directamente. | El número de H−1 con sus eventos (C11). |
| 2 | Prueba de dominio con hoy = 15/11/2026: deuda saldada el 31/10/2026 a las 22:30 de Argentina (01/11/2026 01:30 UTC). | Cuenta en octubre 2026 (ADR-021). |
| 3 | Hacer fallar la lectura de las deudas. | Se ve `dashboard-error` y ningún número. |
