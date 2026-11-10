# ADR-053 — Un solo número en el Resumen: el gasto neto, con lo que entra a elección

**Estado:** propuesta · **Fecha:** 2026-11
**Relacionada:** ADR-041 y ADR-045 (el movimiento de las sueltas y las suscripciones por cobrar entran al gasto
neto, no a un balance), ADR-047 (reemplaza sus puntos 1, 2 y 3), ADR-051 (reemplaza sus puntos 1 a 6 y 8: la
tarjeta de Balance y su hoja pasan al héroe), ADR-052 (reemplaza lo que dice del Balance; la protagonista sigue
siendo la tarjeta esmeralda) · US-25, US-29, US-83, US-101 ([#371](https://github.com/Joaconz/Biyu/issues/371))

## Contexto

El Resumen mostraba dos números que se pisaban: **Gastado en {mes}** en la tarjeta esmeralda y **Balance**
en una tarjeta aparte. El balance ya contiene a Gastado (es ingresos − gastos más lo que el usuario sume),
así que el lector tenía que decidir cuál de los dos era «el número del mes» y volver a sumar a mano para
entender la diferencia. Además lo más consultado, lo gastado, quedaba mezclado con una cifra que depende de
cómo cuenta cada uno su plata (ADR-047).

El pedido es mostrar un solo número, con el encuadre de gasto, y que las partes que hoy componen el balance
(ingresos, deudas sueltas, reembolsos, suscripciones por cobrar) sean opciones de qué entra en ese número.

## Decisión

1. **El héroe esmeralda muestra el gasto neto.** Sin ninguna opción es lo gastado, igual que antes. Cada
   opción incluida lo mueve con signo de gasto: los **ingresos** y los **reembolsos** lo restan; las **deudas
   sueltas** suman lo que el usuario prestó y restan lo que le prestaron (el movimiento con el signo
   invertido); las **suscripciones por cobrar** lo suman. La cuenta es `gastos − Σ aporte(opción incluida)`,
   donde el aporte es el de ADR-047/ADR-051 sin cambios (`optionContribution`). Con ingresos incluidos, el
   número es el balance de antes con el signo al revés. Está en `src/domain/balance.ts` (`computeNetSpent`,
   `spentBreakdown`), con `decimal.js` (C2) y probado en Vitest.
2. **Puede ser negativo.** Si entró más de lo que salió, el número queda negativo, con el signo menos y en el
   color de ingresos del héroe (`--hero-accent`). El rótulo es «Gastado en {mes}» sin opciones y «Gastado neto
   en {mes}» con alguna.
3. **El predeterminado es «solo gastos».** Las cuatro opciones arrancan apagadas. La migración
   `20261110000000_spent_net_preferences.sql` agrega `balance_income` y pasa `balance_loose_debts` a
   `default false`, y vuelve a apagar las tres opciones de las filas guardadas: respondían a la pregunta de
   otro número, y son una preferencia, no un movimiento (C5, ADR-001). El reseteo es intencional y alcanza a todas
   las filas: antes de desplegar contra el Supabase hosteado hay que confirmar con `select count(*) from
   user_preferences` que no hay elecciones de usuarios reales que se pierdan.
4. **La pill bajo el monto es el botón de las opciones.** Muestra la fórmula corta («Solo gastos», «Gastos −
   ingresos + deudas sueltas …») y abre, en el celular, una hoja desde abajo y, desde `sm`, un popover que nace
   de la pill, siempre debajo y con scroll adentro si no entra (la hoja es más alta que el espacio de abajo y,
   sin fijarlo, Floating UI la manda al costado y tapa el héroe). Un ícono discreto en la esquina del héroe
   abre lo mismo. La hoja tiene el número en vivo, el desglose (gastos, más o menos cada parte, «Fuera del
   número» con lo que moverían las opciones apagadas), «Solo gastos» y los cuatro interruptores con lo que cada
   uno mueve este mes. Las líneas de adentro suman exactamente el número.
5. **La tarjeta de Balance desaparece** y con ella la etiqueta Superávit/Déficit. Ajustes conserva la sección
   «Resumen» con los mismos interruptores (`BalanceOptionsList`) y el mismo guardado
   (`useBalanceOptionsSaver`, ahora con cuatro columnas escritas juntas, en orden).
6. **Gastado, el neto de reembolsos y el desglose por categoría no dependen de las opciones.** Lo gastado
   sigue en su línea del desglose; la tarjeta «Neto de reembolsos» es la de ADR-037.
7. **Un mes con deudas sueltas afuera no es un mes vacío** (ADR-051 §7 sigue): el héroe las muestra «fuera del
   número» en vez de cambiar al estado vacío.

## Alternativas descartadas

- **Un número que alterna entre Balance y Gastado.** Obliga a elegir un modo y a recordar en cuál se está; una
  sola cuenta con opciones prendidas cubre los dos usos (con ingresos incluidos es el balance con otro signo).
- **Balance fijo y Gastado como línea chica.** Deja el número más consultado en segundo plano y mantiene el
  balance como protagonista, que es lo que se quiso cambiar.
- **Conservar el default de deudas sueltas incluidas.** Hacía que el número arrancara distinto de lo gastado y
  que «Solo gastos» no fuera el estado inicial.
- **Mostrar el balance con su signo de siempre (ingresos − gastos).** Dos signos opuestos para el mismo
  número según la opción confunde; el encuadre es de gasto y el número sube con lo que sale.

## Consecuencias

- Testids: se conservan `dashboard-total`, `dashboard-total-expenses` (ahora el número neto), `dashboard-total-usd`,
  `dashboard-income` / `dashboard-total-income` y `dashboard-pending-subscriptions*` (líneas del desglose). Se
  renombran los `dashboard-balance-*` a `dashboard-spent-*` (`-options`, `-formula`, `-options-panel`,
  `-options-preview`, `-options-only-expenses`, `-options-done`, `-option-<opción>` y `-amount`, `-breakdown`,
  `-excluded`, `-expenses`, `-loose-debts`, `-reimbursements`) y `dashboard-pending-subscriptions-projected-balance`
  pasa a `-projected-spent`. Nuevos: `dashboard-spent-options-button` (el ícono) y `settings-summary-income`.
  Desaparecen `dashboard-balance`, `dashboard-total-balance` y `dashboard-balance-badge`.
- Los casos de V1 de ingresos y balance (CP-DAS-006, CP-DAS-007) y los de US-83 miden el número de la tarjeta
  de Balance: quedan desactualizados y hay que reescribirlos contra el número del héroe con los ingresos y las
  deudas incluidos (los montos son los mismos con el signo invertido). Los e2e de la suite ya están adaptados
  (`e2e/dashboard-balance-options.spec.ts`, `dashboard-loose-debts.spec.ts`, `settings-summary.spec.ts`).
- La nota del diálogo de eliminar una deuda suelta («El balance de {mes} sube/baja …», `debtDeletionEffect`)
  nombra un balance que ya no existe en pantalla; queda para un ajuste de texto aparte.
- Cambio de schema chico y con las mismas políticas RLS (C7): una columna booleana `not null default false`.
