# ADR-037 — Las deudas se escriben solo por RPC y siguen la baja lógica de su gasto

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-006, ADR-020, ADR-021, ADR-026, ADR-036

## Contexto

La migración inicial dejó `debts` como tabla de **escritura directa**: políticas RLS de
`insert/update/delete` con `user_id = auth.uid()` y el `GRANT` correspondiente. Con eso, las
historias de V2 (US-36 deuda suelta, US-39 saldar, US-40 revertir) se podrían resolver con
`insert`/`update` desde el cliente. Pero quedan cuatro huecos:

1. **`settled_at` lo pondría el cliente.** I9 solo exige que no sea nulo; el valor saldría del reloj
   del navegador, que C1 no deja usar para decidir nada, y podría venir en el futuro.
2. **Reglas sin dónde vivir.** "La fecha no puede ser posterior a hoy en Argentina" (FR-06, ADR-021)
   necesita `now()`, que no va en un `CHECK`. El largo de la persona tampoco está en el schema.
3. **Un `update` directo puede cambiar cualquier columna** de una deuda vinculada: `amount`,
   `direction`, `transaction_id`. El trigger de I7 frena el monto, pero no que una deuda vinculada
   pase a `i_owe` o se desvincule. Un `delete` directo la borra sin rastro.
4. **Qué pasa con la deuda cuando se borra su gasto.** `delete_transaction` hace baja lógica (C10) y
   `restore_transaction` la deshace. La deuda vinculada no tiene `deleted_at`, y ninguna regla dice
   si sigue apareciendo en Deudas ni si cuenta en los totales.

## Decisión

1. **Se revoca `INSERT`, `UPDATE` y `DELETE` sobre `debts` a `authenticated`** y se quitan esas tres
   políticas. Queda `SELECT` con `user_id = auth.uid()` (C7). Igual que `transactions` (ADR-020), la
   tabla pasa a escribirse solo por funciones `security definer` con `search_path = ''`, `user_id`
   desde `auth.uid()` y `EXECUTE` revocado a `public` y `anon`:
   - `create_transaction` crea la deuda vinculada (ADR-036);
   - `create_debt(p_direction, p_person, p_amount, p_currency, p_fx_rate, p_incurred_on, p_notes)`
     crea una deuda suelta (`transaction_id = null`, `status = 'pending'`) y devuelve su `uuid`;
   - `settle_debt(p_debt_id)` pasa `pending → settled` con `settled_at = now()`;
   - `reopen_debt(p_debt_id)` pasa `settled → pending` con `settled_at = null`.
   `delete_account` (ADR-026) sigue borrando las deudas vinculadas a la cuenta.
2. **Validación de `create_debt`** (C6), con `errcode = 'check_violation'`:
   - `p_direction` o `p_currency` nulos → `'Dirección y moneda son obligatorias'` (un valor fuera
     del enum lo rechaza PostgREST antes de entrar, con `22P02`);
   - persona recortada vacía → `'Ingresá el nombre de la persona'`; más de 60 caracteres →
     `'La persona admite hasta 60 caracteres'`. Persona y nota se recortan con la misma clase de
     caracteres que `String.prototype.trim` (espacio, tabulación, saltos de línea, NBSP);
   - monto `null`, `NaN` o `<= 0` → `'I4: el monto debe ser mayor a cero'`; más de 2 decimales →
     `'I4: el monto admite hasta 2 decimales'`; el tope en la moneda original lo da la columna
     `numeric(14,2)`, y el cliente lo frena antes (DEF-012);
   - I5 igual que en `create_transaction`: `'I5: fx_rate es obligatorio si y solo si la moneda es
     USD'` y `'I5: fx_rate debe ser mayor a cero'`; `fx_rate > 9999999999.9999` →
     `'El tipo de cambio es demasiado grande'`;
   - en USD, `round(monto * fx_rate, 2) > 999999999999.99` → `'En pesos daría más que el máximo de
     $999.999.999.999,99'`, y `= 0` → `'I4: en pesos daría menos de $0,01'` (DEF-012 y DEF-013:
     `amount_ars` es una columna generada `numeric(14,2)` con `CHECK (amount_ars > 0)`);
   - fecha nula → `'La fecha es obligatoria'`; posterior a hoy en Argentina →
     `'La fecha no puede ser posterior a hoy'`;
   - nota de más de 200 caracteres → `'La nota admite hasta 200 caracteres'`; una nota vacía o solo
     con espacios se guarda como `null`.
   Se agregan además dos `CHECK` de tabla como red de contención:
   `char_length(btrim(person)) between 1 and 60` y `notes is null or char_length(notes) <= 200`.
