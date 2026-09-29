# ADR-024 — Registro de una transacción en pasos

**Estado:** aceptada · **Fecha:** 2026-09

## Contexto

El formulario de registro (FR-06, US-01 a US-11) mostraba todos los campos en una sola pantalla:
tipo, monto, moneda, categoría, cuenta, cuotas, fecha y nota. En el celular, la grilla de
categorías, las cuentas y la fecha competían con el monto, y el botón Guardar tapaba parte del
formulario. La propuesta del dueño del producto: completar el registro "pantalla por pantalla".

Dos requisitos acotan la idea:

- **NFR-07:** quien ya conoce la app registra un gasto en como máximo 4 pasos y en menos de 10
  segundos. Un paso por campo serían 6 y no cumple.
- **US-01:** el registro es la pantalla de inicio (CP-REG-001: `/` cae en `/register` sin pasos
  intermedios).

## Decisión

El registro se hace en pasos sobre un único borrador, en el mismo `TransactionForm`:

1. **Monto:** Gasto | Ingreso, el monto centrado con el foco puesto (US-02) y la moneda. En
   dólares, el tipo de cambio va en este mismo paso.
2. **Categoría:** la grilla de US-06. Tocar una categoría ya avanza al paso siguiente (tras 180 ms,
   para que la selección se vea). Un ingreso no exige categoría (I8) y salta este paso.
3. **Detalles:** cuenta (precargada con la última usada, US-07), cuotas si es tarjeta de crédito,
   fecha (precargada con hoy, US-03) y la nota (la descripción de US-08; en pantalla dice "Nota"). Acá está Guardar.

El caso común son tres acciones: escribir el monto y tocar Siguiente, tocar la categoría, tocar
Guardar. Cumple NFR-07 con margen.

- **US-01 se mantiene:** `/register` sigue siendo la pantalla de inicio y abre en el paso 1. El
  "botón" desde el que sale el flujo es Registrar en la barra de navegación.
- **Arriba de los pasos 2 y 3 queda a la vista lo ya elegido** (monto, categoría) como chips que
  vuelven a su paso. En dólares el chip muestra también el tipo de cambio: la fecha está en el paso
  3 y, si cambia de mes, el TC sugerido puede cambiar. Lo que se congela al guardar (C5) no puede
  cambiar fuera de la vista.
- **US-11 sigue valiendo:** el botón de cada paso se deshabilita mientras falte algo, y el motivo
  se lee junto a él. En el último paso ese motivo incluye los errores de pasos anteriores.
- **La lógica de pasos** (qué pasos hay según el tipo y qué campos valida cada uno) vive en
  `src/lib/registerSteps.ts`, sin React, con tests en `tests/lib/`. La validación sigue siendo
  `validateTransactionDraft`, sin cambios, y guardar sigue siendo una sola RPC (C4).
- **Transición:** el paso entra desde el lado hacia el que se avanza y vuelve por el mismo camino
  (260 ms, curva de drawer). Es una transición CSS y no keyframes, así que se puede interrumpir.
  Con `prefers-reduced-motion` solo se funde.

## Alternativas descartadas

- **Un paso por campo.** Es lo más literal de la propuesta, pero son 6 pasos y no cumple NFR-07.
- **El Resumen como inicio y el registro en una hoja modal desde un botón "+".** Es el patrón
  habitual en apps de finanzas, pero rompe US-01 y suma un toque a cada registro, justo en la
  acción que la app tiene que hacer más rápida.
- **El paso en la URL (`?paso=2`), para que el botón Atrás de Android retroceda un paso.** Es más
  nativo, pero recargar en el paso 3 deja un borrador vacío y el historial queda con pasos
  huérfanos después de guardar. Por ahora el paso vive en el estado del componente y el retroceso
  es la flecha de arriba. Queda como mejora si en las pruebas de usabilidad molesta.

## Consecuencias

- Los casos que recorren el formulario suman el avance de paso (`transaction-form-next`, o tocar
  la categoría): CP-REG-002 (la fecha está en el paso 3), CP-REG-004 y CP-REG-005 (la grilla está
  en el paso 2), CP-REG-006 (la cuenta, en el paso 3), CP-REG-007 a 009, y CP-REG-010 y 011, donde
  el botón deshabilitado del paso 1 es Siguiente y no Guardar. `10-catalogo-casos-v1.md` ya refleja
  estos pasos. Los `data-testid` de los
  campos no cambian; se agregan `transaction-form-step` (con `data-step`), `transaction-form-next`,
  `transaction-form-back` y `transaction-form-summary-*`.
- CP-REG-016 (foco en el monto al abrir) se sigue cumpliendo: el paso 1 es el que abre.
- Al volver al paso 1 el monto recupera el foco y el teclado se abre de nuevo. Es lo esperable si
  se vuelve para corregir el monto, pero hay que verlo en un celular real.
- El botón Atrás del sistema sale de `/register` aunque se esté en el paso 3; el borrador se pierde.
