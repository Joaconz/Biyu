# Casos de prueba V3 — Deudas agrupadas por persona (US-91)

**Historia:** [#333](https://github.com/Joaconz/Biyu/issues/333) · FR-18 · C1, C11.
**Oráculo:** Deudas junta las deudas de una misma persona (sin distinguir mayúsculas, tildes ni espacios de más) en un grupo plegable con la cantidad y el neto por moneda. Una persona con una sola deuda en el filtro es una fila común. El neto cuenta solo las pendientes, por moneda y sin convertir. Los grupos respetan los filtros de la URL y se ordenan por su deuda más reciente. No cambia datos.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`); las deudas se cargan con `create_debt` (PR-04). Montos ficticios (C14).
**Automatización:** `e2e/debts-grouping.spec.ts` y `tests/domain/debts.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DEU-073 | «Juan», «juan» y «Juán» quedan en un grupo plegable; una persona con una sola deuda, en una fila | CA-1 | Particiones | Positivo | UI | Alta | Sí |
| CP-DEU-074 | El neto de un grupo con ARS y US$ muestra las dos monedas, sin convertir | CA-2 | Valores límite | Positivo | UI | Alta | Sí |
| CP-DEU-075 | Con «Saldadas» el grupo solo cuenta las saldadas; con «Pendientes» una sola ya no es grupo | CA-3 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-DEU-076 | Los totales y el estado vacío no cambian, y se salda desde un grupo | CA-4 | Casos de uso | Positivo | UI | Media | Sí |
| CP-DEU-077 | La clave de persona ignora mayúsculas, tildes y espacios; no junta personas distintas | CA-1 | Particiones | Positivo | Dominio | Alta | Sí |

## CP-DEU-073 — Un grupo por persona
**Pre-requisitos:** PR-01 con `grupo-073@biyu.test`; deudas «Me deben» de $10.000,00 a nombre de `Juan`, `juan` y `Juán`, y una de `Sofía`.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts`. | Un solo grupo de Juan (`debts-group-juan`) con «3 deudas», plegado: no se ven sus filas. Sofía, con una sola deuda, es una fila común. |
| 2 | Tocar el grupo (`debts-group-toggle`). | Se despliegan las 3 filas con sus acciones («Marcar saldada»); `aria-expanded="true"`. |
| 3 | Tocarlo de nuevo. | Se pliega. |

## CP-DEU-074 — Neto por moneda
**Pre-requisitos:** PR-01; a nombre de Juan: «Me deben» $10.000,00, «Debo» $4.000,00 y «Debo» US$20,00 (TC 1.450,00), con variantes de mayúsculas y tilde.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts` y mirar el grupo de Juan. | Dos netos: «Te debe $6.000,00» (ARS) y «Le debés US$20,00» (USD), sin convertir una moneda en la otra. |

## CP-DEU-075 — Filtros
**Pre-requisitos:** PR-01; tres deudas de `Ana`/`ana`/`Ana `, dos de ellas saldadas.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=settled`. | Grupo de Ana: «2 deudas, ninguna pendiente» y sin neto. |
| 2 | Abrir `/debts?status=pending`. | Queda una sola pendiente: es una fila común, no un grupo. |
| 3 | Abrir `/debts?status=all`. | Grupo de Ana: «3 deudas, 1 pendiente». |

## CP-DEU-076 — Totales y saldar desde un grupo
**Pre-requisitos:** PR-01; dos deudas de Juan ($10.000,00 y $5.000,00, «Me deben») y una de Marcos ($2.000,00, «Debo»).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts`. | «Te deben» $15.000,00 y «Debés» $2.000,00 (los totales de arriba no cambian por agrupar). |
| 2 | Desplegar el grupo de Juan y tocar «Marcar saldada» en la primera fila (la de $5.000,00). | «Te deben» pasa a $10.000,00. Con «Pendientes» le queda una sola deuda a Juan: ya no es un grupo. |
| 3 | Abrir `/debts?status=all`. | Grupo de Juan: «2 deudas, 1 pendiente». |

## CP-DEU-077 — Clave de persona (dominio)
| Entrada | Resultado esperado |
|---|---|
| `Juan`, ` juan `, `Juán` | La misma clave: `juan`. |
| ` Juán  Pérez` y `juan perez` | La misma clave. |
| `Sofía` con la tilde escrita como carácter aparte (NFD) y compuesta | La misma clave. |
| `Juan Pérez` y `Juan`; `Ana` y `Anna` | Claves distintas: no se juntan personas distintas. |
