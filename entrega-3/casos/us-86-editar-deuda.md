# Casos de prueba V3 — Editar una deuda (US-86)

**Historia:** [#285](https://github.com/Joaconz/Biyu/issues/285) · ADR-037 · C4, C5, C6, C7 · I4, I5, I7.
**Oráculo:** la deuda de un gasto edita persona, monto y nota (el monto no puede superar el del gasto, I7); la suelta también fecha y dirección; la moneda y el tipo de cambio quedan congelados (C5). Una deuda saldada no se edita: primero se vuelve a pendiente. Eliminarla es US-87 (`us-87-eliminar-deuda.md`).
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/update_debt` con `{"p_debt_id", "p_person", "p_amount", "p_notes", "p_incurred_on", "p_direction"}`. Una deuda inexistente, ajena o de un gasto eliminado responde `PT404` «Deuda no encontrada» (HTTP 404), igual que `delete_debt`.
**Automatización:** `e2e/debts-edit.spec.ts`, `supabase/tests/database/update_debt.test.sql` y `tests/domain/debt-edit.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DEU-078 | Editar una deuda suelta desde el listado y volver con los mismos filtros | CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-079 | En US$ el tipo de cambio sigue congelado y la moneda es texto | CA-2 | Particiones | Positivo | UI y API | Alta | Sí |
| CP-DEU-080 | La deuda de un gasto edita persona, monto y nota con el tope del gasto | CA-3, CA-4 | Valores límite | Positivo y negativo | UI y API | Alta | Sí |
| CP-DEU-081 | Validaciones de la pantalla y de la RPC | CA-5 | Particiones | Negativo | UI y API | Alta | Sí |
| CP-DEU-082 | Una deuda saldada no se edita; vuelta a pendiente se edita | CA-6 | Tabla de decisión | Negativo | UI y API | Alta | Sí |
| CP-DEU-083 | Si falla guardar se conserva lo escrito y reintentar guarda | CA-7 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-DEU-084 | Otro usuario y `anon` no pueden editar la deuda ajena; la de un gasto eliminado no se edita | CA-8 | Adivinación de errores | Negativo | UI y API | Alta | Sí |

## CP-DEU-078 — Editar una deuda suelta
**Pre-requisitos:** PR-01 con `deuda-078@biyu.test`; una deuda «Me deben» de Juan por $10.000,00 con la nota «Nafta» del 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=pending&direction=owed_to_me` y tocar «Editar deuda de Juan» (≥44 px). | URL `/debts/<id>/edit?status=pending&direction=owed_to_me`; los campos precargados (Monto `10.000,00`); «Guardar cambios» deshabilitado. |
| 2 | Cambiar Persona a `Juan Pérez`, Monto a `12.000,50`, Nota a `Combustible`, Fecha al 10/08/2026 y Dirección a «Debo». | «Guardar cambios» se habilita. |
| 3 | Tocar «Guardar cambios». | Aviso «Cambios guardados» y vuelve a `/debts?status=pending&direction=owed_to_me`. |
| 4 | Abrir Deudas sin filtros. | «Juan Pérez · Le debés»; «Debés» suma $12.000,50. |

## CP-DEU-079 — US$ congelado
**Pre-requisitos:** PR-01; una deuda «Debo» de Marcos por US$20,00 con TC 1.450,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición. | «US$» y «TC 1.450,00» son texto; no hay campo de tipo de cambio. |
| 2 | Cambiar el monto a `30` y guardar. | `amount` 30,00, `fx_rate` 1450,0000 y `amount_ars` $43.500,00 (C5). |

## CP-DEU-080 y CP-DEU-081 — Deuda de un gasto y validaciones
**Pre-requisitos:** PR-01; un gasto de $40.000,00 compartido con Sofía por $15.000,00.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición de la deuda de Sofía. | No hay Fecha ni Dirección; la nota dice que son las del gasto. |
| 2 | Monto `40.000,01`. | «No puede superar el monto del gasto ($40.000,00)» y «Guardar cambios» deshabilitado. |
| 3 | Monto `20000`, persona `Sofía G.`, nota `Cena`; guardar. | Se guarda; la fecha y la dirección siguen siendo las del gasto. |
| 4 | API con `p_incurred_on` o `p_direction` distintos de los del gasto. | `23514`, «La fecha y la dirección de una deuda de un gasto no se pueden cambiar». |
| 5 | API con `p_amount` 40000.01. | `23514`, «I7: la deuda no puede superar el monto del gasto». |
| 6 | Persona de `   `, monto `0`, `10,123`, `abc`, fecha futura. | Los mensajes de «Nueva deuda» («Ingresá el nombre de la persona», «El monto debe ser mayor a cero», «El monto admite hasta 2 decimales», «Ingresá un número válido», «La fecha no puede ser futura»). |
| 7 | API con persona de 61 caracteres. | `23514`, «La persona admite hasta 60 caracteres»; la deuda no cambia. |

## CP-DEU-082 — Deuda saldada
**Pre-requisitos:** PR-01; una deuda de Juan, saldada.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=settled`. | La fila tiene «Volver a pendiente» y no tiene «Editar». |
| 2 | Abrir `/debts/<id>/edit`. | «Una deuda saldada no se puede editar. Volvela a pendiente desde Deudas.»; sin formulario. |
| 3 | API: `update_debt`. | `23514`, «Una deuda saldada no se puede editar: volvela a pendiente primero». |
| 4 | Tocar «Volver a pendiente» y abrir la edición. | El formulario se muestra. |

## CP-DEU-083 y CP-DEU-084 — Error al guardar y autorización
| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Cortar la red, cambiar el monto a `12000` y guardar. | Franja «No pudimos guardar los cambios…»; el campo conserva `12000`. Con la red, reintentar guarda. |
| 2 | Con la sesión de B, abrir `/debts/<id de A>/edit` y `/debts/no-es-un-uuid/edit`. | «No encontramos esta deuda.» |
| 3 | API con el token de B: `update_debt` sobre la deuda de A. | HTTP 404, `PT404`, «Deuda no encontrada». |
| 4 | Sin token (`anon`). | HTTP 401, `42501`. |
| 5 | `PATCH /debts` con la sesión del usuario. | Rechazado (ADR-037). La deuda de A no cambió. |
| 6 | API: `update_debt` sobre la deuda de un gasto eliminado. | `PT404`, «Deuda no encontrada» (ADR-037 §4). Al restaurar el gasto, vuelve a poder editarse. |
