# ADR-051 — El balance se desglosa y se configura desde su tarjeta del Resumen

**Estado:** propuesta · **Fecha:** 2026-11
**Relacionada:** ADR-023, ADR-041, ADR-045, ADR-047 (lo extiende y reemplaza sus puntos 7 y 4, último guion) · US-29, US-83, US-101 ([#371](https://github.com/Joaconz/Biyu/issues/371)) · El punto 1 (desglose debajo del número) lo cambia [ADR-052](052-rebranding-esmeralda-claro-oscuro.md): el desglose está en la hoja.

## Contexto

ADR-047 dejó elegir qué entra en el balance (deudas sueltas, reembolsos de gastos compartidos y
suscripciones por cobrar), pero solo desde Ajustes, y el Resumen lo contaba con una línea de texto
(«Ingresos − gastos + deudas sueltas»). Para saber cuánto pesaba cada parte había que leer tres lugares:
la tarjeta de Ingresos, la línea «Incluye deudas sueltas: …» del Balance y la tarjeta suelta de
suscripciones por cobrar con su «Balance proyectado» (ADR-045). El caso «solo movimientos» (ninguna
opción) no tenía nombre: era la fórmula más corta.

El pedido es configurarlo desde la misma tarjeta, sin un panel aparte, y que se entienda qué suma y qué
resta sin leer texto largo.

## Decisión

1. **La tarjeta de Balance tiene un desglose.** Debajo del número, una línea por parte con el signo en su
   columna (+ o −, con «suma»/«resta» para lectores de pantalla) y el monto sin signo: Ingresos, Gastos y,
   si el mes tiene algo de eso, Deudas sueltas, Reembolsos y Suscripciones por cobrar. Las líneas de
   adentro suman exactamente el número de arriba. Las opciones que el mes tiene pero el usuario dejó
   afuera van apagadas bajo «Fuera del balance», con el monto que moverían. Una opción sin actividad en
   el mes no aparece en ninguna de las dos listas. Es lógica pura en `src/domain/balance.ts`
   (`balanceBreakdown`, `optionContribution`), con `decimal.js` (C2) y probada en Vitest.
2. **La fórmula es el botón que abre los interruptores.** Tocar la línea de la fórmula abre, en el
   celular, una hoja desde abajo (Base UI Drawer, se cierra deslizando, con «Listo», con Escape o tocando
   afuera) y, desde `sm`, un popover que nace del botón. Las dos muestran el balance del mes en vivo
   (en el celular la hoja puede tapar el número de la tarjeta), un botón «Solo movimientos» que apaga las
   tres opciones de un toque, y los tres interruptores con lo que cada uno mueve este mes
   («+$60.000,00 este mes», «Nada este mes»).
3. **«Solo movimientos» tiene nombre.** Sin ninguna opción, la fórmula dice «Solo movimientos: ingresos −
   gastos» (reemplaza el punto 7 de ADR-047 solo en ese caso; las demás fórmulas no cambian).
4. **El cambio se ve al instante y se guarda atrás.** El Resumen recalcula con los datos ya cargados
   (`useMonthlySummary` recibe las opciones) y `user_preferences` se escribe con las tres columnas juntas,
   en orden: varios toques seguidos dejan la fila igual a lo último que se ve. Si falla el último
   guardado, vuelve a lo último que sí se guardó y avisa con un toast. No reescribe ningún movimiento
   (C5, ADR-001) y no hay migración: la tabla y su RLS son las de ADR-047.
5. **Ajustes conserva la sección «Resumen»** con los mismos interruptores: un componente
   (`BalanceOptionsList`) y un guardado (`useBalanceOptionsSaver`) para las dos pantallas, sin lógica
   duplicada. Ajustes muestra la explicación de cada opción; la tarjeta, su monto del mes.
6. **Ingresos y las suscripciones por cobrar pasan a ser líneas del desglose.** La tarjeta suelta de
   Ingresos desaparece (su testid `dashboard-income` y `dashboard-total-income` quedan en la línea). La
   tarjeta de suscripciones por cobrar de ADR-045 queda solo para el mes sin movimientos (y si el resumen
   no carga), donde no hay balance que desglosar. Con el resumen cargado, la línea de suscripciones dice
   cuántos cobros faltan, las USD sin tipo de cambio y, si está afuera, cuánto quedaría el balance con
   ellas: es el «Balance proyectado» de ADR-045 en su lugar. Esto reemplaza el último guion del punto 4
   de ADR-047 (con las suscripciones incluidas no hay proyección que esconder: la línea ya está adentro).
7. **Un mes con deudas sueltas afuera no es un mes vacío** para la pantalla: si el usuario las excluye en
   un mes que solo tiene eso, la tarjeta sigue con las deudas en «Fuera del balance» en vez de cambiar al
   estado vacío y desaparecer bajo el dedo. `computeMonthlySummary` no cambia (`hasData` sigue siendo el
   de ADR-041 §6); la pantalla mira además `looseDebtActivity`.
8. **Gastado y el neto de reembolsos siguen en su tarjeta** y no dependen de las opciones (ADR-047 §2).

## Alternativas descartadas

- **Un panel o pantalla aparte para elegir.** Es lo que había (Ajustes) y lo que el pedido descarta:
  separa la decisión del número que cambia.
- **Chips de opciones siempre visibles en la tarjeta.** Tres chips más el desglose recargan una tarjeta
  que se mira todos los días para cambiar algo que se toca pocas veces (divulgación progresiva).
- **Guardar recién al cerrar la hoja.** Obliga a un paso más y pierde la elección si se cierra la app; el
  guardado al tocar es lo que ya hacía Ajustes.
- **Mantener la tarjeta suelta de suscripciones siempre.** Repetía el total que ahora es una línea y un
  segundo balance («proyectado») al lado del real.
- **Popover también en el celular.** Con el número a mitad de pantalla no entraba ni arriba ni abajo y
  quedaba lejos del pulgar.

## Consecuencias

- Testids nuevos: `dashboard-balance-options` (el botón con la fórmula; `dashboard-balance-formula`
  sigue adentro), `dashboard-balance-options-panel`, `-preview`, `-only-movements`, `-done`,
  `dashboard-balance-option-<opción>` (y `-amount`), `dashboard-balance-breakdown`,
  `dashboard-balance-excluded` y una línea por parte (`dashboard-balance-expenses`,
  `dashboard-balance-loose-debts`, `dashboard-balance-reimbursements`, `dashboard-pending-subscriptions`,
  cada una con `-amount` o `-total` y `data-included`). La línea «Incluye deudas sueltas: …» deja de
  existir: los e2e de US-83 y US-101 leen la fila y su monto (`e2e/dashboard-loose-debts.spec.ts`,
  `e2e/settings-summary.spec.ts`) y `e2e/dashboard-balance-options.spec.ts` cubre la hoja y el popover.
- Los casos de V1 de ingresos y balance (CP-DAS-006, CP-DAS-007) siguen valiendo: los montos son los
  mismos, ahora en la línea de Ingresos y en el número de la tarjeta.
- Sin cambios de schema ni de RLS (C7): no hace falta pasar por `rls-migration-reviewer`.
