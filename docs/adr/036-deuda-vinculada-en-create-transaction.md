# ADR-036 — La deuda de un gasto compartido se crea dentro de `create_transaction`

**Estado:** propuesta · **Fecha:** 2026-10 · Modificada por [ADR-040](040-gasto-compartido-con-varias-personas.md) (puntos 1, 2, 5 y 6: varias personas)
**Relacionada:** ADR-001, ADR-002, ADR-013, ADR-020, ADR-021, ADR-035, ADR-037

## Contexto

US-34 pide marcar un gasto como compartido al registrarlo, con la persona y cuánto le debe, y US-35
que esa deuda quede vinculada al gasto (`debts.transaction_id`). C4 exige que transacción,
imputaciones y "su deuda opcional" se escriban todas o ninguna, y el sad path "deuda mayor que el
gasto" (`02-behavior-spec.md`) pide que, si la deuda no vale, no se cree **ni la transacción ni la
deuda**. ADR-020 dejó escrito que V2 reemplaza la función para agregar la deuda, pero no cómo.

Hay que decidir la forma del contrato: qué parámetros recibe la RPC, qué de la deuda manda el
cliente y qué deriva el servidor, y cómo se valida I7 antes de escribir.

## Decisión

1. **`create_transaction` suma dos parámetros opcionales al final**, `p_shared_person text default
   null` y `p_shared_amount numeric default null`. Se reemplaza la firma anterior (`drop function` +
   `create function` en la misma migración) para que PostgREST no vea dos sobrecargas. Sigue
   devolviendo el `uuid` de la transacción. Un llamado sin esos parámetros se comporta exactamente
   igual que hoy.
2. **Los dos o ninguno.** Si llega uno solo, la función rechaza con
   `'Un gasto compartido necesita persona y monto'`.
3. **Solo un gasto se comparte.** Con `p_type = 'income'` y deuda, rechaza con
   `'Un ingreso no se puede compartir'`.
4. **El servidor deriva todo lo demás de la transacción**, sin aceptarlo del cliente:
   `direction = 'owed_to_me'`, `status = 'pending'`, `currency` y `fx_rate` iguales a los de la
   transacción (I7 exige la misma moneda; con el mismo `fx_rate` el `amount_ars` de la deuda sale
   congelado igual que el del gasto, C5), `incurred_on = occurred_on`, `transaction_id` = la
   transacción recién creada, `notes = null`. `user_id` sale de `auth.uid()` (ADR-020).
5. **Validación explícita antes de insertar nada** (C6), con estos mensajes, además del trigger
   `check_debt_rule` que queda como red de contención:
   - persona: se recorta en los extremos con la misma clase de caracteres que
     `String.prototype.trim` (espacio, tabulación, saltos de línea, NBSP), no con `btrim` a secas;
     vacía → `'Ingresá con quién compartiste el gasto'`; más de 60 caracteres →
     `'La persona admite hasta 60 caracteres'`;
   - monto: `null`, `NaN` o `<= 0` → `'I4: el monto de la deuda debe ser mayor a cero'`; más de 2
     decimales → `'I4: el monto de la deuda admite hasta 2 decimales'`; en USD,
     `round(p_shared_amount * p_fx_rate, 2) = 0` → `'I4: la deuda en pesos daría menos de $0,01'`
     (si no, la fila violaría `debts_amount_ars_positive` con un error crudo);
   - `p_shared_amount > p_amount` (misma moneda) → `'I7: la deuda no puede superar el monto del
     gasto'`. Igual al gasto se acepta (valor límite del plan de testing, §técnicas).
   Todas con `errcode = 'check_violation'`. Como la validación corre antes del primer `insert`, un
   rechazo no deja filas; si algo fallara después, la función entera se revierte (C4).
6. **Una deuda por gasto.** *(Reemplazado por ADR-040: hasta 10 personas, US-82.)* El formulario tiene una sola persona. Repartir un gasto entre varias
   personas queda fuera de V2 (ninguna historia lo pide); el trigger de I7 ya admite más de una
   deuda vinculada si algún día hace falta.

## Alternativas descartadas

- **Dos llamadas desde el cliente** (`create_transaction` y después un `insert` en `debts`). Rompe
  C4: si la segunda falla queda un gasto compartido sin deuda, y el sad path de la spec pide lo
  contrario.
- **Una RPC aparte, `create_shared_expense`**, que llame a `create_transaction` y después inserte la
  deuda. Duplica la superficie a probar (dos funciones con la misma validación) y obliga al cliente
  a elegir cuál llamar según un switch del formulario.
- **Un único parámetro `p_debt jsonb`.** Es más extensible, pero cada caso negativo directo contra
  la RPC (C6) tendría que armar JSON a mano y la validación de tipos pasaría a ser código propio en
  vez del de Postgres.
- **Que el cliente mande moneda, tipo de cambio y fecha de la deuda.** Abre la puerta a una deuda en
  otra moneda o con otro `fx_rate` que su gasto; son datos que solo pueden tener un valor válido.

## Consecuencias

- Cambia el contrato de la RPC: la migración aparece como diff en el PR y `database.types.ts` se
  regenera (C15). Los tests pgTAP de `create_transaction` siguen pasando sin tocarse, porque los
  parámetros nuevos son opcionales.
- pgTAP nuevo: atomicidad con deuda (transacción + N imputaciones + 1 deuda, o nada), límite de I7
  con monto igual y con un centavo más, gasto en USD (moneda y `fx_rate` heredados), ingreso
  compartido rechazado, un solo parámetro rechazado.
- La copia de cliente de estas reglas (`validateTransactionDraft` o una función hermana en
  `src/domain/`) aplica las mismas reglas; sus textos son los de US-34 y US-41
  (`entrega-2/historias/deudas.md`) y los del servidor son los de este ADR. El cliente sigue sin
  decidir nada que la base no revalide.
- La edición de transacciones (FR-07, V3) tendrá que decidir qué pasa con la deuda vinculada al
  cambiar monto, moneda, tipo o mes del gasto; hoy I7 rechazaría bajar el monto por debajo de la
  deuda o cambiar la moneda.
- Una compra en cuotas compartida genera una sola deuda por el monto que indica el usuario, no una
  por cuota. Cómo cuenta en el neto del Resumen está en `04-data-model.md` (consulta 6) y en ADR-037.
- **ADR-035 (`import_transactions`) depende de esta firma:** dice que si las deudas de V2 reemplazan
  `create_transaction`, `import_transactions` se actualiza en la misma migración y pasa la deuda
  vacía. Al implementarse este ADR, `import_transactions` todavía no existía (ADR-035 sigue en
  propuesta), así que no hubo nada que actualizar. La migración reemplaza la firma de 9 parámetros
  por la de 11 con `p_shared_person` y `p_shared_amount` en `default null`: una llamada sin deuda
  sigue siendo válida tal cual. Cuando se escriba `import_transactions`, llama a
  `create_transaction` con parámetros nombrados y sin pasar la deuda.
- Actualiza la consecuencia de ADR-020 ("V2 reemplaza la función para agregar la deuda").
