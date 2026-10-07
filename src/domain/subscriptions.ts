// Suscripciones (docs/06-suscripciones.md, ADR-030 a ADR-032). Puro: sin red, sin reloj; `today`
// entra por parámetro (C1) y es el hoy de Argentina (ADR-031 §7). Postgres repite cada validación
// en create_subscription con los mismos mensajes (C6).
import type { Currency } from './fx'
import { convertToArs, Decimal, formatArs, formatUsdCode, tryParseMoney } from './money'
import {
  addMonths,
  argentinaDateOf,
  currentPeriod,
  daysInMonth,
  formatDisplayDate,
  formatPeriod,
  formatPeriodLong,
  isPeriodBefore,
  isSamePeriod,
  parsePeriod,
  toIsoDate,
  type Period,
} from './period'
import { MAX_AMOUNT } from './validation'

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

/** Una suscripción como la lee la app. Los montos quedan como string hasta formatearlos (C2). */
export interface SubscriptionRecord {
  id: string
  name: string
  amount: string
  currency: Currency
  categoryName: string
  accountName: string
  billingDay: number
  startPeriod: Period
  endPeriod: Period | null
  status: SubscriptionStatus
  pausedAt: string | null
  cancelledAt: string | null
  description: string | null
}

// ---------------------------------------------------------------------------
// Puesta al día (ADR-017, docs/06-suscripciones.md R1–R7)
// ---------------------------------------------------------------------------
// La que persiste es catch_up_subscriptions, en Postgres (ADR-030); esta es la misma regla para que
// la app calcule sin escribir (próximo cobro, vista previa, bloqueadas). Las dos tienen que dar las
// mismas fechas (US-54 CA-5).

/** Lo que la puesta al día necesita de una suscripción: sus valores actuales (R7). */
export interface SubscriptionState {
  status: SubscriptionStatus
  amount: Decimal
  currency: Currency
  billingDay: number
  generateFromPeriod: Period
  endPeriod: Period | null
}

export interface OccurrenceDraft {
  /** Período al que se imputa; también es `subscription_period`. */
  period: Period
  /** Fecha real del cargo, `YYYY-MM-DD` (R4). */
  occurredOn: string
  amount: Decimal
  currency: Currency
  /** El de `fx_rates` de ese período; null si es ARS (C5). */
  fxRate: Decimal | null
}

/** R4: el día de cobro, recortado al último día del mes. Nunca se corre al mes siguiente. */
export function occurrenceDate(period: Period, billingDay: number): string {
  return `${formatPeriod(period)}-${String(Math.min(billingDay, daysInMonth(period))).padStart(2, '0')}`
}

const MIN_AMOUNT = new Decimal('0.01')

/**
 * Las ocurrencias vencidas que faltan generar. `alreadyGenerated` y `fxRatesByPeriod` van por
 * `YYYY-MM`: un `Set<Period>` compararía objetos, no meses.
 *   R1  de `generateFromPeriod` a min(período de `today`, `endPeriod`), inclusive.
 *   R2  se saltea un período ya generado, aunque esa transacción se haya borrado.
 *   R3  solo una suscripción activa genera.
 *   R5  el período corriente, solo si `today` ya llegó al día de cobro.
 *   R6  en USD, un período sin tipo de cambio no se genera (queda bloqueado).
 * Como en Postgres, tampoco se genera un período cuyo monto en pesos queda fuera de numeric(14,2)
 * o redondea a $0,00 (ADR-030).
 */
export function computeDueOccurrences(
  subscription: SubscriptionState,
  alreadyGenerated: ReadonlySet<string>,
  fxRatesByPeriod: ReadonlyMap<string, Decimal>,
  today: Date,
): OccurrenceDraft[] {
  if (subscription.status !== 'active') return []
  const current = currentPeriod(today)
  const last = subscription.endPeriod && isPeriodBefore(subscription.endPeriod, current) ? subscription.endPeriod : current
  const todayIso = toIsoDate(today)
  const drafts: OccurrenceDraft[] = []
  for (let period = subscription.generateFromPeriod; !isPeriodBefore(last, period); period = addMonths(period, 1)) {
    const key = formatPeriod(period)
    if (alreadyGenerated.has(key)) continue
    const occurredOn = occurrenceDate(period, subscription.billingDay)
    if (isSamePeriod(period, current) && todayIso < occurredOn) continue
    const fxRate = subscription.currency === 'USD' ? (fxRatesByPeriod.get(key) ?? null) : null
    if (subscription.currency === 'USD' && !fxRate) continue
    const amountArs = convertToArs(subscription.amount, fxRate)
    if (amountArs.lt(MIN_AMOUNT) || amountArs.gt(MAX_AMOUNT)) continue
    drafts.push({ period, occurredOn, amount: subscription.amount, currency: subscription.currency, fxRate })
  }
  return drafts
}

/** ADR-031 §2: lo máximo que la carga espera a la puesta al día antes de mostrar la pantalla. */
export const CATCHUP_TIMEOUT_MS = 8000

