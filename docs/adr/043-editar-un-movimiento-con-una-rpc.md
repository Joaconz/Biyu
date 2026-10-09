# ADR-043 — Editar un movimiento es una sola RPC que regenera las imputaciones

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-001, ADR-002, ADR-009, ADR-013, ADR-020, ADR-021, ADR-030, ADR-032, ADR-036, ADR-037, ADR-039, ADR-040 · Aplica ADR-009 en V2 y lo **modifica**: regenera siempre (§3) · Cierra FR-07

## Contexto

FR-07 pide editar un movimiento ya cargado y, si toca meses cerrados, advertir qué totales cambian antes
de confirmar. ADR-009 ya decidió *cómo* se recalculan las imputaciones (se borran y se regeneran
desde cero), pero lo dejó sin código y sin contrato. Hoy lo único que existe sobre una transacción
guardada es borrarla (C10) o restaurarla; un error de monto, de cuenta o de cuotas no tiene arreglo.
Ahora que V2 lo incluye (US-84), hace falta decidir el contrato, qué campos se pueden tocar y qué casos
se rechazan.

## Decisión

1. **Una RPC `update_transaction`**, `security definer`, `search_path` vacío, con `execute` solo para
   `authenticated`. Nunca un `update` directo sobre `transactions` ni `delete`/`insert` sueltos sobre
   `ledger_entries` (C4). Parámetros: `p_transaction_id`, `p_amount`, `p_category_id`, `p_account_id`,
   `p_installments_count`, `p_occurred_on`, `p_description`. Devuelve el id. Es un reemplazo completo: todos
   son obligatorios salvo `p_description` (nulo o vacío = sin descripción).
2. **Campos que se pueden cambiar:** monto, fecha, categoría, cuenta, cuotas y descripción.
   **No se pueden cambiar:** el tipo (gasto o ingreso), la moneda y el tipo de cambio. El tipo de cambio
   queda congelado desde el alta (C5, ADR-002): editar el monto de un gasto en USD recalcula
   `amount_ars` con el mismo `fx_rate`. Si la moneda o el tipo de cambio estaban mal, se elimina y se
   vuelve a cargar. La RPC no recibe esos parámetros, así que no hay forma de mandarlos.
3. **Se regeneran las imputaciones** como dice ADR-009: se borran todas las `ledger_entries` de la
   transacción y se crean de nuevo, en la misma transacción de base que actualiza `transactions`, con la
   regla de siempre (cuota base truncada a 2 decimales, la última absorbe el resto, C3). **Modifica
   ADR-009 en un punto:** allá un cambio de `description`, `category_id` o `account_id` no tocaba
   `ledger_entries`; acá se regeneran siempre, aunque el cambio sea solo de categoría. La razón es que la
   categoría vive en la transacción y no en la imputación, pero el aviso de meses cerrados (FR-07) y
   los totales por categoría dependen de qué meses tienen imputación, y una sola ruta es más fácil de
   probar que dos. `first_period` pasa a ser el mes de la nueva `occurred_on`. La regla de reparto no se
   copia: se extrae a una función interna que usan `insert_transaction_with_entries` (alta y puesta al
   día) y `update_transaction`, así hay un solo lugar donde vive C3 en SQL.
4. **Validación en la RPC** (C6), con las mismas reglas y los mismos mensajes que `create_transaction`
   para monto, fecha (no posterior a hoy en Argentina, ADR-021), categoría, cuenta y cuotas. I6 sigue valiendo:
   pasar la cuenta a una que no es tarjeta de crédito con más de 1 cuota se rechaza.
   La categoría y la cuenta tienen que estar activas, **salvo que no cambien**: un movimiento con una
   categoría o cuenta archivada se puede editar sin tocarla (igual que US-59 CA-10).
