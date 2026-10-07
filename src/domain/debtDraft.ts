import type { DebtDirection } from './debts'
import { MAX_FX_RATE, type Currency } from './fx'
import { convertToArs, Decimal, formatArs, formatRate, parseMoney, tryParseMoney } from './money'
import { isSamePeriod, isValidIsoDate, tryPeriodOf, type Period } from './period'
import { MAX_PERSON_LENGTH } from './sharedDebt'
import { MAX_AMOUNT } from './validation'

/** Largo máximo de la nota, igual que create_debt (ADR-037 §2). */
export const MAX_NOTES_LENGTH = 200
export { MAX_PERSON_LENGTH }

/**
 * Lo que tiene cargado "Nueva deuda" (US-36), como lo tipeó el usuario: los montos quedan como
 * texto hasta pasar por decimal.js (C2).
 */
export interface DebtDraftInput {
  direction: DebtDirection
  person: string
  amount: string
  currency: Currency
  fxRate: string
  incurredOn: string // YYYY-MM-DD
  notes: string
}

export type DebtDraftField = 'person' | 'amount' | 'fxRate' | 'incurredOn'
export type DebtDraftErrors = Partial<Record<DebtDraftField, string>>

/** Orden en pantalla: el motivo junto a "Guardar deuda" es el del primero de estos con error. */
export const DEBT_DRAFT_FIELDS: readonly DebtDraftField[] = ['person', 'amount', 'fxRate', 'incurredOn']

/** La deuda lista para create_debt: persona y nota recortadas, montos en Decimal (C2). */
export interface NewDebt {
  direction: DebtDirection
  person: string
  amount: Decimal
  currency: Currency
  fxRate: Decimal | null
  incurredOn: string
  notes: string | null
}

/** Estado inicial (CA-1): "Me deben", ARS y la fecha de hoy (`today` entra por parámetro, C1). */
export function emptyDebtDraftInput(today: string): DebtDraftInput {
  return { direction: 'owed_to_me', person: '', amount: '', currency: 'ARS', fxRate: '', incurredOn: today, notes: '' }
}

/**
 * Copia UX de lo que valida create_debt (C6): la fuente de verdad es Postgres. Los mensajes y su
 * orden son los de la tabla de US-36; las reglas de monto y TC, las de validateTransactionDraft
 * (DEF-012, DEF-013, DEF-018). Recorta con String.prototype.trim, la misma clase que trim_js.
 */
export function validateDebtDraft(input: DebtDraftInput, today: string): DebtDraftErrors {
  const errors: DebtDraftErrors = {}
  if (input.person.trim() === '') errors.person = 'Ingresá el nombre de la persona'

  const amountText = input.amount.trim()
  const amount = tryParseMoney(amountText)
  if (amountText === '') errors.amount = 'Ingresá el monto'
  else if (!amount) errors.amount = 'Ingresá un número válido'
  else if (amount.lte(0)) errors.amount = 'El monto debe ser mayor a cero' // I4
  else if (amount.decimalPlaces() > 2) errors.amount = 'El monto admite hasta 2 decimales'
  else if (amount.gt(MAX_AMOUNT)) {
    errors.amount = `El monto máximo es ${input.currency === 'USD' ? 'US$' : '$'}999.999.999.999,99` // DEF-012
  }

  let fxRate: Decimal | null = null
  if (input.currency === 'USD') {
    const fxText = input.fxRate.trim()
    fxRate = tryParseMoney(fxText)
    if (fxText === '') errors.fxRate = 'Falta el tipo de cambio' // I5
    else if (!fxRate) errors.fxRate = 'Ingresá un número válido'
    else if (fxRate.lte(0)) errors.fxRate = 'El tipo de cambio debe ser mayor a cero'
    else if (fxRate.decimalPlaces() > 4) errors.fxRate = 'Usá hasta 4 decimales' // DEF-018: numeric(14,4)
    else if (fxRate.gt(MAX_FX_RATE)) errors.fxRate = 'El tipo de cambio es demasiado grande'
  }

  // amount_ars es numeric(14,2) con CHECK > 0: el equivalente en pesos tiene que entrar (DEF-012, DEF-013).
  if (!errors.amount && !errors.fxRate && amount && fxRate) {
    const ars = convertToArs(amount, fxRate)
    if (ars.gt(MAX_AMOUNT)) errors.amount = 'En pesos daría más que el máximo de $999.999.999.999,99'
    else if (ars.lte(0)) errors.amount = 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'
  }

  if (!isValidIsoDate(input.incurredOn)) errors.incurredOn = 'Fecha inválida'
  else if (input.incurredOn > today) errors.incurredOn = 'La fecha no puede ser futura'
  return errors
}

/** El primer error en el orden de la pantalla, para `debt-form-hint`; null si no hay. */
export function firstDebtDraftError(errors: DebtDraftErrors): string | null {
  const field = DEBT_DRAFT_FIELDS.find((f) => errors[f])
  return field ? errors[field]! : null
}

/** La deuda a mandar, o null si el borrador todavía no es válido (no se manda nada que el cliente rechace). */
export function toNewDebt(input: DebtDraftInput, today: string): NewDebt | null {
  if (Object.keys(validateDebtDraft(input, today)).length > 0) return null
  const notes = input.notes.trim()
  return {
    direction: input.direction,
    person: input.person.trim(),
    amount: parseMoney(input.amount),
    currency: input.currency,
    // En ARS no viaja tipo de cambio aunque haya quedado algo escrito de cuando era US$ (I5).
    fxRate: input.currency === 'USD' ? parseMoney(input.fxRate) : null,
    incurredOn: input.incurredOn,
    notes: notes ? notes : null,
  }
}

/** "≈ $50.000,00": con US$, monto y TC válidos; si no, null (C5: es lo que se congela al guardar). */
export function debtArsEquivalent(input: DebtDraftInput, errors: DebtDraftErrors): string | null {
  if (input.currency !== 'USD' || errors.amount || errors.fxRate) return null
  const amount = tryParseMoney(input.amount)
  const fxRate = tryParseMoney(input.fxRate)
  return amount && fxRate ? `≈ ${formatArs(convertToArs(amount, fxRate))}` : null
}

/**
 * Aplica el TC de referencia que llegó de forma asíncrona (US-20) solo si el borrador sigue en US$,
 * en el mismo mes del pedido y con el campo vacío: una respuesta tardía no pisa lo que escribió el
 * usuario ni el TC de otro mes (US-21). PostgREST manda "1250.0000"; el campo muestra "1.250,00".
 */
export function applyDebtReferenceRate(
  prev: DebtDraftInput,
  request: { period: Period },
  referenceRate: string | null,
): DebtDraftInput {
  const period = tryPeriodOf(prev.incurredOn)
  if (prev.currency !== 'USD' || !period || !isSamePeriod(period, request.period) || prev.fxRate !== '' || referenceRate === null) {
    return prev
  }
  return { ...prev, fxRate: formatRate(parseMoney(referenceRate)) }
}
