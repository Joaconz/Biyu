# ADR-027 — Regresión de V2 por selección de riesgo

**Estado:** aceptada · **Fecha:** 2026-10

## Contexto

`roadmap.md` §V2 dice que el catálogo de V1 "volvió a ejecutarse completo como suite de
regresión". La consigna de la Entrega 2 pide otra cosa: **seleccionar** los casos de V1 que se
ejecutan sobre V2 "para asegurar que las funcionalidades y el comportamiento ya existente sigan
funcionando". Elegir qué se re-ejecuta, y por qué, es parte de lo que se evalúa. Además, tras
reescribir el catálogo de V1 (ADR-028) hay más casos que los 74 originales, y todo se ejecuta a
mano.

## Decisión

La regresión de V2 es un **subconjunto elegido por riesgo**, con el criterio escrito y cada caso
marcado como incluido o excluido con su motivo. Entran:

1. Todos los casos de prioridad **Alta** de V1.
2. Todos los casos de los módulos que V2 toca: Dashboard (`DAS`: KPI de neto de reembolsos, torta,
   detalle de categoría), Registro (`REG`: gasto compartido, feedback de guardado, confirmación
   de borrado), Cuotas (`CUO`: confirmación destructiva), Cuentas de Configuración (`CFG`) y Monedas
   (`MON`: suscripciones y deudas en USD).
3. Los casos ligados a un defecto corregido, como confirmación.
4. Los casos que fallaron en V1.

Los casos de Prioridad Media o Baja de módulos que V2 no toca se excluyen y conservan el resultado
de su última ejecución. Las exclusiones se listan en `entrega-2/03-seleccion-regresion`.

## Alternativas descartadas

- **Re-ejecutar todo el catálogo (lo que decía el roadmap).** Más seguro, pero no muestra ninguna
  decisión de selección, que es lo que pide la consigna, y con ejecución manual compite por tiempo
  con los casos nuevos de V2.
- **Solo los casos de lo que se modificó.** Deja afuera lo que V2 rompe por acoplamiento: el
  dashboard lee las imputaciones que crea cualquier transacción, incluidas las nuevas de
  suscripciones y deudas.

## Consecuencias

- Reemplaza el punto 5 de los criterios de salida de `07-plan-de-testing.md` §6: "la regresión
  seleccionada", no "la suite completa".
- Si un defecto aparece en un módulo excluido, se amplía la selección y se registra el cambio.
- `roadmap.md` §V2 "Terminado cuando" se corrige para decir regresión seleccionada.