5. **Qué movimientos no se pueden editar**, con `errcode = 'check_violation'` y un mensaje fijo, y en
   este orden de validación (sesión, existencia y dueño, eliminado, suscripción, deuda vinculada y, por
   último, los campos), de modo que un movimiento con dos bloqueos devuelve el primero:
   - eliminado (`deleted_at` no nulo): "Un movimiento eliminado no se puede editar"; se restaura primero;
   - generado por una suscripción (`subscription_id` no nulo): "Un movimiento de una suscripción no se
     puede editar". Las ocurrencias ya generadas no cambian cuando se edita la suscripción (R7, ADR-032, C5)
     y la puesta al día no las vuelve a generar (I11, ADR-030): editarlas a mano rompería esa garantía;
   - con una deuda vinculada (ADR-036, ADR-040): "Un movimiento compartido no se puede editar". I7 mide el
     tope contra `amount_ars` y exige la misma moneda, y ninguna pantalla de V2 reparte una deuda después
     de crear el gasto. Se elimina y se vuelve a cargar.
   Una transacción de otro usuario o que no existe responde `foreign_key_violation` "la transacción no
   existe o no te pertenece", como `delete_transaction`, y no se distinguen (C7); sin sesión, `42501`.
6. **Concurrencia:** la RPC toma la fila con `for update`. Dos ediciones simultáneas se serializan y
   gana la última; no hay control optimista de versión (no hay `updated_at`). Es aceptable: una persona,
   una cuenta, y la edición no es una operación sobre datos compartidos.
7. **El aviso de meses cerrados (FR-07) es una función pura del dominio**, calculada en el cliente con
   `today` como parámetro (C1), igual que el aviso de borrado. Compara, por cada mes cerrado, el monto en
   pesos, la categoría y la cuenta de la imputación: los tres totales que muestra el Resumen. La RPC no lo exige: el aviso es UX
   (C6); cualquier cliente que llame a la RPC edita sin él.
8. **La compra en cuotas empezada (ADR-039) no se podrá editar** (`installments_paid` distinto de 0): sus
   cuotas guardadas son solo las que faltan y regenerarlas desde cero las cambiaría. Quien llegue segundo
   (US-80 o US-84) agrega la guarda: un cuarto bloqueo, `check_violation` "Una compra empezada no se puede
   editar", después del de deuda vinculada, con su estado `edit-transaction-blocked-started` y su criterio
   en US-84. Mientras `installments_paid` no exista, la restricción no tiene efecto.

## Alternativas descartadas

**Un `update` directo con un trigger que regenere las imputaciones.** Esconde la regeneración en un
efecto lateral y deja a la validación repartida entre el trigger y la política de RLS. C4 pide que cada
escritura sobre `transactions` sea una RPC con un único camino.

**Dejar editar la moneda y el tipo de cambio.** Reescribe el pasado (C5) y obliga a decidir qué hacer
con el tipo de cambio de referencia del mes (ADR-002). Si el tipo de cambio estaba mal, el costo de
borrar y volver a cargar es bajo.

**Diff incremental de imputaciones.** Ya descartado en ADR-009: más código y más casos límite para un
beneficio que hoy no existe.

**Editar también las deudas vinculadas y las ocurrencias de una suscripción.** Cada una agrega reglas
(topes, `generate_from_period`, ADR-030) que merecen su propia historia. Se rechazan con un mensaje claro.

## Consecuencias

- Una sola función concentra toda la lógica de edición y se prueba por la UI y directo contra la RPC (C6).
- Mantiene I1, I1', I2 y I3 por construcción; I6 y I10 no cambian. I7 no hace falta revalidarlo porque
  no hay deuda en lo que se edita.
- Editar el monto de un gasto en USD cambia `amount_ars` pero no `fx_rate`: es lo que se espera de C5.
- Los totales de meses ya mirados pueden cambiar. Por eso el aviso previo de FR-07 es parte de la
  historia, no un extra.
- Queda un agujero a propósito: no hay forma de arreglar la moneda, el tipo de cambio ni una deuda
  vinculada sin borrar y cargar de nuevo. Se documenta en US-84 · Fuera de alcance.

## Docs a actualizar

Hechos junto con este ADR: `03-architecture-spec.md` (C4, C7 y Technical Decision 3), `04-data-model.md`
(`ledger_entries.amount_ars`), ADR-009 (estado y notas) y ADR-039 (guarda de la compra empezada).
Pendiente al implementar: la vista de integridad y los tipos de cliente (`npm run gen:types`).
