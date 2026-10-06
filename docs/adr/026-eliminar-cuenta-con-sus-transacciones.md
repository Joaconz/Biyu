# ADR-026 — Eliminar una cuenta borra también sus transacciones

**Estado:** aceptada · **Fecha:** 2026-10

## Contexto

DEF-011 (#152): Ajustes permitía crear cuentas (medios de pago) pero no editarlas ni darlas de
baja, aunque FR-05 lo pide. El Product Owner pidió tres acciones distintas: **editar**, **archivar**
y **eliminar**, y que eliminar sea un borrado real, "sin que quede un rastro", a diferencia de
archivar y de la baja lógica de transacciones (C10).

Hay dos tensiones con lo que ya estaba escrito:

- **FR-05** (`pre-entrega.md`): "No se puede eliminar una categoría o medio de pago con
  transacciones asociadas; en ese caso se ofrece archivarlo en vez de borrarlo."
- **C10**: ningún borrado de transacciones es físico.

**Alternativas** que se le plantearon al PO:

1. Solo se pueden eliminar las cuentas sin transacciones; las que tienen movimientos se archivan.
   Respeta FR-05 y C10, pero una cuenta cargada por error con un par de gastos de prueba queda
   para siempre en la base.
2. Eliminar la cuenta borra también sus transacciones, avisando en la confirmación cuántas son.

## Decisión

**Opción 2**, elegida por el PO el 2026-10-05.

- Eliminar una cuenta borra físicamente, en una sola RPC atómica (`delete_account`, security
  definer, C4): la cuenta, **todas** sus transacciones (también las que ya tenían baja lógica),
  sus imputaciones (por el `on delete cascade` de `ledger_entries`), las deudas vinculadas a esas
  transacciones y las suscripciones que se cobran en esa cuenta, junto con sus transacciones.
- La confirmación es obligatoria y dice cuántos movimientos se van con la cuenta, que no se
  puede deshacer y que archivar es la alternativa que conserva el historial.
- Eliminar no está en la fila de la cuenta sino dentro de su edición: es la única acción de
  Ajustes que no se deshace, así que queda a un paso más que archivar.
- **Archivar** sigue siendo la baja que conserva historia (como US-44 para categorías).
- Las **categorías** no cambian: no se eliminan, solo se archivan. Por eso sirven de marca de "ya
  sembrado" para la siembra de US-43 (DEF-010): una cuenta borrada no deja rastro y no alcanza.

## Consecuencias

- **FR-05 queda modificado** para los medios de pago: con transacciones asociadas, se ofrece
  archivar, pero también se puede eliminar todo con confirmación explícita. Se registra en la
  ampliación de FR-05 de `02-behavior-spec.md`; `pre-entrega.md` no se reescribe, porque es un
  documento entregado.
- **C10 tiene una excepción**: el borrado de una transacción por sí sola sigue siendo lógico; el
  físico solo ocurre al eliminar su cuenta. Los totales de meses cerrados cambian, y la
  confirmación lo dice ("dejan de contar en todos los totales").
- `transactions(account_id)` y `debts(transaction_id)` pasan a tener índice (los usan el borrado y
  el trigger de I6 de DEF-009).
- Pruebas: `supabase/tests/database/delete_account.test.sql` (pgTAP) y `e2e/settings.spec.ts`.
