# ADR-005 — La importación de resúmenes en PDF queda fuera de v1

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

La propuesta original incluía en v1 la importación de resúmenes de tarjeta: subir el PDF, parsearlo con la API de Claude, revisar las transacciones detectadas en una tabla editable, asignar categorías, marcar ítems a ignorar, marcar ítems como compartidos, y confirmar la inserción en lote.

## Problema

Esa feature sola tiene más superficie que las tres pantallas restantes juntas: subida de archivos, llamada a un servicio externo, parseo no determinístico, un estado intermedio de revisión que hay que persistir o mantener en memoria, escritura en lote sobre dos tablas, y manejo de errores para cada uno de esos pasos.

Y aporta poco al objetivo primario. Lo interesante de este proyecto como pieza de ingeniería es el modelo de dominio —cuotas, monedas, reembolsos—, no la integración con un servicio externo.

El diagnóstico del propio proyecto es que los dos intentos anteriores murieron por acumular alcance antes de que existiera uso. Meter esta feature en v1 repite el patrón con mejor justificación.

## Decisión

Fuera de v1. Entra en v2, después de que exista **un mes calendario completo con datos reales cargados a mano**.

Cuando entre, dos reglas ya decididas:
- La clave de API va en una variable de entorno del servidor. No se pide por UI ni se guarda en la base (restricción C8).
- La importación crea transacciones normales a través del mismo camino de escritura que el registro manual. No hay una ruta de escritura paralela.

## Consecuencias

- v1 es más chico y llega antes a estar usable.
- El registro manual tiene que ser realmente rápido, porque es el único camino de entrada. Eso ya es una restricción del proyecto.
- La métrica de cobertura real —comparar lo registrado contra el resumen— tampoco existe en v1. Se aproxima con días con registro.
