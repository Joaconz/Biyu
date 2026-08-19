# ADR-001 — Las cuotas se modelan como imputaciones materializadas

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

Una compra en 12 cuotas tiene que aparecer como $10.000 durante doce meses, no como $120.000 en el mes de la compra. Eso obliga a distinguir dos conceptos que en la mayoría de los trackers están colapsados: el evento económico y su impacto mensual.

## Alternativas evaluadas

**A. Una sola tabla `transactions`, una fila por cuota.** La más simple de consultar. Pero la compra original deja de existir como entidad: editar el monto obliga a tocar doce filas, y no hay un lugar donde vivan los datos que son de la compra y no de la cuota (comercio, fecha real, deuda asociada).

**B. Una sola tabla, imputaciones calculadas al leer.** El dashboard genera las cuotas al vuelo con `generate_series`. Sin duplicación, sin riesgo de desincronización. Pero cada consulta del dashboard carga con la lógica de prorrateo, agrupar por categoría se vuelve pesado, y el redondeo hay que resolverlo en SQL — el lugar más incómodo para testearlo.

**C. Dos tablas: `transactions` (evento) + `ledger_entries` (imputaciones materializadas al escribir).** Elegida.

## Decisión

Opción C. Al crear una transacción se generan y persisten sus N imputaciones en la misma operación atómica. El dashboard lee exclusivamente `ledger_entries`.

## Consecuencias

**A favor:**
- El prorrateo y el redondeo viven en una función pura de TypeScript, testeable con tablas de casos, sin base de datos.
- Las consultas del dashboard son sumas y agrupaciones triviales sobre un índice `(user_id, period)`.
- Una compra de contado no es un caso especial: es N=1.
- Es el punto más interesante del modelo para explicar en una defensa.

**En contra:**
- Hay datos derivados que pueden desincronizarse. Se mitiga con atomicidad (C4), cascada al borrar, y un test de integridad que verifica la invariante I1.
- Editar una transacción en cuotas requiere regenerar sus imputaciones. Aceptable mientras no haya ajustes manuales por cuota.

**Simplificación asumida:** la primera imputación cae en el mes de `occurred_on`, no en el mes en que la tarjeta efectivamente cobra la cuota. Una compra del 28 de enero imputa a enero aunque el resumen la cobre en febrero. Modelar el ciclo de cierre real requiere día de cierre por cuenta y desplazamiento de períodos; queda para cuando exista uso real que lo justifique.
