// Pausar, reanudar, cancelar y editar una suscripción (US-56 a US-59, ADR-030). Puro: sin red, sin
// reloj; `today` entra por parámetro (C1). Lo que decide Postgres (el piso de R8, la puesta al día) no se
// repite acá: esto solo redacta lo que el diálogo le anticipa al usuario y el aviso que le confirma.
import {
  currentPeriod,
  formatDisplayDate,
  formatPeriod,
  formatPeriodLong,
  isPeriodBefore,
  isSamePeriod,
  toIsoDate,
  type Period,
} from './period'
import { parseMoney, type Decimal } from './money'
import type { BlockedOccurrence } from './subscriptionBlocked'
import { computeDueOccurrences, nextChargeDate, noMoreChargesText, occurrenceDate, type SubscriptionRecord } from './subscriptions'

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

/** "julio 2026", "julio 2026 y agosto 2026" o "julio 2026, agosto 2026 y septiembre 2026". */
export function periodListText(periods: readonly Period[]): string {
  const labels = periods.map(formatPeriodLong)
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} y ${labels[labels.length - 1]}`
}

/**
 * Aviso del diálogo de pausar (US-56) y de cancelar (US-58) sobre los meses bloqueados por falta de tipo
 * de cambio (R6): pausar o cancelar no los rescata (ADR-030). `blocked` sale de `blockedOccurrences`
 * (US-62); los bloqueados por monto fuera de rango no entran, el texto habla del tipo de cambio. `verb` es
 * la acción conjugada: "pausás" o "cancelás". null si no hay meses sin tipo de cambio.
 */
export function blockedMonthsWarning(blocked: readonly BlockedOccurrence[], verb: 'pausás' | 'cancelás'): string | null {
  const periods = blocked.filter((b) => b.reason === 'missing_fx_rate').map((b) => b.period)
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

/**
 * US-57: lo que el diálogo de "Reanudar" anticipa después de "No se cargan los meses en los que estuvo
 * pausada.", según R4, R5 y el piso nuevo de R8 (`max(generate_from_period, start_period, período
 * corriente)`). Tres casos: el período corriente ya venció y no tiene transacción ("Al reanudar se carga
 * octubre 2026 (01/10/2026)."), el próximo cobro ("Próximo cobro: 10/10/2026.") o ya no hay más cobros.
 * El "Próximo cobro" es el `occurred_on` de la primera ocurrencia que se genera después (CA-5).
 */
export function resumeOutcomeText(
  subscription: Pick<SubscriptionRecord, 'billingDay' | 'startPeriod' | 'generateFromPeriod' | 'endPeriod'>,
  alreadyGenerated: ReadonlySet<string>,
  today: Date,
): string {
  const current = currentPeriod(today)
  let floor = subscription.generateFromPeriod
  if (isPeriodBefore(floor, subscription.startPeriod)) floor = subscription.startPeriod
  if (isPeriodBefore(floor, current)) floor = current

  const { endPeriod } = subscription
  const noMoreCharges = endPeriod
    ? isPeriodBefore(endPeriod, current)
      ? `No hay más cobros: terminó en ${formatPeriodLong(endPeriod)}.`
      : noMoreChargesText(endPeriod)
    : null
  if (endPeriod && isPeriodBefore(endPeriod, floor)) return noMoreCharges as string

  const occurredOn = occurrenceDate(current, subscription.billingDay)
  if (isSamePeriod(floor, current) && !alreadyGenerated.has(formatPeriod(current)) && toIsoDate(today) >= occurredOn) {
    return `Al reanudar se carga ${formatPeriodLong(current)} (${formatDisplayDate(occurredOn)}).`
  }

  const next = nextChargeDate(
    { status: 'active', billingDay: subscription.billingDay, generateFromPeriod: floor, endPeriod },
    alreadyGenerated,
    today,
  )
  return next ? `Próximo cobro: ${formatDisplayDate(next)}.` : (noMoreCharges ?? '')
}

/** Aviso al reanudar (US-57): con `generated_after` > 0 se cargó el gasto del período corriente (R5). */
export function resumedNoticeText(generatedAfter: number, today: Date): string {
  return generatedAfter > 0
    ? `Suscripción reanudada. Se cargó el gasto de ${formatPeriodLong(currentPeriod(today))}.`
    : 'Suscripción reanudada'
}

/**
 * US-58 CA-5: el N del diálogo de cancelar es lo que queda después de confirmar: las transacciones
 * vigentes de la suscripción (sin `deleted_at`) más los meses vencidos que la cancelación genera antes,
 * que son los no bloqueados (R6). Sin los tipos de cambio leídos no se puede saber cuántos genera una
 * suscripción en USD y se cuentan solo las vigentes.
 */
export function expensesKeptOnCancel(
  liveTransactions: number,
  subscription: Pick<SubscriptionRecord, 'status' | 'amount' | 'currency' | 'billingDay' | 'generateFromPeriod' | 'endPeriod'>,
  alreadyGenerated: ReadonlySet<string>,
  fxRatesByPeriod: ReadonlyMap<string, Decimal> | null,
  today: Date,
): number {
  if (subscription.currency === 'USD' && !fxRatesByPeriod) return liveTransactions
  const due = computeDueOccurrences(
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
  return liveTransactions + due.length
}

/**
 * Texto del diálogo de cancelar (US-58). `kept` es el N de `expensesKeptOnCancel`; null si no se pudo
 * contar, y entonces la oración no promete un número.
 */
export function cancelWarningText(kept: number | null): string {
  const keptSentence =
    kept === null
      ? 'Los gastos ya cargados se mantienen.'
      : kept === 0
        ? 'Todavía no se cargó ningún gasto.'
        : kept === 1
          ? 'El gasto ya cargado se mantiene.'
          : `Los ${kept} gastos ya cargados se mantienen.`
  return `No se van a cargar más gastos. ${keptSentence} No se puede deshacer: para volver a registrarla, creá una suscripción nueva.`
}

/** Aviso al cancelar (US-58). Con gastos atrasados que se generaron antes de cancelar, los cuenta. */
export function cancelledNoticeText(generatedBefore: number): string {
  return generatedBefore > 0 ? `Suscripción cancelada. ${beforeText(generatedBefore)}` : 'Suscripción cancelada'
}
