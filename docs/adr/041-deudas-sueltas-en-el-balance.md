# ADR-041 — Las deudas sueltas mueven el balance del mes

**Estado:** propuesta · **Fecha:** 2026-10
**Relacionada:** ADR-001, ADR-002, ADR-006, ADR-021 · Modifica ADR-037 (punto 6) y US-36 · CA-12

## Contexto

Una deuda suelta (US-36) registra plata que se prestó o que se pidió prestada sin un gasto de por
medio: "le presté $20.000 en efectivo a Juan". Hoy no cambia ningún número del Resumen (US-36 · CA-12
y ADR-037 §6). Prestar no es gastar, y el Resumen se arma con imputaciones de transacciones
(ADR-001), que una deuda suelta no tiene.

El producto pide lo contrario ([#271](https://github.com/Joaconz/Biyu/issues/271), US-83): si presté
$20.000, ese mes tengo $20.000 menos, y el balance tiene que mostrarlo. Hay que decidir en qué número
entra, en qué mes, qué pasa al saldarla y cómo no contar dos veces la misma plata.

## Decisión

1. **Solo cambia el balance.** Gastado, ingresos, el desglose por categoría y por cuenta, el neto de
   reembolsos (US-30) y los totales de Deudas (US-37) no cambian. Prestar no es un gasto y devolver no
   es un ingreso: no entran en esas tarjetas.
2. **Balance del período = ingresos − gastos + movimiento de deudas sueltas del período.** El
   movimiento suma, en pesos (`amount_ars`, congelado, C5), cada **evento** de una deuda suelta cuyo
   día cae en el período, en hora de Argentina (ADR-021):

   | Evento | Día | "Me deben" (`owed_to_me`) | "Debo" (`i_owe`) |
   |---|---|---|---|
   | Alta | `incurred_on` | − monto (presté, salió plata) | + monto (me prestaron, entró plata) |
   | Saldada | `settled_at` | + monto (me devolvieron) | − monto (devolví) |

   Una deuda que se salda en el mismo mes en que se dio de alta suma cero ese mes.
3. **Reabrir** (US-40) pone `settled_at` en nulo: el evento "saldada" desaparece y el balance de ese
   mes vuelve a como estaba. Si se vuelve a saldar, el evento cae en el día nuevo.
4. **Las deudas vinculadas no mueven el balance.** Su gasto ya cuenta completo en gastos, y su
   reembolso tiene su propio número en el neto (ADR-006). Sumarlas también al balance contaría dos
   veces la misma plata.
5. **El cálculo vive en `src/domain/`** (función pura que recibe las deudas y el período) **o en una
   consulta SQL**, no en el componente (C1). Lee `debts` con la política de `select` que ya existe
   (C7). No hace falta migración.
6. **Un mes solo con eventos de deudas sueltas no es un mes vacío.** El Resumen se muestra con gastado
   e ingresos en $0,00 y el balance igual al movimiento, en vez del estado vacío de US-33. Modifica
   US-33 · CA-1 solo para ese caso: un mes sin transacciones ni eventos sigue con el estado vacío, y su
   caso de regresión (CP-DAS-010) sigue valiendo.

## Alternativas descartadas

- **Que entren en el neto de reembolsos** (US-30). El neto responde "cuánto de lo que gasté es mío", y
  un préstamo en efectivo no tiene gasto del que descontar. Además, US-30 ya está implementada y
  probada con la regla de ADR-037.
- **Registrar el préstamo como un gasto y la devolución como un ingreso.** Infla gastado e ingresos con
  plata que no se consumió ni se ganó, y cambia el desglose por categoría.
- **Que cuente solo mientras está pendiente.** Si la deuda pendiente restara el balance de cada mes
  hasta saldarse, el mismo préstamo restaría en todos los meses. Por eventos, cada movimiento de plata
  cuenta una sola vez, en el mes en que pasó.
- **Una tarjeta aparte con las deudas pendientes, sin tocar el balance.** Era la otra opción: cumple
  "que aparezca" sin cambiar el balance. El producto eligió que el balance refleje la plata que salió y
  entró.

## Consecuencias

- **US-36 · CA-12 cambia:** una deuda suelta no cambia el total gastado, los ingresos ni el neto, pero
  **sí** el balance (US-83). US-30 · CA-4 sigue valiendo tal cual.
- **US-29 cambia su definición** de balance (ingresos − gastos) en los meses con deudas sueltas. Los
  casos de regresión de V1 que verifican el balance con datos sin deudas (CP-DAS-006 y CP-DAS-007)
  siguen valiendo.
- El Resumen hace una lectura más (`debts` sueltas con evento en el período), en la misma carga que el
  resto: si falla, se ve `dashboard-error` y ningún número a medias (como US-30).
- Saldar una deuda vieja cambia el balance del mes en que se salda, no el del alta. El pasado no se
  reescribe (C5).
- Docs a actualizar al implementar: `04-data-model.md` (consulta nueva del balance), la fila de FR-20
  en `08-trazabilidad.md` y US-29 de `entrega-1/01-historias-de-usuario.md`, con una nota que remita a
  US-83.
