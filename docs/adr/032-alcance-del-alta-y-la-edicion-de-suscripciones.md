# ADR-032 — Qué se puede cargar y qué se puede editar de una suscripción

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-030 · `06-suscripciones.md` (R7, R8) · `04-data-model.md` (`subscriptions`, I12, I13) · C5

## Contexto

`06-suscripciones.md` solo dice qué pasa al cambiar el **monto** (R7). No dice si se puede cambiar la
moneda, el día de cobro, el mes de inicio, la cuenta o la categoría de una suscripción que ya generó
meses, qué pasa al extender una que ya terminó, ni cuánto hacia atrás o hacia adelante se puede dar de
alta una. El esquema tampoco limita el largo del nombre ni compara nombres sin distinguir mayúsculas, a
diferencia de `categories` y `accounts` (DEF-019).

## Decisión

**Alta: rangos.**

| Campo | Regla |
|---|---|
| Nombre | Obligatorio. Se guarda sin espacios al principio ni al final (`btrim`) y tiene que quedar de 1 a 60 caracteres, contados como puntos de código (`char_length` de Postgres; el cliente cuenta igual, no con `maxLength` del navegador). Único entre las suscripciones no canceladas del usuario **sin distinguir mayúsculas** (índice `(user_id, lower(name)) where status <> 'cancelled'`) |
| Mes de inicio | Desde 24 meses antes del período corriente hasta 12 meses después, inclusive |
| Mes de fin | Opcional; si está, mayor o igual al mes de inicio (I12) y como máximo diciembre de 2099 |
| Descripción | Opcional; se guarda con `btrim` y vacía pasa a `null`; hasta 200 caracteres contados igual que el nombre |

El límite de 24 meses hacia atrás coincide con el caso de borde de rendimiento de `06-suscripciones.md`
(dos años de atraso): un alta no puede generar más de 25 ocurrencias de golpe.

**Edición: qué cambia y desde cuándo.** Solo se edita una suscripción activa o pausada. Ningún cambio
toca las transacciones ya generadas (C5).

| Campo | ¿Editable? | Desde cuándo aplica |
|---|---|---|
| Nombre, descripción | Sí | Solo a la suscripción; las transacciones generadas no se renombran |
| Monto | Sí | Próxima ocurrencia (R7) |
| Día de cobro | Sí | Próxima ocurrencia (R4 la recalcula) |
| Categoría, cuenta | Sí. Un valor **nuevo** tiene que ser una categoría o cuenta activa; el valor **actual** se puede conservar aunque se haya archivado | Próxima ocurrencia |
| Mes de fin | Sí. Un valor **nuevo** tiene que ser mayor o igual a `max(start_period, período corriente)`, o vacío. El actual se conserva sin revalidar | Ver "Extender una terminada" |
| Moneda | **No** | — |
| Mes de inicio | **No** | — |

**Extender una terminada.** Una suscripción está **terminada** si `end_period` es anterior al período
corriente (sigue con `status = 'active'`: terminar no es un estado). Si la edición le pone un mes de fin
nuevo o la deja sin fin, `update_subscription` lleva `generate_from_period` a `max(generate_from_period,
período corriente)`, igual que al reanudar (R8): los meses entre el fin viejo y hoy no se cargan.

## Alternativas descartadas

- **Moneda editable.** Pasar de ARS a USD cambia qué tipo de cambio necesita cada ocurrencia y si puede
  quedar bloqueada (R6). Es otra suscripción: se cancela y se da de alta una nueva, que puede reutilizar
  el nombre.
- **Mes de inicio editable.** Adelantarlo dejaría `start_period` por encima de meses ya generados;
  atrasarlo obligaría a bajar `generate_from_period`, que R8 prohíbe.
- **Mes de fin anterior al período corriente.** Las ocurrencias ya generadas después de ese mes quedarían
  fuera del rango declarado sin que nada las borre. Para cortar en el pasado está cancelar.
- **Extender una terminada rellenando el hueco.** Generaría de golpe los meses entre el fin viejo y hoy
  con el monto nuevo: el mismo problema de R7 al revés.
- **Alta sin límite hacia atrás.** Una suscripción "desde 2015" generaría más de cien transacciones en un
  toque.

## Consecuencias

- Hace falta una migración: los `CHECK` de largo de nombre y descripción, y el índice único pasa de
  `(user_id, name)` a `(user_id, lower(name))`. La revisa `rls-migration-reviewer`.
- Las validaciones viven en `create_subscription` y `update_subscription` (ADR-030); Zod en el cliente
  repite los mismos mensajes (C6).
- `06-suscripciones.md`, "Casos de borde", suma: nombre de 60 y 61 caracteres, "Netflix" contra
  "netflix", mes de inicio en el borde de −24 y +12 meses, y extender una terminada.
