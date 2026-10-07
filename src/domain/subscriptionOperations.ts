// Pausar, reanudar, cancelar y editar una suscripción (US-56 a US-59, ADR-030). Puro: sin red, sin
// reloj; `today` entra por parámetro (C1). Lo que decide Postgres (el piso de R8, la puesta al día) no se
// repite acá: esto solo redacta lo que el diálogo le anticipa al usuario y el aviso que le confirma.
import { parseMoney, type Decimal } from './money'
import { currentPeriod, formatPeriod, formatPeriodLong, isPeriodBefore, toIsoDate, type Period } from './period'
import { evaluateOccurrences, occurrenceDate, type SubscriptionRecord } from './subscriptions'

type Schedule = Pick<SubscriptionRecord, 'billingDay' | 'generateFromPeriod' | 'endPeriod'>

/**
 * US-56: el día que dice "Este mes tampoco se cobra si todavía no llegó el día 28", o null si ese
 * texto no corresponde. Corresponde si el período corriente está dentro de `[generate_from_period,
 * end_period]` (R1), todavía no tiene transacción (R2, aunque esté borrada) y hoy es anterior a su
 * `occurred_on` (R5). El día es el de `occurred_on`, ya recortado al fin de mes (R4).
 */
export function pauseSkipsCurrentMonthDay(
  subscription: Schedule,
  alreadyGenerated: ReadonlySet<string>,
  today: Date,
): number | null {
  const current = currentPeriod(today)
  if (isPeriodBefore(current, subscription.generateFromPeriod)) return null
  if (subscription.endPeriod && isPeriodBefore(subscription.endPeriod, current)) return null
  if (alreadyGenerated.has(formatPeriod(current))) return null
  const occurredOn = occurrenceDate(current, subscription.billingDay)
  if (toIsoDate(today) >= occurredOn) return null
  return Number(occurredOn.slice(8))
}

/**
 * Los meses vencidos que no se pueden cargar por falta de tipo de cambio (R6), de más viejo a más
 * nuevo. Pausar o cancelar no los rescata (ADR-030). Sin los tipos de cambio del usuario (no se
 * pudieron leer) no hay forma de saberlo y la lista queda vacía: la operación no depende de esto.
 */
export function missingFxPeriods(
  subscription: Pick<SubscriptionRecord, 'status' | 'amount' | 'currency'> & Schedule,
  alreadyGenerated: ReadonlySet<string>,
  fxRatesByPeriod: ReadonlyMap<string, Decimal> | null,
  today: Date,
): Period[] {
  if (subscription.currency === 'USD' && !fxRatesByPeriod) return []
  return evaluateOccurrences(
    {
      status: subscription.status,
      amount: parseMoney(subscription.amount),
      currency: subscription.currency,
      billingDay: subscription.billingDay,
      generateFromPeriod: subscription.generateFromPeriod,
      endPeriod: subscription.endPeriod,
    },
    alreadyGenerated,
    fxRatesByPeriod ?? new Map(),
    today,
  )
    .filter((evaluation) => evaluation.blockedBy === 'missing_fx_rate')
    .map((evaluation) => evaluation.period)
}

/** "julio 2026", "julio 2026 y agosto 2026" o "julio 2026, agosto 2026 y septiembre 2026". */
export function periodListText(periods: readonly Period[]): string {
  const labels = periods.map(formatPeriodLong)
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`
}

/**
 * Aviso del diálogo de pausar (US-56) y de cancelar (US-58) sobre los meses bloqueados. `verb` es la
 * acción conjugada del texto: "pausás" o "cancelás". null si no hay meses bloqueados.
 */
export function blockedMonthsWarning(periods: readonly Period[], verb: 'pausás' | 'cancelás'): string | null {
  if (periods.length === 0) return null
  const list = periodListText(periods)
  const subject = `${list.charAt(0).toUpperCase()}${list.slice(1)}`
  return periods.length === 1
    ? `${subject} no se cargó por falta de tipo de cambio. Si la ${verb}, ese mes no se va a cargar.`
    : `${subject} no se cargaron por falta de tipo de cambio. Si la ${verb}, esos meses no se van a cargar.`
}

/** "Antes se cargó 1 gasto vencido." / "Antes se cargaron N gastos vencidos." (N = `generated_before`). */
function beforeText(generatedBefore: number): string {
  return generatedBefore === 1
    ? 'Antes se cargó 1 gasto vencido.'
    : `Antes se cargaron ${generatedBefore} gastos vencidos.`
}

/** Aviso al pausar (US-56). Con gastos atrasados que se generaron antes de pausar, los cuenta. */
export function pausedNoticeText(generatedBefore: number): string {
  return generatedBefore > 0 ? `Suscripción pausada. ${beforeText(generatedBefore)}` : 'Suscripción pausada'
}
