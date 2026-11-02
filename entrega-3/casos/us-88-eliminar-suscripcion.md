# Casos de prueba V3 — Eliminar una suscripción (US-88)

**Historia:** [#330](https://github.com/Joaconz/Biyu/issues/330) · ADR-044 §4 · C4, C6, C7 · I11, I14.
**Oráculo:** se elimina en cualquier estado (activa, pausada o cancelada); los gastos que ya generó quedan como movimientos sueltos, con los mismos montos y meses, así los totales de meses cerrados no cambian; deja de generar gastos y el nombre queda libre. Una inexistente o ajena responde `PT404` (HTTP 404), igual que las demás RPC de suscripciones.
**Convenciones:** PR-01 crea el usuario y PR-04 su token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/delete_subscription` con `{"p_subscription_id": "<uuid>"}`.
**Automatización:** `e2e/subscriptions-delete.spec.ts`, `supabase/tests/database/delete_subscription.test.sql` y `tests/domain/subscription-delete.test.ts`.

| ID | Título | Criterio | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|---|
| CP-SUS-049 | Eliminar una suscripción activa: la confirmación dice qué pasa y los gastos quedan sueltos | CA-1 a CA-3 | Casos de uso | Positivo | UI | Alta | Sí |
| CP-SUS-050 | Una cancelada y una pausada también se eliminan; el nombre queda libre | CA-4 | Particiones | Positivo | UI y API | Alta | Sí |
| CP-SUS-051 | Si falla eliminar, el diálogo queda abierto con el motivo y reintentar elimina | CA-6 | Adivinación de errores | Negativo | UI | Media | Sí |
| CP-SUS-052 | Inexistente, ajena y `anon`: 404, 404 y 401 | CA-5 | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-SUS-053 | Un gasto suelto que fue de una suscripción eliminada se trata como cualquier movimiento | ADR-044 §4 | Casos de uso | Positivo | API | Media | Sí |
| CP-SUS-054 | La puesta al día no regenera los gastos de una suscripción eliminada (I11) | CA-2 | Valores límite | Positivo | Base | Alta | Sí |

## CP-SUS-049 — Eliminar una suscripción activa
**Pre-requisitos:** PR-01 con `eliminar-susc-049@biyu.test`; una suscripción «Netflix» de $5.000,00, día de cobro 1, desde hace 3 meses, con sus gastos ya generados (N, con N ≥ 3).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el Detalle de Netflix y tocar «Eliminar». | Diálogo «¿Eliminar Netflix?» con Suscripción: Netflix, Monto mensual: $5.000,00 y Estado: Activa. Dice «Los N gastos que ya cargó quedan como movimientos sueltos, con los mismos montos y meses.» y «Deja de cargar gastos. Esto no se puede deshacer.». El botón de cerrar dice «Volver». |
| 2 | Tocar «Volver». | El diálogo se cierra; la suscripción sigue existiendo. |
| 3 | Tocar «Eliminar» y confirmar con «Eliminar». | Aviso «Suscripción Netflix eliminada» y vuelve a Suscripciones, que muestra el estado vacío. |
| 4 | Recargar Suscripciones. | No aparece nada ni se genera nada nuevo (I11). |
| 5 | API: leer las transacciones. | Siguen las N, con `subscription_id` y `subscription_period` en nulo y la misma suma de montos. |
| 6 | En Movimientos del mes anterior, mirar el gasto de Netflix. | Ya no lleva la etiqueta de la suscripción y se trata como cualquier movimiento (se puede eliminar). |

## CP-SUS-050 — Cancelada y pausada
**Pre-requisitos:** PR-01; dos suscripciones con gastos: «Cancelada» (cancelada) y «Pausada» (pausada).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir el Detalle de la cancelada. | Solo hay «Eliminar»: no están «Editar», «Pausar» ni «Cancelar suscripción». |
| 2 | Tocar «Eliminar». | El resumen dice Estado: «Cancelada el <fecha>». Al confirmar, se elimina. |
| 3 | Abrir el Detalle de la pausada y tocar «Eliminar». | El resumen dice «Pausada desde <fecha>». Al confirmar, se elimina. |
| 4 | Crear otra suscripción llamada «Cancelada». | Se crea sin error: el nombre quedó libre. |

## CP-SUS-051 — Error al eliminar
| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Cortar la red, tocar «Eliminar» y confirmar. | El diálogo queda abierto con «No se pudo eliminar: revisá tu conexión y probá de nuevo»; «Eliminar» sigue habilitado. |
| 2 | Con la red, volver a confirmar. | Se elimina y vuelve a Suscripciones. |

## CP-SUS-052 — Autorización
**Pre-requisitos:** PR-01 para A y B; PR-04 para sus tokens; una suscripción de A.

| # | Llamada | Resultado esperado |
|---|---|---|
| 1 | Con el token de B, `delete_subscription` sobre la suscripción de A. | HTTP 404, `PT404`, «Suscripción no encontrada». |
| 2 | Con un uuid inexistente. | Lo mismo (no se distingue de una ajena). |
| 3 | Sin token (`anon`). | HTTP 401, `42501`. |
| 4 | `PATCH /subscriptions` con la sesión del usuario. | Rechazado: no hay escritura directa (ADR-030). |
| 5 | Con B, abrir el Detalle de A. | «No encontramos esta suscripción». La de A sigue existiendo. |

## CP-SUS-053 y CP-SUS-054 — Gastos sueltos y puesta al día
**Pre-requisitos:** PR-01; una suscripción con gastos, uno de ellos dado de baja.

| # | Paso o llamada | Resultado esperado |
|---|---|---|
| 1 | API: eliminar la suscripción. | El gasto dado de baja queda con `subscription_id` nulo y `deleted_at` no nulo. |
| 2 | API: `restore_transaction` sobre ese gasto. | Se restaura como un movimiento común. |
| 3 | Correr la puesta al día de ese usuario. | `generated` es 0: no regenera nada (I11). |
