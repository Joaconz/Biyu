# Casos de prueba V3 — Editar y eliminar una deuda (US-86 y US-87)

**Historias:** [#285](https://github.com/Joaconz/Biyu/issues/285) (US-86) y [#329](https://github.com/Joaconz/Biyu/issues/329) (US-87) · ADR-037, ADR-044 §3 · C4, C5, C6, C7 · I4, I5, I7.
**Oráculo:** la deuda de un gasto edita persona, monto y nota (el monto no puede superar el del gasto, I7); la suelta también fecha y dirección; la moneda y el tipo de cambio quedan congelados (C5). Una deuda saldada ni se edita ni se elimina: primero se vuelve a pendiente. Eliminar la deuda de un gasto compartido deja el gasto como un gasto normal.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/update_debt` con `{"p_debt_id", "p_person", "p_amount", "p_notes", "p_incurred_on", "p_direction"}` y `.../rpc/delete_debt` con `{"p_debt_id"}`. Una deuda inexistente, ajena o de un gasto eliminado responde `23514` «La deuda no existe» (igual que `settle_debt`).
**Automatización:** `e2e/debts-edit.spec.ts`, `supabase/tests/database/update_delete_debt.test.sql` y `tests/domain/debt-edit.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-DEU-062 | Editar una deuda suelta desde el listado y volver con los mismos filtros | US-86 CA-1 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-063 | En US$ el tipo de cambio sigue congelado y la moneda es texto | US-86 CA-2 | Particiones | Positivo | UI y API | Alta | Sí |
| CP-DEU-064 | La deuda de un gasto edita persona, monto y nota con el tope del gasto | US-86 CA-3, CA-4 | Valores límite | Positivo y negativo | UI y API | Alta | Sí |
| CP-DEU-065 | Validaciones de la pantalla y de la RPC | US-86 CA-5 | Particiones | Negativo | UI y API | Alta | Sí |
| CP-DEU-066 | Una deuda saldada no se edita ni se elimina; vuelta a pendiente se edita | US-86 CA-6, US-87 CA-5 | Tabla de decisión | Negativo | UI y API | Alta | Sí |
| CP-DEU-067 | Si falla guardar se conserva lo escrito y reintentar guarda | US-86 CA-7 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-DEU-068 | Otro usuario y `anon` no pueden editar ni eliminar la deuda ajena | US-86 CA-8, US-87 CA-9 | Adivinación de errores | Negativo | UI y API | Alta | Sí |
| CP-DEU-069 | Eliminar una deuda suelta: la confirmación dice cuál, cancelar no borra | US-87 CA-1 a CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-070 | Eliminar la deuda de un gasto compartido deja el gasto como gasto normal | US-87 CA-4 | Casos de uso | Positivo | UI y API | Alta | Sí |
| CP-DEU-071 | Eliminar una deuda dentro de un grupo de la misma persona | US-87 + US-91 | Casos de uso | Positivo | UI | Media | Sí |
| CP-DEU-072 | La deuda de un gasto eliminado no se edita ni se elimina | ADR-037 §4 | Adivinación de errores | Negativo | API | Media | Sí |

## CP-DEU-062 — Editar una deuda suelta
**Pre-requisitos:** PR-01 con `deuda-062@biyu.test`; una deuda «Me deben» de Juan por $10.000,00 con la nota «Nafta» del 15/08/2026.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=pending&direction=owed_to_me` y tocar «Editar la deuda de Juan» (≥44 px). | URL `/debts/<id>/edit?status=pending&direction=owed_to_me`; los campos precargados (Monto `10.000,00`); «Guardar cambios» deshabilitado. |
| 2 | Cambiar Persona a `Juan Pérez`, Monto a `12.000,50`, Nota a `Combustible`, Fecha al 10/08/2026 y Dirección a «Debo». | «Guardar cambios» se habilita. |
| 3 | Tocar «Guardar cambios». | Aviso «Cambios guardados» y vuelve a `/debts?status=pending&direction=owed_to_me`. |
| 4 | Abrir Deudas sin filtros. | «Juan Pérez · Le debés»; «Debés» suma $12.000,50. |

## CP-DEU-063 — US$ congelado
**Pre-requisitos:** PR-01; una deuda «Debo» de Marcos por US$20,00 con TC 1.450,00.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición. | «US$» y «TC 1.450,00» son texto; no hay campo de tipo de cambio. |
| 2 | Cambiar el monto a `30` y guardar. | `amount` 30,00, `fx_rate` 1450,0000 y `amount_ars` $43.500,00 (C5). |

## CP-DEU-064 y CP-DEU-065 — Deuda de un gasto y validaciones
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

## CP-DEU-066 — Deuda saldada
**Pre-requisitos:** PR-01; una deuda de Juan, saldada.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Abrir `/debts?status=settled`. | La fila tiene «Volver a pendiente» y no tiene «Editar» ni «Eliminar». |
| 2 | Abrir `/debts/<id>/edit`. | «Una deuda saldada no se puede editar. Volvela a pendiente desde Deudas.»; sin formulario. |
| 3 | API: `update_debt` y `delete_debt`. | `23514`, «Una deuda saldada no se puede editar: volvela a pendiente primero» y «…eliminar…». |
| 4 | Tocar «Volver a pendiente» y abrir la edición. | El formulario se muestra. |

## CP-DEU-067 y CP-DEU-068 — Error al guardar y autorización
| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Cortar la red, cambiar el monto a `12000` y guardar. | Franja «No pudimos guardar los cambios…»; el campo conserva `12000`. Con la red, reintentar guarda. |
| 2 | Con la sesión de B, abrir `/debts/<id de A>/edit` y `/debts/no-es-un-uuid/edit`. | «No encontramos esta deuda.» |
| 3 | API con el token de B: `update_debt` y `delete_debt` sobre la deuda de A. | `23514`, «La deuda no existe». |
| 4 | Sin token (`anon`). | HTTP 401, `42501`. |
| 5 | `PATCH /debts` con la sesión del usuario. | Rechazado (ADR-037). La deuda de A no cambió. |

## CP-DEU-069 a CP-DEU-071 — Eliminar
**Pre-requisitos:** PR-01; deudas suelta de Ana ($500,00) y de «Borrar» ($700,00 del 18/08/2026); un gasto compartido con Sofía; dos deudas de «Juan»/«juan».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la fila de «Borrar», tocar «Eliminar la deuda de Borrar». | Diálogo «¿Eliminar deuda?» con Persona: Borrar, Te debe: $700,00 y Fecha: 18/08/2026, y «La deuda deja de contar en los totales. Esto no se puede deshacer.»; no dice nada del gasto. |
| 2 | Tocar «Cancelar». | La deuda sigue en el listado. |
| 3 | Repetir y tocar «Eliminar». | Aviso «Deuda con Borrar eliminada»; «Te deben» baja de $1.200,00 a $500,00. |
| 4 | En la deuda de Sofía, tocar «Eliminar». | El diálogo dice «El gasto de Comida y supermercado sigue como un gasto normal, sin compartir.». Al confirmar, la deuda no existe y el gasto sigue en Movimientos de agosto por $40.000,00 sin la etiqueta «compartido con Sofía». |
| 5 | Desplegar el grupo de Juan y eliminar una de sus dos deudas. | Queda una sola: ya no es un grupo. |

## CP-DEU-072 — Gasto eliminado
**Pre-requisitos:** PR-01; el gasto compartido con Sofía, eliminado.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | API: `update_debt` y `delete_debt` sobre la deuda de Sofía. | `23514`, «La deuda no existe» (ADR-037 §4). Al restaurar el gasto, la deuda vuelve a poder editarse. |
