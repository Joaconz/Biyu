# ADR-020 — `create_transaction` como `security definer`, con validación duplicada y grants mínimos

**Estado:** aceptada · **Fecha:** 2026-09
**Relacionada:** ADR-004, 013, 014, 015, 019

## Contexto

C4 pide que crear una transacción sea atómico y C6 que la validación real viva en Postgres. Sin una capa de
aplicación, la única forma de escribir transacción + imputaciones en una sola operación es una función
expuesta como RPC. La migración inicial dejó `transactions` y `ledger_entries` sin políticas de escritura
para que nada las toque por fuera de esa función (C3, C10).

## Decisión

1. **`create_transaction` es `security definer` con `search_path = ''`.** Es la única vía de escritura de
   `transactions` y `ledger_entries`; el cliente no tiene privilegios `INSERT/UPDATE/DELETE` sobre ellas.
   Como `security definer` se salta RLS, la función toma el usuario de `auth.uid()`, rechaza sesiones nulas
   y filtra a mano cuenta y categoría por `user_id = auth.uid()` y `archived_at is null`. Nunca acepta un
   `user_id` del cliente. `EXECUTE` se revoca a `public` y `anon`.
2. **Validación duplicada a propósito.** La función revalida I4, I5, I6 e I8 con mensajes explícitos (I7, deudas, no aplica hasta V2 y lo cubre el trigger) aunque los CHECK y
   el trigger I6 también existan: el mensaje sale antes y sirve para C6 (cada caso negativo se prueba por
   la UI y directo contra la RPC). Lo que no se puede expresar como CHECK de tabla (I1, I1') se garantiza
   generando las imputaciones dentro de la misma función.
3. **`first_period` lo calcula el servidor** (`date_trunc('month', occurred_on)`), no lo manda el cliente:
   hoy es derivable y aceptarlo permitiría desalinear imputaciones y fecha.
4. **Tope de 12 cuotas** como `CHECK (installments_count <= 12)` en la tabla y como validación en la
   función. Es una regla de producto (`roadmap.md` §V1, FR-09) que no estaba en el schema (solo `>= 1`).
5. **Regla de redondeo en SQL** igual que en `domain/installments.ts` (ADR-013): cuotas `1..N-1` truncadas a
   2 decimales, la última absorbe el resto, en `amount` y en `amount_ars` por separado. `amount_ars` sale de
   la columna generada de la fila, así I1' cuadra contra ella.
6. **Grants mínimos** (`20260925000100_table_grants.sql`). La migración inicial definía políticas RLS pero
   ningún `GRANT`: `authenticated` no podía leer y, además, `anon`/`authenticated` tenían `TRUNCATE`, que se
   salta RLS. Se revoca todo y se otorga solo `SELECT` (más `INSERT/UPDATE/DELETE` donde no hay RPC).
7. **Los triggers de I6/I7 se redefinen con nombres calificados.** `search_path = ''` de la función se hereda
   durante la llamada y los triggers originales usaban `accounts` sin esquema.

## Consecuencias

- La lógica de prorrateo existe dos veces (TypeScript para previsualizar, SQL para escribir; C1). Se cubre con
  pgTAP y con la vista `ledger_integrity_violations`.
- Toda función `security definer` futura hereda estas reglas: `search_path` vacío, `user_id` desde
  `auth.uid()`, `EXECUTE` cerrado a `anon`.
- El rechazo de `SECURITY DEFINER` de ADR-014 era sobre un trigger en `auth.users`; acá es una RPC acotada y explícita.
- V2 reemplaza la función para agregar la deuda (gasto compartido) en la misma operación.
- Un rechazo por cuota menor a 0,01 (`I4`) es explícito en vez de un error crudo del CHECK de `ledger_entries`.
