# ADR-053 — Gráficos de Suscripciones

**Estado:** propuesta · **Fecha:** 2026-11 · Complementa ADR-033 (total comprometido) y ADR-045; mismo criterio de gráficos que ADR-038 §5 y ADR-050

## Contexto

La pantalla de Suscripciones muestra cuánto está comprometido este mes (US-63, ADR-033) y tres listas, pero no
responde "cuándo cobran" ni "en qué categoría se me va". Son las preguntas de quien abre la pantalla a mitad de mes.

## Decisión

1. **Dos secciones entre el héroe y las listas:** «Cobros de {mes}» y «Por categoría». Salen de la misma lista
   de suscripciones que ya carga la pantalla y no agregan consultas, salvo el `color` de la categoría en el `select`
   de `fetchSubscriptions`. Sin migración, RPC ni RLS nueva (C7). Se muestran bajo la misma condición que el héroe:
   si hay USD y no se pudieron leer los tipos de cambio, no se dibujan (no hay estimación honesta); si se leyeron pero el
   mes no tiene el suyo, se dibujan y las USD se avisan aparte, como en ADR-033. Sin suscripciones activas en el mes no
   se dibuja nada.
2. **«Cobrado» es que el día de cobro ya llegó, no que exista la transacción.** `monthChargeSchedule` usa la regla
   de la puesta al día (`hasFallenDue`, R5: hoy incluido) y no lee transacciones, igual que el total comprometido.
   Así **cobrado + falta = el total del héroe** por construcción (cada mitad es `committedMonthlyTotal` sobre su
   subconjunto), y el gráfico no puede discrepar de la tarjeta. Un mes vencido bloqueado (R6) cuenta como cobrado:
   el aviso de bloqueadas sigue siendo el de la puesta al día. El "próximo cobro" que se abre elegido es `nextChargeDate` del mes sin mirar los períodos ya generados (R2), por la misma razón: puede diferir del campo "Próximo cobro" del detalle si ese mes ya tiene su transacción.
3. **Por categoría usa la misma conversión que el héroe.** Cada categoría es `committedMonthlyTotal` sobre sus
   suscripciones: las USD van al tipo de cambio del mes con redondeo half-up por suscripción (ADR-013), y las que no
   tienen tipo de cambio quedan fuera de la barra y se avisan en la fila (`usdPending`). El porcentaje es sobre el
   total en pesos, con un decimal; el orden es de mayor a menor y desempata el nombre. El color es el de la categoría
   (`displayCategoryColor`, con la variante oscura de ADR-052).
4. **La tira de cobros es HTML/CSS propio, sin librería de gráficos** (criterio de ADR-038 §5): una columna por día, un punto por cobro (hasta 3
   apilados por día; el resto queda en el detalle y en la tabla). **Cobrado = círculo lleno, falta = aro**: la forma lleva
   el significado, no el color. Hoy lleva su rótulo «Hoy» y una columna resaltada.
5. **El toque elige el día con cobros más cercano.** En 390 px una columna mide ~10 px, muy por debajo de un blanco táctil.
   Los días con cobros son botones (teclado y lector de pantalla) y un toque en cualquier parte de la tira cae en el día
   con cobros más cercano. El detalle del día elegido (nombre, monto, cobrado o falta) va debajo; arranca en el próximo
   cobro o, si ya pasaron todos, en el último.
6. **Accesibilidad.** Cada gráfico tiene una tabla oculta para lectores de pantalla (en un `div` con `sr-only`: una tabla
   ignora ese ancho) con todos los cobros y todas las categorías; la lista visual de categorías queda `aria-hidden` para
   no leerse dos veces. Sin color como única señal: nombre, monto y porcentaje en texto.
7. **Lógica pura en `src/domain/subscriptions.ts`** (`monthChargeSchedule`, `committedByCategory` y textos), con `decimal.js`
   y `today` por parámetro (C1, C2); los montos llegan de PostgREST como texto.

## Alternativas descartadas

- **Marcar "cobrado" según las transacciones generadas.** Más fiel a la caja, pero necesita los períodos generados (que
  hoy pueden faltar, ADR-031) y haría que la suma no coincida con el héroe cuando algo esté bloqueado.
- **Calendario de 7 columnas.** Cada día mide más, pero ocupa cinco filas y deja de ser una tira; el toque al más cercano
  resuelve el blanco táctil sin ese costo.
- **Recharts u otra librería.** Mismo razonamiento que ADR-038 y ADR-050.

## Consecuencias

- **`SubscriptionRecord` gana `categoryColor` (opcional).** Lo llena `fetchSubscriptions`; los demás consumidores lo ignoran.
- **Costo de prueba.** Cubierto en `tests/domain/subscription-charts.test.ts` (día clamp, hoy incluido, mes pasado y futuro,
  USD sin tipo de cambio, consistencia con `committedMonthlyTotal`) y en `e2e/subscriptions-charts.spec.ts`.
- **Trazabilidad.** Faltan la historia y los casos de prueba en `docs/08-trazabilidad.md` (no entra en este cambio).
