// Suscripciones bloqueadas (US-62, ADR-031 §6). Puro: sin red ni reloj, `today` por parámetro (C1).
// "Bloqueada" no se guarda: se deriva al leer con `evaluateOccurrences`, la misma regla que usa la
// puesta al día (R1 a R6, ADR-030), así que el aviso nunca contradice lo que el servidor genera.
import { formatArs, parseMoney, type Decimal } from './money'
import { formatPeriod, type Period } from './period'
import { periodListText } from './subscriptionOperations'
import { evaluateOccurrences, MIN_AMOUNT, type BlockReason, type SubscriptionRecord } from './subscriptions'
import { MAX_AMOUNT } from './validation'

/** Un período vencido de una suscripción activa que no se pudo generar. */
export interface BlockedOccurrence {
  period: Period
  reason: BlockReason
}

/**
 * Los períodos bloqueados de una suscripción, del más viejo al más nuevo. Una pausada o cancelada no
 * está bloqueada (R3), ni una USD cuyo único mes sin tipo de cambio es el corriente antes de su día de
 * cobro (R5); una ARS tampoco, salvo que su monto quede fuera de rango. Sin los tipos de cambio del
 * usuario (no se pudieron leer) una USD no se puede juzgar y queda sin marca: es un aviso (ADR-031).
 */
export function blockedOccurrences(
  subscription: Pick<
    SubscriptionRecord,
    'status' | 'amount' | 'currency' | 'billingDay' | 'generateFromPeriod' | 'endPeriod'
  >,
  alreadyGenerated: ReadonlySet<string>,
  fxRatesByPeriod: ReadonlyMap<string, Decimal> | null,
  today: Date,
): BlockedOccurrence[] {
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
  ).flatMap((e) => (e.blockedBy ? [{ period: e.period, reason: e.blockedBy }] : []))
}

/**
 * Los bloqueos de cada suscripción de la lista, por id. Sin los períodos ya generados (no se pudieron
 * leer) no se puede juzgar ninguna y el mapa queda vacío; sin los tipos de cambio solo se juzga una ARS.
 */
export function blockedBySubscription(
  subscriptions: ReadonlyArray<Pick<SubscriptionRecord, 'id'> & Parameters<typeof blockedOccurrences>[0]>,
  generatedBySubscription: ReadonlyMap<string, ReadonlySet<string>> | null,
  fxRatesByPeriod: ReadonlyMap<string, Decimal> | null,
  today: Date,
): Map<string, BlockedOccurrence[]> {
  const blocked = new Map<string, BlockedOccurrence[]>()
  if (!generatedBySubscription) return blocked
  for (const subscription of subscriptions) {
    blocked.set(
      subscription.id,
      blockedOccurrences(subscription, generatedBySubscription.get(subscription.id) ?? new Set(), fxRatesByPeriod, today),
    )
  }
  return blocked
}

export const BLOCKED_FX_MARK = 'Falta tipo de cambio'
export const BLOCKED_RANGE_MARK = 'No se pudo cargar'

/**
 * La marca de la fila en Suscripciones. Si falta el tipo de cambio de algún mes, esa es la marca (es lo
 * que el usuario puede arreglar); si solo hay montos fuera de rango, "No se pudo cargar". null si no
 * está bloqueada.
 */
export function blockedMark(blocked: readonly BlockedOccurrence[]): { reason: BlockReason; text: string } | null {
  if (blocked.length === 0) return null
  return blocked.some((b) => b.reason === 'missing_fx_rate')
    ? { reason: 'missing_fx_rate', text: BLOCKED_FX_MARK }
    : { reason: 'amount_ars_out_of_range', text: BLOCKED_RANGE_MARK }
}

export interface BlockedNotice {
  /** Un párrafo por motivo; casi siempre uno solo. */
  paragraphs: string[]
  /** `YYYY-MM` del mes más viejo sin tipo de cambio, adonde lleva "Cargar tipo de cambio"; null si no falta ninguno. */
  fxPeriod: string | null
}

const missingFxText = (periods: readonly Period[]): string =>
  periods.length === 1
    ? `Falta el tipo de cambio de ${periodListText(periods)}. Ese mes no se cargó; se carga en cuanto lo cargues.`
    : `Falta el tipo de cambio de ${periodListText(periods)}. Esos meses no se cargaron; se cargan en cuanto los cargues.`

const outOfRangeText = (periods: readonly Period[]): string => {
  const limits = `${formatArs(MAX_AMOUNT)} (o no llega${periods.length === 1 ? '' : 'n'} a ${formatArs(MIN_AMOUNT)})`
  return periods.length === 1
    ? `El gasto de ${periodListText(periods)} no se pudo cargar porque en pesos supera ${limits}. Revisá el monto o el tipo de cambio de ese mes.`
    : `Los gastos de ${periodListText(periods)} no se pudieron cargar porque en pesos superan ${limits}. Revisá el monto o el tipo de cambio de esos meses.`
}

/** El aviso del Detalle (US-62). null si la suscripción no está bloqueada. */
export function blockedNotice(blocked: readonly BlockedOccurrence[]): BlockedNotice | null {
  const missing = blocked.filter((b) => b.reason === 'missing_fx_rate').map((b) => b.period)
  const outOfRange = blocked.filter((b) => b.reason === 'amount_ars_out_of_range').map((b) => b.period)
  const paragraphs = [
    ...(missing.length > 0 ? [missingFxText(missing)] : []),
    ...(outOfRange.length > 0 ? [outOfRangeText(outOfRange)] : []),
  ]
  if (paragraphs.length === 0) return null
  return { paragraphs, fxPeriod: missing.length > 0 ? formatPeriod(missing[0]) : null }
}
