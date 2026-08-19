# ADR-006 — El dashboard muestra gasto bruto

**Estado:** aceptada · **Fecha:** 2026-08

## Contexto

Una parte de los gastos se comparte y se reembolsa después. La pregunta es si el número grande del dashboard debe ser lo que salió de la cuenta (bruto) o lo que efectivamente es propio (neto de reembolsos).

## Decisión

El número principal es el **bruto**. El neto de reembolsos aparece como KPI secundario.

## Rationale

El bruto es lo que efectivamente salió. Si el dashboard mostrara neto, un reembolso que nunca llega desaparecería silenciosamente del gasto del mes: el sistema diría que gastaste menos de lo que gastaste, en base a una promesa. Con el bruto adelante y el neto al lado, la brecha entre ambos es visible y es información útil por sí misma — es cuánta plata tenés prestada sin querer.

Además, el objetivo declarado del sistema es visibilidad, no optimismo contable.

## Consecuencias

- Un mes con muchos gastos compartidos se ve caro. Es correcto: la plata salió.
- La diferencia entre bruto y neto funciona como recordatorio pasivo de deudas pendientes.
- El cálculo del neto necesita vincular deudas con imputaciones del período, lo que solo funciona bien para deudas con `transaction_id`. Las deudas sueltas no afectan el neto — quedan solo en la pantalla de deudas.
