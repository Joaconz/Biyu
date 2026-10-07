import type { Currency } from './fx'
import { convertToArs, Decimal, formatArs, formatUsd, tryParseMoney } from './money'

/** Largo máximo de la persona, igual que create_transaction (ADR-036 §5). */
export const MAX_PERSON_LENGTH = 60

/**
 * Lo que tiene cargado la sección "Gasto compartido" (US-34), como lo tipeó el usuario. Solo
 * existe en el borrador si el gasto está marcado como compartido; un ingreso nunca la lleva.
 */
export interface SharedDebtInput {
  person: string
  amount: string
}

export interface SharedDebtErrors {
  sharedPerson?: string
  sharedAmount?: string
}

/** La deuda lista para create_transaction: persona recortada y monto en Decimal (C2). */
export interface SharedDebt {
  person: string
  amount: Decimal
}

const formatIn = (currency: Currency, amount: Decimal) =>
  currency === 'USD' ? formatUsd(amount) : formatArs(amount)

/**
 * Copia UX de lo que valida create_transaction para la deuda vinculada (C6, ADR-036): la fuente de
 * verdad es Postgres. Recorta con String.prototype.trim, la misma clase de caracteres que la RPC.
 * El tope "no puede superar el gasto" (US-41) se compara en la moneda del gasto, que es la de la
 * deuda (ADR-036); sin un monto de gasto válido no se chequea: ese error ya lo marca el paso 1.
 */
export function validateSharedDebt(
  input: SharedDebtInput,
  expense: { amount: Decimal | null; currency: Currency; fxRate: Decimal | null },
): SharedDebtErrors {
  const errors: SharedDebtErrors = {}
  if (input.person.trim() === '') errors.sharedPerson = 'Ingresá con quién compartiste el gasto'

  const text = input.amount.trim()
  const amount = tryParseMoney(text)
  if (text === '') {
    errors.sharedAmount = 'Ingresá cuánto te debe'
  } else if (!amount) {
    errors.sharedAmount = 'Ingresá un número válido'
  } else if (amount.lte(0)) {
    errors.sharedAmount = 'El monto debe ser mayor a cero' // I4
  } else if (amount.decimalPlaces() > 2) {
    errors.sharedAmount = 'El monto admite hasta 2 decimales'
  } else if (expense.amount && expense.amount.isFinite() && expense.amount.gt(0) && amount.gt(expense.amount)) {
    errors.sharedAmount = `No puede superar el monto del gasto (${formatIn(expense.currency, expense.amount)})` // I7
  } else if (expense.currency === 'USD' && expense.fxRate && expense.fxRate.gt(0)) {
    // amount_ars de la deuda es numeric(14,2) con CHECK > 0 (DEF-013).
    if (convertToArs(amount, expense.fxRate).lte(0)) {
      errors.sharedAmount = 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'
    }
  }
  return errors
}

/** La deuda a mandar, o null si todavía no es válida (no se guarda nada que el cliente rechace). */
export function toSharedDebt(input: SharedDebtInput): SharedDebt | null {
  const person = input.person.trim()
  const amount = tryParseMoney(input.amount)
  return person && amount && amount.gt(0) ? { person, amount } : null
}

/**
 * La deuda que viaja con el gasto, o null: solo un gasto se comparte (ADR-036 §3), y solo si la
 * sección tiene persona y monto válidos.
 */
export function debtOfDraft(draft: { type: 'expense' | 'income'; shared?: SharedDebtInput | null }): SharedDebt | null {
  return draft.type === 'expense' && draft.shared ? toSharedDebt(draft.shared) : null
}

/** "Sofía te va a deber $60.000,00 · Tu parte: $60.000,00", en la moneda del gasto. */
export function sharedDebtSummary(debt: SharedDebt, expenseAmount: Decimal, currency: Currency): string {
  return `${debt.person} te va a deber ${formatIn(currency, debt.amount)} · Tu parte: ${formatIn(
    currency,
    expenseAmount.minus(debt.amount),
  )}`
}

/** Resumen a mostrar bajo la sección, o null mientras persona, monto o el gasto no sean válidos. */
export function sharedDebtPreview(input: SharedDebtInput, expenseAmount: string, currency: Currency): string | null {
  const debt = toSharedDebt(input)
  const total = tryParseMoney(expenseAmount)
  return debt && total ? sharedDebtSummary(debt, total, currency) : null
}

/** Descripción del aviso "Gasto guardado": "Sofía te debe $60.000,00" (o US$ si el gasto es en dólares). */
export function sharedDebtSavedMessage(debt: SharedDebt, currency: Currency): string {
  return `${debt.person} te debe ${formatIn(currency, debt.amount)}`
}

/** Etiqueta de la fila de un gasto compartido en Movimientos y en el Resumen (US-35): "Compartido con Sofía". */
export function sharedExpenseLabel(person: string): string {
  return `Compartido con ${person}`
}

/**
 * Línea del diálogo de borrado de un gasto con deuda vinculada (US-35, ADR-037 §4): la deuda deja de
 * contar mientras el gasto esté eliminado. El monto va en la moneda del gasto, que es la de la deuda.
 */
export function deletionDebtWarning(debt: SharedDebt, currency: Currency): string {
  return `También deja de contar la deuda con ${debt.person} por ${formatIn(currency, debt.amount)}.`
}