/** Aviso de la puesta al día (US-53): null si no creó nada, porque entonces no hay aviso. */
export function catchupGeneratedText(generated: number): string | null {
  if (generated <= 0) return null
  if (generated === 1) return 'Se cargó 1 gasto de suscripciones'
  return `Se cargaron ${generated} gastos de suscripciones`
}

// ---------------------------------------------------------------------------
// Alta (US-52, ADR-032)
// ---------------------------------------------------------------------------

export const MAX_NAME_LENGTH = 60
export const MAX_DESCRIPTION_LENGTH = 200
export const MAX_END_PERIOD: Period = { year: 2099, month: 12 }
/** El mes de inicio va de 24 meses antes del corriente a 12 después, inclusive (ADR-032). */
const START_MONTHS_BEFORE = 24
const START_MONTHS_AFTER = 12

/** Largo como lo cuenta `char_length` de Postgres: puntos de código, no unidades UTF-16 (un emoji es 1). */
export function codePointLength(value: string): number {
  return [...value].length
}

/** Corta un texto a `max` puntos de código: el campo "no deja escribir más" (US-52). */
export function limitCodePoints(value: string, max: number): string {
  const points = [...value]
  return points.length > max ? points.slice(0, max).join('') : value
}

/** Día de cobro mientras se escribe: solo dígitos y como mucho 2. Lo demás no se escribe (CA-4). */
export function acceptBillingDayInput(next: string, previous: string): string {
  return /^\d{0,2}$/.test(next) ? next : previous
}

export function startPeriodRange(today: Date): { min: Period; max: Period } {
  const current = currentPeriod(today)
  return { min: addMonths(current, -START_MONTHS_BEFORE), max: addMonths(current, START_MONTHS_AFTER) }
}

/** Lo que tiene cargado el formulario, tal cual: texto de los inputs y `YYYY-MM` de los meses. */
export interface SubscriptionFormValues {
  name: string
  amount: string
  currency: Currency
  categoryId: string
  accountId: string
  billingDay: string
  startPeriod: string
  endPeriod: string
  description: string
}

/** Lo que viaja a create_subscription, ya limpio. */
export interface SubscriptionDraft {
  name: string
  amount: Decimal
  currency: Currency
  categoryId: string
  accountId: string
  billingDay: number
  startPeriod: Period
  endPeriod: Period | null
  description: string | null
}

export type SubscriptionField =
  | 'name'
  | 'amount'
  | 'categoryId'
  | 'accountId'
  | 'billingDay'
  | 'startPeriod'
  | 'endPeriod'
  | 'description'
export type SubscriptionErrors = Partial<Record<SubscriptionField, string>>

export function emptySubscriptionForm(today: Date): SubscriptionFormValues {
  return {
    name: '',
    amount: '',
    currency: 'ARS',
    categoryId: '',
    accountId: '',
    billingDay: '',
    startPeriod: formatPeriod(currentPeriod(today)),
    endPeriod: '',
    description: '',
  }
}

/** Mensajes de la tabla de US-52, en el mismo orden de campos que el formulario. */
export function validateSubscriptionForm(
  values: SubscriptionFormValues,
  today: Date,
): { errors: SubscriptionErrors; draft: SubscriptionDraft | null } {
  const errors: SubscriptionErrors = {}

  const name = values.name.trim()
  if (!name) errors.name = 'Escribí un nombre'
  else if (codePointLength(name) > MAX_NAME_LENGTH) errors.name = 'El nombre admite hasta 60 caracteres'

  const amount = tryParseMoney(values.amount)
  if (!amount || !amount.isFinite() || amount.lte(0)) errors.amount = 'El monto debe ser mayor a cero'
  else if (amount.decimalPlaces() > 2) errors.amount = 'El monto admite hasta 2 decimales'
  else if (amount.gt(MAX_AMOUNT)) {
    errors.amount = `El monto máximo es ${subscriptionAmountText(MAX_AMOUNT.toFixed(), values.currency)}`
  }

  if (!values.categoryId) errors.categoryId = 'Elegí una categoría'
  if (!values.accountId) errors.accountId = 'Elegí un medio de pago'

  const billingDay = /^\d+$/.test(values.billingDay) ? Number(values.billingDay) : null
  if (!values.billingDay) errors.billingDay = 'Indicá el día de cobro'
  else if (billingDay === null || billingDay < 1 || billingDay > 31) errors.billingDay = 'El día de cobro va de 1 a 31'

  const start = parsePeriod(values.startPeriod)
  const range = startPeriodRange(today)
  if (!start) errors.startPeriod = 'Elegí el mes de inicio'
  else if (isPeriodBefore(start, range.min) || isPeriodBefore(range.max, start)) {
    errors.startPeriod = `El mes de inicio va de ${formatPeriodLong(range.min)} a ${formatPeriodLong(range.max)}`
  }

  const end = values.endPeriod ? parsePeriod(values.endPeriod) : null
  if (values.endPeriod && !end) errors.endPeriod = 'Elegí un mes de fin válido o dejalo sin fin'
  else if (end && start && isPeriodBefore(end, start)) errors.endPeriod = 'El mes de fin no puede ser anterior al de inicio'
  else if (end && isPeriodBefore(MAX_END_PERIOD, end)) errors.endPeriod = 'El mes de fin puede ser como máximo diciembre 2099'

  const description = values.description.trim()
  if (codePointLength(description) > MAX_DESCRIPTION_LENGTH) {
    errors.description = 'La descripción admite hasta 200 caracteres'
  }

  if (Object.keys(errors).length > 0 || !amount || billingDay === null || !start) return { errors, draft: null }
  return {
    errors,
    draft: {
      name,
      amount,
      currency: values.currency,
      categoryId: values.categoryId,
      accountId: values.accountId,
      billingDay,
      startPeriod: start,
      endPeriod: end,
      description: description || null,
    },
  }
}