3. **Transiciones.** `settle_debt` sobre una deuda ya saldada rechaza con
   `'La deuda ya está saldada'`; `reopen_debt` sobre una pendiente, con `'La deuda ya está
   pendiente'`. Una deuda que no existe, es de otro usuario o está vinculada a una transacción con
   baja lógica rechaza con `'La deuda no existe'`, sin distinguir los tres casos (C7: no se infiere
   existencia). No hay otras transiciones: el estado es `pending` o `settled` (supuesto 5).
4. **La deuda vinculada sigue a su gasto.** Mientras su transacción tenga `deleted_at`, la deuda no
   aparece en la pantalla Deudas, no suma en sus totales ni en el neto de reembolsos del Resumen, y
   no se puede saldar ni reabrir. Es I10 extendida a lo que nace de una transacción. No se toca la
   fila de `debts`: al restaurar la transacción (`restore_transaction`), la deuda vuelve con el estado
   que tenía.
5. **Totales de la pantalla Deudas.** "Te deben" y "Debés" suman `amount_ars` (congelado, C5) de
   las deudas **pendientes** visibles, por dirección. El neto de la pantalla es "Te deben" menos
   "Debés". Las saldadas no suman: ya no falta cobrar ni pagar nada.
6. **El neto de reembolsos del Resumen** (US-30) es la consulta 6 de `04-data-model.md`, con el
   punto 4 aplicado: total gastado del período menos el `amount_ars` de las deudas `owed_to_me`
   (pendientes o saldadas) vinculadas a gastos sin baja lógica cuyo `first_period` es el período.
   La deuda se descuenta entera en el mes de la compra; con una compra en cuotas, ese mes el neto
   puede ser negativo y se muestra así, con signo. Las deudas sueltas y las `i_owe` no lo tocan
   (ADR-006).

## Alternativas descartadas

- **Mantener la escritura directa y agregar triggers** para `settled_at`, la fecha y las columnas
  inmutables. Funciona, pero reparte la regla entre políticas, triggers y cliente, y cada caso
  negativo (C6) tendría que probarse contra `PATCH` de PostgREST con combinaciones de columnas. Las
  RPC dejan un contrato chico: cuatro funciones con argumentos con nombre.
- **Una sola `set_debt_status(p_debt_id, p_status)`.** Menos funciones, pero la transición pedida
  queda implícita en un parámetro y "saldar algo ya saldado" pasa a ser un no-op silencioso o un
  error según el valor; con dos funciones cada transición inválida tiene su mensaje.
- **Marcar la deuda vinculada con su propio `deleted_at` al borrar el gasto.** Duplica el estado de
  baja en dos tablas que hay que mantener sincronizadas en `delete_transaction` y
  `restore_transaction`. Derivarlo del join con `transactions` no puede desincronizarse.
- **Dejar visible la deuda de un gasto borrado.** El gasto ya no cuenta en ningún KPI (I10); que su
  deuda siga sumando en "Te deben" contradice el mismo dashboard que dice que ese gasto no existe.

## Consecuencias

- `debts` pierde las políticas de escritura: el par pgTAP de C7 sigue (otra sesión → 0 filas,
  `anon` → `42501`) y se suma que `authenticated` recibe `42501` en `insert`, `update` y `delete`
  directos. Las cuatro RPC necesitan sus casos negativos por la UI y directo (C6).
- **Rompe pgTAP que hoy pasan** y hay que migrarlos en la misma PR: `rls_isolation.test.sql` (update
  y delete de `debts` esperan 0 filas; pasan a esperar `42501`), `db_defects.test.sql` (DEF-016) y
  `nan_amounts.test.sql` (insertan `debts` como `authenticated`; pasan a `create_debt` o a
  `create_transaction`, o a insertar como dueño de la tabla para probar el trigger de I7).
- Al implementar se actualizan: `docs/04-data-model.md` (`debts` sale de las tablas de escritura
  directa en la sección Row Level Security y suma los dos `CHECK` nuevos; I10 y la consulta 6
  aclaran que las deudas de gastos con baja lógica no cuentan) y C7 de
  `docs/03-architecture-spec.md`, que hoy dice que solo `transactions` y `ledger_entries` son de
  solo lectura para el cliente: ahora también `debts`.
- **No hay edición ni borrado de deudas en V2.** Una deuda suelta cargada mal solo se puede saldar.
  Ninguna historia de V2 lo pide; si en la ejecución aparece como problema, es una historia nueva.
- `settled_at` sale del reloj del servidor; la UI lo muestra, nunca lo manda.
- El borrado de una transacción con deuda vinculada cambia, además de los meses cerrados (US-65), lo
  que se ve en Deudas: el diálogo de borrado lo avisa (US-35).
- Agrega a ADR-020 tres funciones `security definer` que heredan sus reglas.
