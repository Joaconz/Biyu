import { MAX_FX_RATE, type Currency } from './fx'
import { convertToArs, Decimal, prorate } from './money'
import { validateSharedDebt, type SharedDebtInput } from './sharedDebt'

export const MAX_INSTALLMENTS = 12
/** El máximo de numeric(14,2), la columna de amount y de amount_ars (DEF-012). */
export const MAX_AMOUNT = new Decimal('999999999999.99')

export interface TransactionDraft {
  type: 'expense' | 'income'
  amount: Decimal | null
  currency: Currency
  fxRate: Decimal | null
  categoryId: string | null
  accountId: string | null
  accountType: 'credit_card' | 'debit_card' | 'cash' | 'bank_account' | 'wallet' | null
  installmentsCount: number
  occurredOn: string // YYYY-MM-DD
  description: string | null
  /** Deuda vinculada de un gasto compartido (US-34, ADR-036); null o ausente si no se comparte. */
  shared?: SharedDebtInput | null
}

export type DraftField =
  | 'amount'
  | 'fxRate'
  | 'categoryId'
  | 'accountId'
  | 'installmentsCount'
  | 'occurredOn'
  | 'description'
  | 'sharedPerson'
  | 'sharedAmount'
export type DraftErrors = Partial<Record<DraftField, string>>

/** I6: solo un gasto con tarjeta de crédito admite más de una cuota (US-14). */
export function allowsInstallments({ type, accountType }: Pick<TransactionDraft, 'type' | 'accountType'>): boolean {
  return type === 'expense' && accountType === 'credit_card'
}

// Copia UX de lo que valida create_transaction (C6): la fuente de verdad es Postgres.
export function validateTransactionDraft(draft: TransactionDraft, today: string): DraftErrors {
  const errors: DraftErrors = {}
  if (!draft.amount || !draft.amount.isFinite() || draft.amount.lte(0)) {
    errors.amount = 'El monto debe ser mayor a cero' // I4
  } else if (draft.amount.decimalPlaces() > 2) {
    errors.amount = 'El monto admite hasta 2 decimales'
  } else if (draft.amount.gt(MAX_AMOUNT)) {
    errors.amount = 'El monto máximo es $999.999.999.999,99' // DEF-012
  }
  if (draft.currency === 'USD' && (!draft.fxRate || draft.fxRate.lte(0))) {
    errors.fxRate = 'Falta el tipo de cambio' // I5
  } else if (draft.currency === 'USD' && draft.fxRate!.decimalPlaces() > 4) {
    errors.fxRate = 'Usá hasta 4 decimales' // DEF-018: numeric(14,4), igual que en Ajustes
  } else if (draft.currency === 'USD' && draft.fxRate!.gt(MAX_FX_RATE)) {
    errors.fxRate = 'El tipo de cambio es demasiado grande'
  }
  // amount_ars también es numeric(14,2): en USD, el equivalente en pesos tiene que entrar (DEF-012).
  if (!errors.amount && !errors.fxRate && draft.currency === 'USD' && draft.amount && draft.fxRate) {
    if (convertToArs(draft.amount, draft.fxRate).gt(MAX_AMOUNT)) {
      errors.amount = 'En pesos daría más que el máximo de $999.999.999.999,99'
    }
  }
  if (draft.currency === 'ARS' && draft.fxRate) {
    errors.fxRate = 'Una transacción en ARS no lleva tipo de cambio' // I5
  }
  if (draft.type === 'expense' && !draft.categoryId) errors.categoryId = 'Elegí una categoría' // I8
  if (!draft.accountId) errors.accountId = 'Elegí una cuenta'
  if (
    !Number.isInteger(draft.installmentsCount) ||
    draft.installmentsCount < 1 ||
    draft.installmentsCount > MAX_INSTALLMENTS
  ) {
    errors.installmentsCount = `Las cuotas van de 1 a ${MAX_INSTALLMENTS}`
  } else if (draft.installmentsCount > 1 && !allowsInstallments(draft)) {
    errors.installmentsCount = 'Solo los gastos con tarjeta de crédito admiten cuotas' // I6
  } else if (!errors.amount && !errors.fxRate && draft.amount && hasEmptyInstallment(draft)) {
    // I4 por cuota. Con una sola cuota el selector no se muestra (o no cambia nada): lo que no
    // llega a 0,01 es el equivalente en pesos, y el error va al monto para que se vea (DEF-013).
    if (draft.installmentsCount === 1) {
      errors.amount = 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'
    } else {
      errors.installmentsCount = 'Con ese monto, cada cuota daría menos de 0,01'
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.occurredOn)) errors.occurredOn = 'Fecha inválida'
  else if (draft.occurredOn > today) errors.occurredOn = 'La fecha no puede ser futura'
  // Un ingreso no se comparte: si llegara una deuda, create_transaction la rechaza igual.
  if (draft.type === 'expense' && draft.shared) Object.assign(errors, validateSharedDebt(draft.shared, draft))
  return errors
}

// Misma regla que create_transaction: la cuota base (truncada) tiene que ser al menos 0,01, en
// la moneda de la transacción y en ARS por separado (C3, ADR-013).
function hasEmptyInstallment({ amount, currency, fxRate, installmentsCount }: TransactionDraft): boolean {
  if (!amount) return false
  const totals = currency === 'USD' && fxRate ? [amount, convertToArs(amount, fxRate)] : [amount]
  return totals.some((total) => prorate(total, installmentsCount)[0].lte(0))
}
