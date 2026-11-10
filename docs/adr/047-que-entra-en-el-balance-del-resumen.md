# ADR-047 — El usuario elige qué entra en el balance del Resumen

**Estado:** aceptada; los puntos 7 y 4 (último guion) los reemplaza [ADR-051](051-balance-desglosado-y-configurable-desde-el-resumen.md) y los puntos 1, 2 y 3 (qué entra por defecto, que los ingresos quedan siempre y la fórmula), [ADR-053](053-un-solo-numero-de-gasto-neto-en-el-resumen.md) · **Fecha:** 2026-11
**Relacionada:** ADR-001, ADR-006, ADR-025, ADR-037, ADR-041, ADR-045 · US-101 ([#371](https://github.com/Joaconz/Biyu/issues/371))

## Contexto

El balance del Resumen ya mezcla criterios que dependen de cómo cuenta cada persona su plata:

- las **deudas sueltas** entran siempre, por eventos (ADR-041);
- el **reembolso de un gasto compartido** solo se ve aparte, en «Neto de reembolsos» (ADR-006, ADR-037 §6);
- las **suscripciones por cobrar** del mes son una tarjeta aparte con un «Balance proyectado» (ADR-045).

US-101 pide que cada persona elija cuáles de las tres entran en el balance, sin que nadie vea cambiar
su Resumen si no toca nada.

## Decisión

1. **Tres opciones por usuario**, con los valores de hoy como predeterminados:

   | Opción | Predeterminado | Qué suma al balance |
   |---|---|---|
   | Deudas sueltas | incluida | El movimiento de las deudas sueltas del mes (ADR-041) |
   | Reembolso de gastos compartidos | no incluido | Lo que el «Neto de reembolsos» descuenta del gastado (ADR-037 §6) |
   | Suscripciones por cobrar | no incluidas | Resta lo que las suscripciones activas todavía van a cobrar en el mes (ADR-045) |

2. **Solo cambia el balance.** «Gastado», los ingresos, el desglose por categoría y por cuenta, el
   neto de reembolsos y los totales de Deudas no cambian con las opciones.
3. **Fórmula:** balance = ingresos − gastos + movimiento de deudas sueltas (si está incluida) +
   reembolsos (si está incluido) − suscripciones por cobrar (si están incluidas). El cálculo es una
   función pura en `src/domain/balance.ts` que recibe las opciones como parámetro (C1) y trabaja con
   `decimal.js` (C2).
4. **Sin contar dos veces lo mismo**, como en ADR-041 §4:
   - Las deudas sueltas y los reembolsos son conjuntos disjuntos: las sueltas no tienen gasto de
     origen, los reembolsos son las deudas vinculadas a un gasto. Una deuda nunca está en los dos.
   - Una suscripción por cobrar es, por definición, la que todavía no generó su transacción del mes
     (ADR-045): cuando la genera, deja de estar pendiente y pasa a ser un gasto. No hay momento en que
     cuente en el gastado y en lo pendiente a la vez.
   - Con las suscripciones incluidas, la tarjeta de ADR-045 deja de mostrar el «Balance proyectado»,
     porque el balance de arriba ya las descuenta; sigue mostrando el total y la cantidad.
5. **Dónde se guarda:** una tabla nueva `user_preferences` (una fila por usuario, RLS por `user_id`,
   escritura directa bajo RLS como `user_setup`, ADR-025), no `user_setup`. La fila de `user_setup`
   marca si la persona pasó por la configuración inicial: `completed_at` nulo significa «setup
   pendiente» y las cuentas anteriores a US-68 no tienen fila a propósito (DEF-022). Guardar una
   preferencia ahí crearía una fila con `completed_at` nulo y mandaría a esas personas al setup.
   Sin fila en `user_preferences`, valen los predeterminados.
6. **No reescribe nada** (C5, ADR-001): cambiar una opción solo cambia cómo se suma al leer. No toca
   ninguna transacción, imputación ni deuda.
7. **El Resumen dice qué incluye** el balance, en una línea bajo el número con la fórmula
   («Ingresos − gastos + deudas sueltas»), para entenderlo sin ir a Ajustes.
8. **Si falla la lectura de las preferencias**, el Resumen muestra `dashboard-error` y ningún número
   a medias, igual que el resto de la carga.

## Alternativas descartadas

- **Columnas en `user_setup`.** Ver el punto 5.
- **Guardarlo en el navegador (`localStorage`).** La preferencia no seguiría a la persona entre
  dispositivos y la automatización no podría verla por la API.
- **Que las opciones también cambien «Gastado».** Gastado es plata que salió por una compra; los
  reembolsos y las deudas no la cambian, y el neto de reembolsos ya cubre ese número (ADR-006).
- **Un RPC para guardar.** No hay invariante financiera que proteger: son tres booleanos del propio
  usuario.

## Consecuencias

- Migración con la tabla, su RLS y su par de tests pgTAP (C7): otra sesión → cero filas; `anon` →
  `permission denied`.
- Ajustes suma la sección «Resumen» con tres interruptores que guardan al tocarlos. Desde ADR-051 los mismos
  interruptores se abren también desde la tarjeta de Balance del Resumen.
- Docs a actualizar: `04-data-model.md` (tabla nueva y consulta del balance) y la trazabilidad de FR-20.
