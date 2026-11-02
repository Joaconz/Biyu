# Casos de prueba V3 — Eliminar definitivamente una suscripción (US-88)

**Historia:** [#330](https://github.com/Joaconz/Biyu/issues/330) · ADR-044 §4 · docs/06-suscripciones.md (R2, R3, I11) · C4, C5, C6, C7.
**Oráculo:** la suscripción se borra en cualquier estado; los gastos que generó quedan como movimientos sueltos (`subscription_id` y `subscription_period` en nulo, también los dados de baja), con el resto de sus columnas e imputaciones intactas; la puesta al día ya no genera nada de ella; una ajena o inexistente responde 404 «Suscripción no encontrada».
**Convenciones:** PR-01 crea el usuario, PR-02 el token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/delete_subscription` con `{"p_subscription_id": "<uuid>"}`.

| ID | Título | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|
| CP-SUS-049 | Eliminar una activa con gastos generados: confirmación, listado y movimientos sueltos | Casos de uso | Positivo | UI | Alta | Sí |
| CP-SUS-050 | «Volver» en la confirmación no borra | Casos de uso | Negativo | UI | Media | Sí |
| CP-SUS-051 | Una cancelada solo ofrece «Eliminar definitivamente» | Transición de estados | Positivo | UI | Media | Sí |
| CP-SUS-052 | Una pausada se borra; el diálogo avisa que deja de generar | Transición de estados | Positivo | UI | Media | Sí |
| CP-SUS-053 | Tras borrar, la puesta al día no genera nada de esa suscripción ni toca los movimientos sueltos | Adivinación de errores | Positivo | API | Alta | Sí |
| CP-SUS-054 | La baja lógica de uno de los gastos sigue después de borrar la suscripción | Adivinación de errores | Positivo | API | Media | Sí |
| CP-SUS-055 | La suscripción de otro usuario responde 404 y no se borra; `anon` recibe 401 `42501` | Adivinación de errores | Negativo | API | Alta | Sí |

## CP-SUS-049 — Eliminar una activa
**Historia y criterio:** US-88 · CA-1, CA-2. **Caso par:** CP-SUS-055. **Pre-requisitos:** PR-01 con `eliminar-049@biyu.test`, configuración inicial salteada. **Datos:** «Netflix», $5.000,00, día 1, inicio el mes corriente, categoría «Entretenimiento», cuenta «Efectivo» (genera 1 gasto).

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear la suscripción (PR por API o «Nueva suscripción») y abrir su detalle. | Estado «Activa»; «Gastos cargados» muestra 1 gasto. |
| 2 | Tocar «Eliminar definitivamente» (`subscription-detail-delete`). | Diálogo «¿Eliminar Netflix?» con Suscripción: Netflix, Monto: $5.000,00, Estado: Activa, Gastos generados: 1; dice «Deja de generar gastos.» y «El gasto que generó queda como un movimiento suelto…». |
| 3 | Tocar «Eliminar definitivamente» en el diálogo. | Aviso «Suscripción «Netflix» eliminada»; se abre `/subscriptions` sin «Netflix» y el total comprometido no la cuenta. |
| 4 | Abrir Movimientos del mes. | El gasto de $5.000,00 sigue, sin enlace a una suscripción. |

## CP-SUS-050 / 051 / 052 — Volver, cancelada y pausada
| ID | Pasos | Resultado esperado |
|---|---|---|
| 050 | Paso 2 de CP-SUS-049 y tocar «Volver». | El diálogo se cierra; la suscripción sigue en el listado. |
| 051 | Cancelar «Netflix» y abrir su detalle. | No hay «Editar» ni «Cancelar suscripción»; sí «Eliminar definitivamente»; el diálogo no dice «Deja de generar gastos.». Confirmar la borra. |
| 052 | Pausar «Netflix» y eliminarla. | El diálogo dice «Deja de generar gastos.»; confirmar la borra. |

## CP-SUS-053 / 054 — Contra la API
**Datos:** suscripción con 3 gastos (inicio hace 2 meses), uno dado de baja con `delete_transaction`. `delete_subscription` devuelve `{"detached": 3}`. Con el mismo token: `GET /subscriptions?id=eq.<id>` → `[]`; `GET /transactions?select=subscription_id,subscription_period,amount,deleted_at` → los 3 con ambos campos nulos y los mismos montos; el dado de baja mantiene `deleted_at`. `catch_up_subscriptions` (o abrir Suscripciones tras el mes siguiente) no crea ninguno de la borrada.

## CP-SUS-055 — Autorización
Con el token de A, `delete_subscription` sobre la de B: HTTP 404, `PT404`, «Suscripción no encontrada» (igual que un uuid inexistente); con el token de B la suscripción sigue. Sin token: 401, `42501`.

## Ejecución (2026-11-02, local)
pgTAP `delete_subscription.test.sql`: 18 de 18 (053 a 055). Playwright `e2e/subscriptions-delete.spec.ts`: 3 de 3 (049, 050, 051, 055). Vitest: textos del diálogo (`tests/domain/subscriptionOperations.test.ts`). CP-SUS-052 queda manual (misma pantalla que 051).
