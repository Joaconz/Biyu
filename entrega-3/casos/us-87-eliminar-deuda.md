# Casos de prueba V3 — Eliminar una deuda (US-87)

**Historia:** [#329](https://github.com/Joaconz/Biyu/issues/329) · ADR-044 §3 · ADR-037 (sin DELETE directo), ADR-041 · C4, C6, C7.
**Oráculo:** una deuda pendiente se borra por RPC `delete_debt`; la saldada no (primero vuelve a pendiente); la deuda de un gasto compartido se borra sola y el gasto queda como gasto normal; una ajena o inexistente responde «no encontrada».
**Convenciones:** PR-01 crea el usuario, PR-02 el token (`docs/12-procedimientos-de-prueba.md`). Montos ficticios (C14). Canal API: `POST <SUPABASE_URL>/rest/v1/rpc/delete_debt` con `{"p_debt_id": "<uuid>"}`.

| ID | Título | Técnica | Tipo | Canal | Prioridad | Automatizable |
|---|---|---|---|---|---|---|
| CP-DEU-062 | Eliminar una deuda suelta «Me deben» de $20.000,00: confirmación, listado y totales | Casos de uso | Positivo | UI | Alta | Sí |
| CP-DEU-063 | Cancelar la confirmación no borra | Casos de uso | Negativo | UI | Media | Sí |
| CP-DEU-064 | Una deuda saldada no ofrece «Eliminar» hasta volver a pendiente | Transición de estados | Negativo | UI | Alta | Sí |
| CP-DEU-065 | La RPC rechaza una deuda saldada (`23514`, HTTP 400) | Transición de estados | Negativo | API | Alta | Sí |
| CP-DEU-066 | Borrar la deuda de un gasto compartido deja el gasto como gasto normal | Casos de uso | Positivo | API | Alta | Sí |
| CP-DEU-067 | La deuda de otro usuario responde 404 y no se borra; `anon` recibe `42501` | Adivinación de errores | Negativo | API | Alta | Sí |
| CP-DEU-068 | Si la baja falla por la red el diálogo sigue abierto y permite reintentar | Adivinación de errores | Negativo | UI | Media | Sí |

## CP-DEU-062 — Eliminar una suelta
**Historia y criterio:** US-87 · CA-1, CA-4 · ADR-041. **Caso par:** CP-DEU-065. **Pre-requisitos:** PR-01 con `eliminar-062@biyu.test`, configuración inicial salteada. **Datos:** deuda «Me deben» a «Lucas», $20.000,00, fecha de hoy.

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Crear la deuda con «Nueva deuda». | En Deudas, «Me deben» muestra $20.000,00. |
| 2 | Tocar el ícono «Eliminar deuda de Lucas» (`debts-item-delete`). | Diálogo «¿Eliminar deuda?» con Persona: Lucas, Dirección: Te debe, Monto: $20.000,00, Origen: Deuda suelta. Dice ««Me deben» pasa de $20.000,00 a $0,00.» y «El balance de <mes año> sube $20.000,00.». |
| 3 | Tocar «Eliminar». | Aviso «Deuda con Lucas eliminada»; la fila desaparece y «Me deben» muestra $0,00. |
| 4 | Abrir el Resumen del mes. | El balance vuelve al valor anterior a cargar la deuda. |

## CP-DEU-063 — Cancelar
En el paso 2 de CP-DEU-062 tocar «Cancelar»: el diálogo se cierra, la fila sigue y «Me deben» sigue en $20.000,00.

## CP-DEU-064 / 065 — Saldada
**Datos:** deuda «Marta» $700,00 saldada.

| ID | Pasos | Resultado esperado |
|---|---|---|
| 064 (UI) | Marcar saldada, filtro «Todas». | La fila no tiene el ícono de eliminar; con «Volver a pendiente» aparece. |
| 065 (API) | `delete_debt` sobre la saldada | HTTP 400, `23514`, «Una deuda saldada no se elimina: volvela a pendiente primero»; `GET /debts?id=eq.<id>` devuelve 1 fila. |

## CP-DEU-066 — Deuda de un gasto compartido
**Datos:** gasto de $1.000,00 con deuda a «Sofía» de $400,00 (`create_transaction` con `p_shared_person`). Con `delete_debt` sobre esa deuda: HTTP 204; la deuda ya no existe; `GET /transactions?id=eq.<tx>` devuelve el gasto sin `deleted_at` y `GET /ledger_entries?transaction_id=eq.<tx>` mantiene su imputación de $1.000,00.

## CP-DEU-067 — Autorización
Con el token de A, `delete_debt` sobre una deuda de B: HTTP 404, `PT404`, «Deuda no encontrada» (igual que un uuid inexistente); con el token de B la deuda sigue. Sin token: 401, `42501`.

## CP-DEU-068 — Red caída
Con la deuda de CP-DEU-062, bloquear las llamadas a `delete_debt` (DevTools → Network → Offline) y tocar «Eliminar»: el diálogo sigue abierto con «No se pudo eliminar la deuda…» y la fila no se borró. Volver a «No throttling» y tocar «Eliminar»: se borra.

## Ejecución (2026-11-02, local)
pgTAP `delete_debt.test.sql`: 14 de 14 (065 a 067). Playwright `e2e/debts-delete.spec.ts`: 3 de 3 (062 a 064, 068). Vitest: efecto sobre totales y balance (`tests/domain/debts.test.ts`).
