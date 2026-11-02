# Casos de prueba V3 — Editar un movimiento (US-84)

**Historia:** [#284](https://github.com/Joaconz/Biyu/issues/284) · `entrega-2/historias/editar-movimiento.md` · ADR-043, ADR-009 · FR-07 · C3, C4, C5, C6, C7, C10.
**Oráculo:** los criterios CA-1 a CA-30 de la historia. H es el mes de hoy en Argentina; H−1 el anterior; H−2 el de dos meses antes. Un «mes cerrado» es cualquiera anterior a H.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/update_transaction` con `{"p_transaction_id", "p_amount", "p_category_id", "p_account_id", "p_installments_count", "p_occurred_on", "p_description"}`; no recibe tipo, moneda ni tipo de cambio.
**Automatización:** cada caso está en `e2e/transactions-edit.spec.ts` (UI y API), `supabase/tests/database/update_transaction.test.sql` (base) o `tests/domain/transaction-edit.test.ts` (dominio, `today` fijo).

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-REG-017 | «Editar» en las filas activas, no en las eliminadas, con los campos precargados y la vuelta al mismo período | CA-1, CA-26 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-018 | Tipo, moneda y tipo de cambio son texto y la RPC no los recibe | CA-2 | Particiones | Negativo | UI y API | Media | Sí |
| CP-REG-019 | Cambiar el monto de un gasto de este mes se guarda sin diálogo | CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-020 | El resto de una compra en cuotas se reparte con la regla de C3, y la vista previa lo anticipa | CA-4 | Valores límite | Positivo | UI y API | Alta | Sí |
| CP-REG-021 | Pasar de 6 cuotas a 3 deja exactamente 3 imputaciones numeradas de 1 a 3 | CA-5 | Valores límite | Positivo | UI | Alta | Sí |
| CP-REG-022 | Mover la fecha a un mes cerrado abre el aviso de meses cerrados | CA-6 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-REG-023 | Cambiar el monto en un mes cerrado: «Cancelar» no guarda y «Guardar igual» sí | CA-7, CA-26 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-024 | Categoría sola y monto con categoría en meses cerrados | CA-8 a CA-10 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-REG-025 | Cambiar la cuenta en un mes cerrado | CA-11 | Tabla de decisión | Positivo | UI | Media | Sí |
| CP-REG-026 | La nota, mover la fecha dentro del mes o cambiar solo una cuota futura no abren el aviso | CA-12, CA-13 | Tabla de decisión | Positivo | UI | Alta | Sí |
| CP-REG-027 | En USD el tipo de cambio sigue congelado y el aviso va en pesos | CA-15, CA-16 | Casos de uso | Positivo | UI y API | Alta | Sí |
| CP-REG-028 | Un ingreso no muestra categoría ni cuotas; por la API, con cuotas se rechaza | CA-17 | Particiones | Positivo y negativo | UI y API | Alta | Sí |
| CP-REG-029 | Pasar una compra en cuotas a efectivo reinicia las cuotas y lo avisa; la RPC lo rechaza (I6) | CA-18 | Tabla de decisión | Negativo | UI y API | Alta | Sí |
| CP-REG-030 | Validaciones de la pantalla con los mensajes de Registrar | CA-19 | Particiones | Negativo | UI | Alta | Sí |
| CP-REG-031 | Las mismas validaciones directo contra la RPC, con atomicidad | CA-19 | Valores límite | Negativo | API | Alta | Sí |
| CP-REG-032 | Una categoría o cuenta archivada se ve, se puede guardar sin tocar y no se ofrece otra | CA-20 | Particiones | Positivo | UI y API | Media | Sí |
| CP-REG-033 | Eliminado, de una suscripción y compartido muestran su aviso; la RPC responde el mensaje exacto | CA-21 | Tabla de decisión | Negativo | UI y API | Alta | Sí |
| CP-REG-034 | «Guardar cambios» sigue los cambios y salir con cambios pide confirmar | CA-22 | Transición de estados | Positivo | UI | Media | Sí |
| CP-REG-035 | Si falla guardar se muestra el error, se conserva lo escrito y reintentar guarda | CA-23 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-REG-036 | Editar dos veces, o dos a la vez, deja una sola versión consistente | CA-24, CA-25 | Adivinación de errores | Positivo | API | Media | Sí |
| CP-REG-037 | Otro usuario y `anon` no pueden editar ni ver el movimiento; no hay `update` directo | CA-27 | Adivinación de errores | Negativo | UI y API | Alta | Sí |
| CP-REG-038 | El eliminado no suma y el editado sí, en su mes | CA-28 | Casos de uso | Positivo | UI | Media | Sí |
| CP-REG-039 | Sin scroll horizontal a 390 px, foco atrapado y devuelto, botón de al menos 44 px | CA-30 | Casos de uso | Positivo | UI | Media | Sí |
| CP-REG-040 | La función de aviso con `today` fijo | CA-29 | Valores límite | Positivo | Dominio | Media | Sí |

## CP-REG-017 — Entrada, precarga y vuelta al período
**Pre-requisitos:** PR-01 con `editar-017@biyu.test`; una compra de $30.000,00 en 3 cuotas con «Tarjeta de crédito» con fecha de H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/transactions?period=<H>`. | La fila «2/3» tiene el botón «Editar movimiento» (`transactions-item-edit`) de al menos 44×44 px. |
| 2 | Tocar «Editar movimiento». | URL `/transactions/<id>/edit?period=<H>`; Monto muestra `30.000,00` (el total, no la cuota), Fecha la del movimiento y las cuotas en 3. La barra inferior marca «Resumen». |
| 3 | Tocar «Cancelar» sin cambiar nada. | Vuelve a `/transactions?period=<H>` sin diálogo. |
| 4 | Eliminar el movimiento y abrir `/transactions?period=<H>&view=deleted`. | La fila eliminada no tiene el botón «Editar». |

## CP-REG-018 — Solo lectura
**Pre-requisitos:** PR-01; un gasto de US$100,00 con TC 1.450,00 (PR-04).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición del gasto. | «Gasto», «US$» y «TC 1.450,00» son texto, no controles, con el aviso «El tipo, la moneda y el tipo de cambio no se pueden cambiar…». |
| 2 | `update_transaction` con `p_currency` incluido. | HTTP 404, código `PGRST202`: la función no tiene ese parámetro. |

## CP-REG-019 — Monto de este mes, sin diálogo
**Pre-requisitos:** PR-01; un gasto de $10.000,00 con fecha del día 1 de H, 1 cuota.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición: «Guardar cambios» está deshabilitado. | Deshabilitado con los valores originales. |
| 2 | Escribir `12.500,00` en Monto y tocar «Guardar cambios». | No aparece el diálogo; vuelve a Movimientos con «Cambios guardados» y la lista muestra $12.500,00. |
| 3 | Abrir el Resumen de H. | «Gastado» muestra $12.500,00; la transacción tiene 1 imputación de $12.500,00 (I1). |

## CP-REG-020 — Resto de las cuotas
**Pre-requisitos:** PR-01; una compra de $100.000,00 en 3 cuotas con «Tarjeta de crédito» (33.333,33 + 33.333,33 + 33.333,34), fecha en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Escribir `100001` en Monto. | La vista previa dice «3 cuotas de $33.333,66» y que la última es de $33.333,68. |
| 2 | Tocar «Guardar cambios». | «Cambios guardados». Las 3 imputaciones son 33.333,66 + 33.333,66 + 33.333,68 y suman exactamente $100.001,00 (C3, I1, I2). |

## CP-REG-021 — Menos cuotas
**Pre-requisitos:** PR-01; una compra de $120.000,00 en 6 cuotas con «Tarjeta de crédito», fecha en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar el chip de 3 cuotas y «Guardar cambios». | Hay exactamente 3 imputaciones de $40.000,00 en H, H+1 y H+2, numeradas de 1 a 3, y ninguna en H+3, H+4 ni H+5 (I2, I3). |

## CP-REG-022 y CP-REG-023 — Aviso de meses cerrados
**Pre-requisitos:** PR-01; (a) una compra de $30.000,00 en 3 cuotas con «Tarjeta de crédito» con fecha en H; (b) un gasto de $30.000,00 de 1 cuota con fecha en H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En (a), cambiar la fecha a un día de H−1 y «Guardar cambios». | Diálogo «Esto cambia meses que ya pasaron» con la línea de H−1 «de $0,00 a $10.000,00». El foco está en «Cancelar». |
| 2 | Tocar «Cancelar». | No se guardó nada: las imputaciones siguen en H, H+1 y H+2. |
| 3 | En (b), abrir la edición desde `/transactions?period=<H−1>`, escribir `35000` y «Guardar cambios». | El diálogo lista H−1 con «de $30.000,00 a $35.000,00». |
| 4 | Tocar «Guardar igual». | «Cambios guardados», vuelve a `/transactions?period=<H−1>` y el Resumen de H−1 muestra $35.000,00. |

## CP-REG-024 y CP-REG-025 — Categoría, monto y cuenta
**Pre-requisitos:** PR-01; una compra de $30.000,00 en 3 cuotas con «Tarjeta de crédito» en «Comida y supermercado» con fecha en H−2, y un gasto de 1 cuota en «Efectivo» con fecha en H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En la compra, elegir la categoría «Otros» y guardar. | El diálogo lista H−2 y H−1 con «categoría: de Comida y supermercado a Otros», sin montos; H no se lista (no está cerrado). |
| 2 | En el gasto de 1 cuota, cambiar el monto a $35.000,00 y la categoría a «Otros». | La línea de H−1 dice «de $30.000,00 a $35.000,00 · categoría: de Comida y supermercado a Otros». |
| 3 | Volver a la categoría y monto originales y cambiar la cuenta a «Tarjeta de débito». | La línea de H−1 dice «cuenta: de Efectivo a Tarjeta de débito». |

## CP-REG-026 — Cambios que no abren el aviso
**Pre-requisitos:** PR-01; un gasto de $30.000,00 con fecha del día 5 de H−1; una compra de $100.000,00 en 3 cuotas con fecha en H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cambiar solo la nota y guardar. | Se guarda sin diálogo. |
| 2 | Mover la fecha al día 20 de H−1 y guardar. | Se guarda sin diálogo: la imputación de H−1 queda igual. |
| 3 | En la compra, pasar el monto a `100.000,01` y guardar. | Se guarda sin diálogo: solo cambia la última cuota (33.333,34 → 33.333,35), que cae en un mes futuro. |

## CP-REG-027 — USD
**Pre-requisitos:** PR-01; TC de referencia de H cargado en 1.500,00; un gasto de US$100,00 con TC 1.000,00 con fecha en H, y otro igual con fecha en H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Editar el de H: monto `120`. | Se guarda. `amount` 120,00, `fx_rate` 1000,0000 (sigue congelado aunque hoy el de referencia sea otro, C5) y `amount_ars` $120.000,00; la imputación es de US$120,00 y $120.000,00. |
| 2 | Editar el de H−1: monto `120`. | El diálogo dice «de $100.000,00 a $120.000,00», en pesos con el TC congelado. |

## CP-REG-028 — Ingreso
**Pre-requisitos:** PR-01; un ingreso de $50.000,00 con fecha en H−1.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición. | No muestra Categoría ni Cuotas; el tipo es «Ingreso». |
| 2 | Monto `55000` y guardar. | El diálogo lista H−1 «de $50.000,00 a $55.000,00»; «Guardar igual» guarda. |
| 3 | Por la API, `update_transaction` con `p_installments_count` 3. | HTTP 400, `23514`, «I6: las cuotas solo aplican a gastos con cuenta credit_card». |

## CP-REG-029 — I6
**Pre-requisitos:** PR-01; un gasto de $6.000,00 en 6 cuotas con «Tarjeta de crédito».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Elegir la cuenta «Efectivo». | Las cuotas vuelven a 1 y aparece el aviso «Las cuotas volvieron a 1»; el selector de cuotas desaparece. |
| 2 | Por la API, `update_transaction` con cuenta de efectivo y `p_installments_count` 6. | HTTP 400, `23514`, mensaje de I6; la transacción y sus 6 imputaciones quedan como estaban. |

## CP-REG-030 y CP-REG-031 — Validaciones
**Pre-requisitos:** PR-01; un gasto de $10.000,00 con «Tarjeta de crédito» en H.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Monto vacío, `0`, `-5`. | «El monto debe ser mayor a cero» y «Guardar cambios» deshabilitado. |
| 2 | Monto `10,123`. | «El monto admite hasta 2 decimales». |
| 3 | Monto `0,11` con 12 cuotas. | «Con ese monto, cada cuota daría menos de 0,01». |
| 4 | Fecha de un mes posterior. | «La fecha no puede ser futura». |
| 5 | API: fecha de mañana. | `23514`, «FR-06: la fecha no puede ser posterior a hoy». La fecha de hoy en Argentina se acepta. |
| 6 | API: monto nulo, 0, negativo, `NaN`, 3 decimales; cuotas 0 y 13; gasto sin categoría; cuenta o categoría de otro usuario. | Los mismos mensajes que `create_transaction`; `23503` «la cuenta no existe, no es tuya o está archivada» / «la categoría no existe…». |
| 7 | API: `$0,11` en 12 cuotas. | `23514`, «I4: cada cuota debe ser al menos 0,01». |
| 8 | Después de cada rechazo, leer el movimiento y sus imputaciones. | No cambiaron (atomicidad). |

## CP-REG-032 — Categoría o cuenta archivada
**Pre-requisitos:** PR-01; un gasto en «Otros»; archivar «Otros» y «Comida y supermercado».

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición. | «Otros (archivada)» está elegida; «Comida y supermercado» no se ofrece. |
| 2 | Cambiar el monto sin tocar la categoría y guardar. | Se guarda. |
| 3 | API: elegir otra categoría o cuenta archivada. | `23503`, «la categoría no existe, no es tuya o está archivada» / «la cuenta no existe…». Ya cambiada la categoría, la archivada original tampoco se puede volver a elegir. |

## CP-REG-033 — Bloqueos
**Pre-requisitos:** PR-01; un movimiento eliminado; uno generado por la suscripción «Netflix»; un gasto compartido con Sofía.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Abrir `/transactions/<id>/edit` de cada uno. | Solo el aviso («Este movimiento está eliminado. Restauralo para poder editarlo.», «Este gasto lo generó la suscripción Netflix…», «Este gasto está compartido con Sofía…») y «Volver»; no se ve el formulario. |
| 2 | API sobre cada uno. | HTTP 400, `23514`: «Un movimiento eliminado no se puede editar», «Un movimiento de una suscripción no se puede editar», «Un movimiento compartido no se puede editar». Una ocurrencia eliminada responde el de eliminado. |

## CP-REG-034 y CP-REG-035 — Cambios sin guardar y error al guardar
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir la edición de un gasto de $12.500,00: «Guardar cambios» está deshabilitado. Escribir `13000`: se habilita. Escribir `12.500,00`: se vuelve a deshabilitar. | Compara valores interpretados. |
| 2 | Con la nota cambiada, tocar la flecha atrás. | «¿Salir sin guardar los cambios?»; «Seguir editando» conserva lo escrito; «Salir sin guardar» vuelve a Movimientos sin guardar. |
| 3 | Cortar la red, cambiar el monto y guardar. | Franja «No pudimos guardar los cambios…», el formulario conserva lo escrito y «Guardar cambios» vuelve a estar habilitado. Con la red, reintentar guarda. |

## CP-REG-036 y CP-REG-037 — Idempotencia, concurrencia y autorización
**Pre-requisitos:** PR-01 para A y B; PR-04 para sus tokens.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | Dos veces `update_transaction` con los mismos valores. | Las mismas imputaciones por (período, número de cuota, monto, monto en pesos). |
| 2 | Dos llamadas simultáneas con valores distintos. | Una sola versión: cantidad de imputaciones = `installments_count` (I2), suma = monto (I1), numeradas sin huecos. |
| 3 | `delete_transaction` y luego `update_transaction`. | `23514`, «Un movimiento eliminado no se puede editar». |
| 4 | Con el token de B, editar el movimiento de A. | `23503`, «la transacción no existe o no te pertenece»; `/transactions/<id>/edit` de A, con B: «No encontramos este movimiento.». |
| 5 | Sin token (`anon`). | HTTP 401, `42501`. |
| 6 | `PATCH /transactions` o `DELETE /ledger_entries` con la sesión del usuario. | Rechazado (C4, C7). |

## CP-REG-038, CP-REG-039 y CP-REG-040
| ID | Verificación | Resultado esperado |
|---|---|---|
| 038 | Un gasto eliminado de $5.000,00 y otro activo de $30.000,00 en H−1; editar el activo a $35.000,00. | El Resumen de H−1 muestra $35.000,00: el eliminado no suma (I10). |
| 039 | A 390 px, abrir la edición, cambiar un monto de un mes cerrado y abrir el diálogo con el teclado. | Sin scroll horizontal; el foco queda atrapado en el diálogo, Escape lo cierra y el foco vuelve al botón «Guardar cambios». |
| 040 | `closedMonthChanges` con `today` = 2026-10-09 sobre una compra del 2026-09-15 de $30.000,00 en 3 cuotas que pasa a $36.000,00. | Una sola línea: septiembre, «de $10.000,00 a $12.000,00». Con `today` = 2026-09-30 ninguna; con 2026-10-01 la misma. |
