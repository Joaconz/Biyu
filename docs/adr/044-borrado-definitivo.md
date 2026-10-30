# ADR-044 — Borrado definitivo en V3: dos pasos para los movimientos, directo para el resto

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-009, ADR-026, ADR-030, ADR-036, ADR-037, ADR-041, ADR-043 · **Modifica C10** · Cierra [#327](https://github.com/Joaconz/Biyu/issues/327)

## Contexto

V3 completa el CRUD de las cinco entidades ([#324](https://github.com/Joaconz/Biyu/issues/324)) y el
equipo pidió que la «D» sea un borrado **definitivo**. Hoy C10 dice que ninguna transacción se borra
físicamente: la baja pone `deleted_at`, la transacción queda en «Eliminados» y se puede restaurar
(DEF-007). La única excepción es eliminar una cuenta, que borra sus transacciones (ADR-026, DEF-011).
Deudas y suscripciones no se pueden borrar, y categorías y cuentas solo se archivan.

Hay tres trampas que obligan a decidir antes de implementar:

- `transactions_subscription_period_uq` (I11) hace idempotente la puesta al día **sin filtrar por
  `deleted_at`**: una ocurrencia dada de baja sigue ocupando su período. Si se borra de verdad, la
  próxima puesta al día la vuelve a crear.
- `debts_transaction_fk`, `transactions_category_fk` y `subscriptions_category_fk` no tienen cascada:
  sin una regla, Postgres rechaza el borrado con un error que el usuario ve como un 500.
- Borrar algo con cuotas o deudas puede cambiar totales de meses cerrados (FR-07).

## Decisión

Decidido por el equipo el 2026-10-30.

1. **Movimientos, en dos pasos.** «Eliminar» sigue siendo la baja lógica de C10 (va a Eliminados y se
   puede restaurar). En la vista Eliminados aparece «Eliminar definitivamente», que borra la
   transacción, sus imputaciones (ya en cascada) y su deuda vinculada. Solo acepta transacciones con
   `deleted_at`. Se borra de a una: no hay «Vaciar Eliminados». (US-85)
2. **Un movimiento generado por una suscripción no se borra definitivamente.** Se puede dar de baja y
   restaurar como hoy, pero no ofrece «Eliminar definitivamente» y la RPC lo rechaza. Así I11 sigue
   valiendo sin guardar marcas aparte. (US-85)
3. **Deudas, directo.** «Eliminar» borra la deuda con confirmación, sin vista de eliminadas.
   - Borrar la deuda de un gasto compartido deja el gasto como gasto normal.
   - Borrar definitivamente un gasto borra su deuda vinculada (punto 1).
   - Una deuda saldada no se edita ni se borra: primero se vuelve a pendiente (US-40). (US-87, US-86)
4. **Suscripciones, directo, en cualquier estado.** Borrar una suscripción, activa o no, deja de
   generar gastos y **conserva los que ya generó** como movimientos sueltos (`subscription_id` y
   `subscription_period` en nulo). Los totales de meses cerrados no cambian. La RPC toma el mismo
   bloqueo que la puesta al día para no correr en paralelo con ella. (US-88)
5. **Categorías, solo sin uso.** Se puede borrar una categoría (activa o archivada, sembrada o no) que
   no tenga movimientos, incluidos los dados de baja, ni suscripciones. Si tiene uso, la RPC lo rechaza
   con un mensaje que dice cuántos tiene y sugiere archivarla. No se reasigna nada. (US-89)
6. **Cuentas, sin cambios:** siguen con el borrado de ADR-026. V3 suma reactivar una archivada (US-90).
7. **Siempre por RPC** (`purge_transaction`, `delete_debt`, `delete_subscription`, `delete_category`
   o los nombres que fije cada historia), `security definer`, `search_path` vacío, `execute` solo para
   `authenticated`, con el chequeo de `user_id = auth.uid()` adentro (C4, C7). Un id de otro usuario
   responde «no encontrado», nunca un 500.
8. **Siempre con confirmación** que dice qué se borra (US-94): el monto, la persona o el nombre, y lo
   que arrastra (cuotas, deuda vinculada, gastos que quedan sueltos).

## Alternativas descartadas

- **Borrado definitivo directo en los movimientos, sin pasar por Eliminados.** Un toque equivocado
  borraría meses cerrados sin vuelta atrás, que es justo lo que C10 quería evitar.
- **Borrar definitivamente las ocurrencias de suscripción guardando una marca del período.** Hace
  falta una tabla o una columna nueva solo para eso, y la puesta al día y sus tests (I11, I16) tendrían
  que leerla.
- **Borrar los gastos generados junto con la suscripción.** Cambia totales de meses cerrados por
  borrar algo que el usuario ve como una configuración.
- **Reasignar los movimientos de una categoría a otra antes de borrarla.** Cambia el gráfico por
  categoría de meses cerrados y suma una pantalla nueva; archivar ya resuelve «no la quiero ver más».

## Consecuencias

- **C10 cambia:** la baja de una transacción sigue siendo lógica, pero ya no es la única: desde
  Eliminados se puede borrar físicamente. `docs/03-architecture-spec.md` se actualiza.
- **I10 e I11 siguen valiendo:** un borrado definitivo no deja nada que filtrar, y las ocurrencias de
  suscripción nunca se borran físicamente salvo al borrar su cuenta (ADR-026).
- La suscripción borrada deja movimientos con `subscription_id` nulo: el detalle de la suscripción ya
  no existe y Movimientos los muestra como gastos comunes.
- Cada RPC nueva lleva su par de tests pgTAP (otra sesión, `anon`) y casos de prueba por la UI y por la
  API (C6, C7).
- Exportar CSV (US-47) deja de incluir lo borrado definitivamente; las bajas lógicas siguen como hoy.