// Rechazos de create_subscription que van debajo de un campo (CA-8, CA-15). El resto se muestra
// como "No se pudo guardar: <motivo>".
const FIELD_OF_MESSAGE: ReadonlyArray<[RegExp, SubscriptionField]> = [
  [/^(Escribí un nombre|El nombre admite hasta 60 caracteres|Ya tenés una suscripción con ese nombre)$/, 'name'],
  [/^El monto /, 'amount'],
  [/^(Elegí una categoría|La categoría no está disponible)$/, 'categoryId'],
  [/^(Elegí un medio de pago|El medio de pago no está disponible)$/, 'accountId'],
  [/^(Indicá el día de cobro|El día de cobro va de 1 a 31)$/, 'billingDay'],
  [/^(Elegí el mes de inicio|El mes de inicio )/, 'startPeriod'],
  [/^El mes de fin /, 'endPeriod'],
  [/^La descripción admite hasta 200 caracteres$/, 'description'],
]

export function fieldOfSaveError(message: string): SubscriptionField | null {
  return FIELD_OF_MESSAGE.find(([re]) => re.test(message))?.[1] ?? null
}

export const DUPLICATE_NAME_MESSAGE = 'Ya tenés una suscripción con ese nombre'

/** Aviso al guardar: CA-1, con N = `generated` de la RPC. */
export function savedNoticeText(generated: number): string {
  if (generated <= 0) return 'Suscripción guardada'
  if (generated === 1) return 'Suscripción guardada. Se cargó 1 gasto vencido.'
  return `Suscripción guardada. Se cargaron ${generated} gastos vencidos.`
}

// ---------------------------------------------------------------------------
// Lista y detalle (US-52)
// ---------------------------------------------------------------------------

/** "$5.000,00" o "USD 10,00" (formatos de entrega-2/historias/suscripciones.md). */
export function subscriptionAmountText(amount: string, currency: Currency): string {
  const value = new Decimal(amount)
  return currency === 'USD' ? formatUsdCode(value) : formatArs(value)
}

export function billingDayText(billingDay: number): string {
  return `Se cobra el día ${billingDay}`
}

/** Terminada: `end_period` anterior al período corriente. No es un estado; sigue en "Activas" (ADR-032). */
export function isEnded(subscription: Pick<SubscriptionRecord, 'endPeriod'>, today: Date): boolean {
  return subscription.endPeriod !== null && isPeriodBefore(subscription.endPeriod, currentPeriod(today))
}

export function endedText(endPeriod: Period): string {
  return `Terminó en ${formatPeriodLong(endPeriod)}`
}

export interface SubscriptionGroup {
  status: SubscriptionStatus
  label: string
  items: SubscriptionRecord[]
}

const GROUPS: ReadonlyArray<Pick<SubscriptionGroup, 'status' | 'label'>> = [
  { status: 'active', label: 'Activas' },
  { status: 'paused', label: 'Pausadas' },
  { status: 'cancelled', label: 'Canceladas' },
]

/** Activas, Pausadas y Canceladas, solo las que tienen filas; dentro, por nombre sin distinguir mayúsculas. */
export function groupSubscriptions(subscriptions: readonly SubscriptionRecord[]): SubscriptionGroup[] {
  const byName = (a: SubscriptionRecord, b: SubscriptionRecord) =>
    a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }) || a.id.localeCompare(b.id)
  return GROUPS.map((group) => ({
    ...group,
    items: subscriptions.filter((s) => s.status === group.status).sort(byName),
  })).filter((group) => group.items.length > 0)
}

/**
 * "Activa", "Pausada desde 01/10/2026" o "Cancelada el 02/09/2026", con la fecha en hora de Argentina.
 * I15 garantiza la fecha; sin ella igual se dice el estado, para no contradecir a `data-status`.
 */
export function statusText(subscription: Pick<SubscriptionRecord, 'status' | 'pausedAt' | 'cancelledAt'>): string {
  const on = (instant: string | null) => (instant ? formatDisplayDate(argentinaDateOf(instant)) : null)
  switch (subscription.status) {
    case 'paused': {
      const date = on(subscription.pausedAt)
      return date ? `Pausada desde ${date}` : 'Pausada'
    }
    case 'cancelled': {
      const date = on(subscription.cancelledAt)
      return date ? `Cancelada el ${date}` : 'Cancelada'
    }
    case 'active':
      return 'Activa'
  }
}
