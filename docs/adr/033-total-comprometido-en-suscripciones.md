# ADR-033 — Qué suma el total mensual comprometido en suscripciones

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-013 · ADR-017 · `06-suscripciones.md` (US-63) · `02-behavior-spec.md` supuesto 9 · C2, C5

## Contexto

US-63 pide "el total mensual comprometido en suscripciones activas". Hay tres preguntas sin respuesta:
qué suscripciones entran (¿una que arranca el mes que viene?, ¿una pausada?), con qué tipo de cambio se
suman las de USD, y si el número aparece en el Resumen. `06-suscripciones.md` dice que "el dashboard no
sabe que las suscripciones existen", y el supuesto 9 de `02-behavior-spec.md` dice que un período
futuro no anticipa suscripciones.

## Decisión

- **Entran** las suscripciones con `status = 'active'`, `generate_from_period ≤ período corriente` y
  (`end_period` null o `end_period ≥ período corriente`). Usar `generate_from_period` y no `start_period`
  deja afuera una suscripción reanudada que este mes no se va a cobrar (R8).
- Entran las del mes **ya cobradas y las pendientes**: el número responde "cuánto me cuestan las
  suscripciones este mes", no "cuánto falta".
- **ARS** suma el `amount` actual. **USD** se convierte con el `fx_rates` del **período corriente**,
  redondeando half-up a 2 decimales por suscripción antes de sumar (ADR-013). Si el período corriente
  no tiene tipo de cambio, las de USD no entran al total en pesos y se muestran aparte: "+ USD 10,00
  sin tipo de cambio de octubre 2026" (la suma de todas las USD sin convertir).
- **El conteo** ("4 suscripciones activas este mes") incluye todas las que entran, también las USD que
  no se pudieron convertir.
- Es una **estimación** con el monto actual: no se compara con las transacciones generadas, que
  pueden tener otro monto (R7) o estar borradas.
- Vive **solo en la pantalla Suscripciones**. El Resumen no cambia.

## Alternativas descartadas

- **Mostrarlo en el Resumen.** Contradice que el dashboard no sabe que las suscripciones existen, y
  mezcla un número estimado con totales que salen de imputaciones.
- **Sumar las transacciones generadas del mes.** Es exacto, pero antes del día de cobro (R5) da menos
  de lo comprometido, que es justo lo que la historia quiere anticipar.
- **Convertir USD con el último tipo de cambio cargado, de cualquier mes.** Siempre da un número, pero
  puede usar un dólar de hace meses sin decirlo; el aviso aparte es más honesto.

## Consecuencias

- Es una función pura en `src/domain/subscriptions.ts` (`committedMonthlyTotal`), con `today` y el
  tipo de cambio por parámetro (C1) y montos en `Decimal` (C2). Se testea sin base.
- No toca KPIs ni imputaciones: no entra en la regresión del Resumen.
