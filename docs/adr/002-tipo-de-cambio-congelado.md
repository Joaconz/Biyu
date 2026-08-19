# ADR-002 — El tipo de cambio se congela en la transacción

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

El sistema maneja ARS y USD, y el dashboard necesita un número único comparable. La propuesta original guardaba un tipo de cambio por mes en una tabla de configuración y lo aplicaba al calcular.

## Problema con ese enfoque

Editar el tipo de cambio de un mes reescribe la historia: todos los KPIs de ese período cambian retroactivamente. Un gasto de USD 100 hecho cuando el dólar valía $1.250 costó $125.000. Que hoy valga $1.400 no cambia lo que se pagó.

## Decisión

Cada transacción en USD guarda su propio `fx_rate` en el momento del registro. `amount_ars` es una columna generada a partir de él. El tipo de cambio de referencia por período (`fx_rates`) existe únicamente para **sugerir un default** en el formulario; nunca se usa en un cálculo histórico.

Si el período no tiene tipo de cambio de referencia, el formulario pide el valor y bloquea el guardado hasta tenerlo. No se asume ningún default.

## Consecuencias

- Los totales de un mes cerrado son estables. Es la restricción C5.
- El usuario puede pisar el valor sugerido en una operación puntual sin afectar a las demás.
- Una transacción en USD sin `fx_rate` es un dato inválido, y la base lo impide (invariante I5).
- Costo: un campo más en el formulario cuando se registra en USD. Se mitiga con el default por período.
