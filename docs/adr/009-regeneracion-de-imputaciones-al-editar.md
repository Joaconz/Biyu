# ADR-009 — Editar una transacción regenera sus imputaciones desde cero

**Estado:** aceptada · **Fecha:** 2026-08 · **No implementada en v1** (ver Alcance, abajo)

## Contexto

Ninguna user story de `docs/02-behavior-spec.md` ni ningún slice de `docs/roadmap.md`
incluye editar una transacción existente. Lo único que existe es borrado (soft delete,
C10). Este ADR decide la estrategia de todos modos, porque `03-architecture-spec.md` la
dejaba como pregunta abierta y una vez que exista uso real la falta de edición va a ser el
primer pedido — mejor tener la decisión escrita antes de que la presión de implementarla
rápido lleve a una mala.

## Decisión

Cuando una transacción cambie en `amount`, `installments_count`, `first_period`,
`currency` o `fx_rate` — los cinco campos de los que depende `generateLedgerEntries` —
todas sus `ledger_entries` existentes se borran y se regeneran desde cero, en la misma
transacción de base que actualiza `transactions`. Ninguna imputación se actualiza in-place.

Un cambio en un campo que no participa del prorrateo (`description`, `category_id`,
`account_id`) no toca `ledger_entries`.

## Alternativas descartadas

**Diff incremental** — calcular qué imputaciones cambian y tocar solo esas (agregar,
quitar, ajustar montos). Es más código y más casos límite (¿qué pasa si `installments_count`
baja de 12 a 6 y ya se registraron imputaciones de meses 7 a 12? ¿se borran, se marcan?)
para un beneficio que hoy no existe: no hay ajustes manuales por cuota que un diff
tendría que preservar.

**Editar sin regenerar, dejando la inconsistencia** — no es una alternativa real, viola I1
e I1'.

## Consecuencias

- Correcta y simple mientras la única fuente de verdad de una imputación sea
  `generateLedgerEntries` aplicada a la transacción completa.
- **Se rompe el día que exista un ajuste manual sobre una imputación individual** — por
  ejemplo, corregir a mano el monto de una sola cuota sin tocar las demás. Regenerar
  pisaría ese ajuste sin aviso. Ese día hace falta una marca por imputación (por ejemplo
  `manually_adjusted boolean`) que el regenerador respete, y una decisión explícita sobre
  qué pasa si el ajuste manual ya no tiene sentido después del cambio (por ejemplo, si el
  monto total bajó por debajo de lo que la cuota ajustada ya sumaba). Ese caso necesita su
  propio ADR cuando llegue.
- Como la edición no está en el roadmap de v1, esta decisión no tiene código asociado
  todavía. Sirve para que, cuando se agregue la user story, no haya que volver a
  investigar el trade-off.

## Alcance

Esta decisión no se implementa como parte del Slice 0 ni de ningún slice de v1 declarado en
`docs/roadmap.md`. Si se agrega edición de transacciones a v1, hay que actualizar primero
`docs/02-behavior-spec.md` con la user story correspondiente (regla de `CLAUDE.md`:
el spec se actualiza antes que el código).
