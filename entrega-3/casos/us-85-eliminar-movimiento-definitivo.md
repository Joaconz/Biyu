# Casos de prueba V3 — Eliminar definitivamente un movimiento (US-85)

**Historia:** [#328](https://github.com/Joaconz/Biyu/issues/328) · ADR-044 §1-§2 · C4, C6, C7, C10, I10, I11.
**Oráculo:** la baja lógica sigue como siempre (C10); desde «Eliminados», «Eliminar definitivamente» borra para siempre el movimiento, sus imputaciones y su deuda vinculada. Solo acepta movimientos ya eliminados y nunca el generado por una suscripción.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/purge_transaction` con `{"p_transaction_id": "<uuid>"}`.
**Automatización:** `e2e/transactions-purge.spec.ts`, `supabase/tests/database/purge_transaction.test.sql` y `tests/domain/transaction-purge.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-REG-041 | Una fila activa no ofrece «Eliminar definitivamente» y la RPC la rechaza | CA-1 | Particiones | Negativo | UI y API | Alta | Sí |
| CP-REG-042 | Eliminar y después eliminar definitivamente una compra en cuotas | CA-2, CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-REG-043 | Un gasto compartido se borra con su deuda vinculada | CA-3 | Casos de uso | Positivo | UI y API | Alta | Sí |
| CP-REG-044 | El movimiento de una suscripción no se borra definitivamente | ADR-044 §2 | Adivinación de errores | Negativo | UI y API | Alta | Sí |
| CP-REG-045 | Otro usuario y `anon` no pueden borrarlo (C7) | CA-4 | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-REG-046 | Cancelar la confirmación no borra nada | CA-5 | Casos de uso | Negativo | UI | Media | Sí |

## CP-REG-041 — Un movimiento activo
**Pre-requisitos:** PR-01 con `purgar-041@biyu.test`; un gasto de $700,00 en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `/transactions?period=<H>` y tocar la fila activa. | Abre Editar, que al pie tiene «Eliminar movimiento» (ADR-052); ni la fila ni Editar ofrecen «Eliminar definitivamente». |
| 2 | API: `purge_transaction` sobre ese gasto. | HTTP 400, `23514`, «Un movimiento activo no se puede eliminar definitivamente»; el gasto sigue ahí. |

## CP-REG-042 y CP-REG-046 — Dos pasos y cancelar
**Pre-requisitos:** PR-01 con `purgar-042@biyu.test`; una compra de $30.000,00 en 3 cuotas con «Tarjeta de crédito» en H.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Tocar la fila, después «Eliminar movimiento» al pie de Editar, y confirmar. | Vuelve a Movimientos y la fila pasa a «Eliminados» (se puede restaurar, como siempre). |
| 2 | Abrir «Eliminados»: la fila tiene «Restaurar» y «Eliminar definitivamente» (≥44 px). | Las dos acciones. |
| 3 | Tocar «Eliminar definitivamente». | Diálogo «¿Eliminar definitivamente?» con Gasto $30.000,00, categoría, cuenta, fecha y «3 cuotas»; dice «Se borra para siempre. No se puede restaurar.» y «Se borran también sus 3 cuotas.». |
| 4 | Tocar «Cancelar». | El diálogo se cierra y la fila sigue en «Eliminados». |
| 5 | Repetir el paso 3 y tocar «Eliminar definitivamente». | Aviso «Movimiento eliminado definitivamente»; la fila desaparece y, al recargar, no vuelve. |
| 6 | API: leer la transacción y sus imputaciones; llamar a `restore_transaction`. | No hay filas; `restore_transaction` responde `23503`. |

## CP-REG-043 — Gasto compartido
**Pre-requisitos:** PR-01; un gasto de $40.000,00 compartido con Sofía por $15.000,00, ya eliminado.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | En «Eliminados», tocar «Eliminar definitivamente». | El diálogo dice «Se borra también la deuda con Sofía.». |
| 2 | Confirmar. | El gasto y la deuda con Sofía ya no existen; Deudas no la muestra. |

## CP-REG-044 — Movimiento de una suscripción
**Pre-requisitos:** PR-01; una suscripción «Netflix» con una ocurrencia generada en H−1, eliminada.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | Abrir «Eliminados» de H−1. | La fila tiene «Restaurar» y no tiene «Eliminar definitivamente». |
| 2 | API: `purge_transaction` sobre esa ocurrencia. | `23514`, «Un movimiento de una suscripción no se puede eliminar definitivamente»; sigue en «Eliminados». |
| 3 | Correr la puesta al día. | No genera nada de nuevo (I11): la ocurrencia nunca se borró. |

## CP-REG-045 — Autorización
**Pre-requisitos:** PR-01 para A y B; un movimiento eliminado de A.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, `purge_transaction` sobre el movimiento de A. | `23503`, «la transacción no existe o no te pertenece» (igual que un uuid inexistente). |
| 2 | Sin token (`anon`). | HTTP 401, `42501`. |
| 3 | `DELETE /transactions` con la sesión del usuario. | Rechazado (C4). El movimiento de A sigue ahí. |
