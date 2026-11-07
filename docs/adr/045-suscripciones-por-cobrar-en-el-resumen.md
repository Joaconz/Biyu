# ADR-045 — El Resumen muestra aparte lo que las suscripciones todavía van a cobrar

**Estado:** propuesta; dónde se muestra lo cambia [ADR-051](051-balance-desglosado-y-configurable-desde-el-resumen.md) §6 (línea del desglose del Balance) · **Fecha:** 2026-11
**Relacionada:** ADR-001, ADR-017, ADR-031, ADR-033, ADR-041 · Matiza `docs/06-suscripciones.md` («el dashboard no sabe que las suscripciones existen»)

## Contexto

Una suscripción genera una transacción por mes, y el mes corriente se genera recién el día de cobro
(R5, US-55). Hasta ese día el Resumen no cambia: se da de alta Netflix el 6 con cobro el 28 y ni el
gastado ni el balance lo reflejan. El producto pide que las suscripciones se vean en el Resumen y en
el balance. R5 existe para que el mes en curso no muestre plata que todavía no se fue, así que no se
puede resolver generando el cargo antes.

## Decisión

1. **El Resumen suma aparte lo pendiente.** Una tarjeta «Suscripciones por cobrar en <mes>» muestra el
   total en pesos y cuántos cobros faltan, y un «Balance proyectado» = balance del mes − pendiente.
   Gastado, Ingresos, Balance, el desglose y el neto de reembolsos no cambian.
2. **Es una proyección, no un dato.** No crea transacciones ni imputaciones (ADR-001, R5 se mantiene).
   Cuando llega el día de cobro la puesta al día genera la transacción y el cobro sale de la tarjeta
   y entra en Gastado, sin doble conteo.
3. **Qué cuenta como pendiente** (`pendingSubscriptionCharges`, función pura en `src/domain/`): las
   `active` cuyo rango (`generateFromPeriod`…`endPeriod`) incluye el período, sin transacción de ese
   período (borrada incluida, R2) y, en el mes corriente, con el día de cobro todavía por llegar.
   Los meses pasados no tienen pendientes; los futuros cuentan todas las activas que ya empezaron.
   Los vencidos sin generar (R6) no son «por cobrar»: los informa la puesta al día.
4. **Monto actual (R7)** y USD con el tipo de cambio del período, redondeado a 2 decimales antes de
   sumar (ADR-013). Sin tipo de cambio, las USD se informan aparte como en ADR-033.
5. **Dato secundario (ADR-031).** Si no se pueden leer las suscripciones, la tarjeta no se dibuja y el
   Resumen se muestra igual. Sin migración: lee `subscriptions`, `transactions` y `fx_rates` con las
   políticas de `select` existentes (C7).

## Consecuencias

- El Resumen de un mes sin movimientos pero con suscripciones por cobrar muestra la tarjeta además del
  estado vacío.
- Difiere de ADR-033 (comprometido en Suscripciones), que cuenta el mes entero, cobrado o no.
