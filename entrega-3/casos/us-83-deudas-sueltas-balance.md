# Casos de prueba V3 — Las deudas sueltas mueven el balance del mes (US-83)

> **Desactualizado por [ADR-053](../../docs/adr/053-un-solo-numero-de-gasto-neto-en-el-resumen.md):** el Resumen ya no muestra un balance sino un gasto neto (el mismo valor con el signo al revés cuando se incluyen ingresos y deudas sueltas, que además arrancan apagados) y los testids `dashboard-balance-*` pasaron a `dashboard-spent-*`. Los e2e (`e2e/dashboard-loose-debts.spec.ts`) y los tests de dominio ya están adaptados; falta reescribir estos casos.

**Historia:** [#271](https://github.com/Joaconz/Biyu/issues/271) · ADR-041 (modifica ADR-037 §6 y US-36 · CA-12) · US-29, US-33, US-36, US-39, US-40 · C1, C5, C11.
**Oráculo:** balance = ingresos − gastos + movimiento de deudas sueltas del período. Cada evento suma su `amount_ars` congelado en el período del día en que pasó (hora de Argentina): el alta en `incurred_on` («Me deben» resta, «Debo» suma) y el saldado en `settled_at` (al revés). Reabrir borra el evento «saldada». Las deudas vinculadas a un gasto no generan eventos. Gastado, Ingresos, el neto de reembolsos y los desgloses no cambian.
**Convenciones:** PR-01 crea el usuario (`docs/12-procedimientos-de-prueba.md`). H es el mes de hoy en Argentina y H−1 el anterior; saldar ocurre hoy, en H. Cada caso arranca con un usuario sin movimientos. Montos ficticios (C14).
**Automatización:** `e2e/dashboard-loose-debts.spec.ts` y `tests/domain/loose-debts-balance.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DAS-012 | «Me deben» resta del balance y muestra la línea | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-013 | «Debo» suma al balance | CA-2 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DAS-014 | Saldar la deuda del mismo mes deja el balance en ingresos − gastos y la línea en $0,00 | CA-3 | Transición de estados | Positivo | UI | Alta | Sí |
| CP-DAS-015 | Una deuda de H−1 saldada hoy mueve H−1 y H, cada uno en su mes | CA-4, CA-6 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DAS-016 | Reabrir quita el evento de H y deja H−1 igual | CA-5 | Transición de estados | Positivo | UI | Media | Sí |
| CP-DAS-017 | En US$ el evento usa el tipo de cambio congelado | CA-7 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DAS-018 | Un gasto compartido no mueve el balance y la deuda suelta no cambia Gastado ni Ingresos | CA-8, CA-10 | Particiones | Positivo | UI | Alta | Sí |
| CP-DAS-019 | Un mes con solo la deuda muestra el Resumen, no el estado vacío; la línea solo existe con eventos | CA-9, CA-14 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-DAS-020 | El mes viene de la URL; el borde de mes se calcula en hora de Argentina; si falla la lectura no hay números | CA-11, CA-12, CA-13 | Valores límite | Positivo y negativo | UI y dominio | Media | Sí |

## CP-DAS-012 a CP-DAS-014 — Alta y saldado en el mismo mes
**Pre-requisitos:** PR-01 con `das-012@biyu.test`; un ingreso de $100.000,00 con fecha de H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cargar «Me deben» a Juan por $20.000,00, fecha de H; abrir el Resumen de H. | Ingresos $100.000,00, Gastado $0,00, Balance $80.000,00 con «Superávit» e «Incluye deudas sueltas: -$20.000,00». |
| 2 | Con otro usuario, cargar «Debo» a Marta por $50.000,00, fecha de H, más el mismo ingreso. | Balance $150.000,00; «Incluye deudas sueltas: $50.000,00». |
| 3 | En el caso 1, saldar la deuda de Juan. | Balance $100.000,00; la línea queda en «Incluye deudas sueltas: $0,00». |

## CP-DAS-015 y CP-DAS-016 — Deuda de H−1 saldada hoy
**Pre-requisitos:** PR-01; deuda «Me deben» de $20.000,00 con fecha de H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Saldarla hoy; mirar el Resumen de H−1 y el de H. | H−1 resta $20.000,00; H suma $20.000,00. |
| 2 | Reabrirla (US-40). | En H desaparece la línea (sin otros eventos) y el balance vuelve a ingresos − gastos; H−1 no cambia. |
| 3 | Con una deuda «Debo» de $50.000,00 fecha H−1, saldada hoy. | Suma $50.000,00 en H−1 y resta $50.000,00 en H. |

## CP-DAS-017 — US$ congelado
**Pre-requisitos:** PR-01; deuda «Me deben» de US$40,00 a TC 1250 con fecha de H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Resumen de H−1. | Resta $50.000,00. |
| 2 | Cambiar el tipo de cambio de referencia de H a 1500 (US-20) y saldar la deuda. | En H suma $50.000,00, no $60.000,00 (C5). |

## CP-DAS-018 y CP-DAS-019 — Compartida, Gastado y mes vacío
**Pre-requisitos:** PR-01.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Gasto compartido de $120.000,00 con una deuda de $60.000,00, fecha de H. | El balance de H es ingresos − gastos; no hay línea, ni antes ni después de saldar la deuda. |
| 2 | Con cualquiera de los casos anteriores, revisar `dashboard-total-expenses`, `dashboard-total-income`, el neto de reembolsos y los desgloses por categoría y cuenta. | No cambian por la deuda suelta; los totales de Deudas siguen la regla de US-37. |
| 3 | Sin transacciones, solo una deuda «Me deben» de $20.000,00 en H. | Se ve el Resumen, no `dashboard-empty`: Gastado $0,00, Ingresos $0,00, Balance -$20.000,00 con «Déficit» y la línea. |
| 4 | Un período sin imputaciones ni eventos. | Estado vacío de US-33; `dashboard-balance-loose-debts` no está en el DOM. |

## CP-DAS-020 — URL, zona horaria y error
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/dashboard?period=<H−1>` directamente. | El balance de H−1 con sus eventos (C11). |
| 2 | Prueba de dominio con hoy = 15/11/2026: deuda saldada el 31/10/2026 a las 22:30 de Argentina (01/11/2026 01:30 UTC). | Cuenta en octubre 2026 (ADR-021). |
| 3 | Hacer fallar la lectura de las deudas. | Se ve `dashboard-error` y ningún número. |
