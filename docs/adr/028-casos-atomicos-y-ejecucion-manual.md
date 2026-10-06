# ADR-028 — Casos de prueba atómicos y ejecución manual

**Estado:** aceptada · **Fecha:** 2026-10

## Contexto

El profesor corrigió la Entrega 1: los casos de prueba estaban poco especificados. La auditoría
de los 74 casos mostró cinco problemas: casos que juntan varios datos o filas con un solo veredicto
(CP-CUO-006 prueba cinco cantidades de cuotas); la variante por API como un paso más del caso de UI,
sin request concreto; resultados esperados vagos ("Se guarda", "Rechazada"); "el usuario de prueba"
sin definir y casos que dependen de otros; y datos de prueba mezclados con los pre-requisitos.
Un caso, CP-ACC-004, dio FAILED solo por la validación del servidor y eso tapó que la UI sí cumplía.

Además, en V1 los casos los ejecutó Claude con un runner Playwright supervisado. La consigna de la
Entrega 2 pide ejecución **manual** de los casos de V2, de regresión y de confirmación.

## Decisión

1. **Estándar de caso** en `07-plan-de-testing.md` §4: atómico (un dato, un veredicto), UI y API
   en casos separados y enlazados, independiente (cada caso arranca con su propio usuario),
   datos exactos, un paso una acción, resultado esperado observable por paso, variante API
   ejecutable a mano, post-condición y trazabilidad al criterio de aceptación (`US-nn · CA-k`).
2. **Procedimientos comunes con ID** (`PR-nn`, `docs/12-procedimientos-de-prueba.md`), citados en los
   pre-requisitos en vez de copiados.
3. **Los 74 casos de V1 se reescriben con el estándar** y se re-ejecutan a mano. Los casos de V2 se
   escriben así desde el principio.
4. **La ejecución es manual**, por los testers con la regla de propiedad cruzada. El runner
   `entrega-1/ejecucion/run.mjs` queda como antecedente y como base de un posible esquema híbrido
   (personas para V2, runner para regresión), a decidir más adelante.

## Alternativas descartadas

- **Dejar los casos como están y agregar solo los nuevos con el estándar.** Los casos de V1 son la
  base de la regresión: ejecutarlos mal especificados repite el problema que marcó el profesor.
- **Solo parchear los casos señalados.** El problema es sistemático (los 74 tienen "usuario de
  prueba" sin definir y ninguno tiene post-condición): un parche parcial deja el catálogo inconsistente.

## Consecuencias

- Hay más casos que los 74 originales, porque los agrupados se parten. Cuando se parte, el primero
  conserva el ID y los demás toman los siguientes del módulo, con una tabla de mapeo.
- Cada caso gana campos (canal, caso par, post-condición, criterio de aceptación), y las 46 historias
  de V1 necesitan sus criterios numerados.
- La ejecución manual cuesta más tiempo que el runner. La mitigación es la regresión seleccionada
  (ADR-027) y empezar siempre por prioridad Alta.
- Toca la skill `/new-test-case` y el agente `spec-critic`, que verifican el estándar.
