import type { Currency } from './fx'
import { convertToArs, prorate, type Decimal } from './money'

export const MAX_INSTALLMENTS = 12

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
}

export type DraftField = 'amount' | 'fxRate' | 'categoryId' | 'accountId' | 'installmentsCount' | 'occurredOn'
export type DraftErrors = Partial<Record<DraftField, string>>

// Copia UX de lo que valida create_transaction (C6): la fuente de verdad es Postgres.
export function validateTransactionDraft(draft: TransactionDraft, today: string): DraftErrors {
  const errors: DraftErrors = {}
  if (!draft.amount || !draft.amount.isFinite() || draft.amount.lte(0)) {
    errors.amount = 'El monto debe ser mayor a cero' // I4
  } else if (draft.amount.decimalPlaces() > 2) {
    errors.amount = 'El monto admite hasta 2 decimales'
  }
  if (draft.currency === 'USD' && (!draft.fxRate || draft.fxRate.lte(0))) {
    errors.fxRate = 'Falta el tipo de cambio' // I5
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
  } else if (
    draft.installmentsCount > 1 &&
    !(draft.type === 'expense' && draft.accountType === 'credit_card')
  ) {
    errors.installmentsCount = 'Solo los gastos con tarjeta de crédito admiten cuotas' // I6
  } else if (!errors.amount && !errors.fxRate && draft.amount && hasEmptyInstallment(draft)) {
    errors.installmentsCount = 'Con ese monto, cada cuota daría menos de 0,01' // I4 por cuota
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.occurredOn)) errors.occurredOn = 'Fecha inválida'
  else if (draft.occurredOn > today) errors.occurredOn = 'La fecha no puede ser futura'
  return errors
}

// Misma regla que create_transaction: la cuota base (truncada) tiene que ser al menos 0,01, en
// la moneda de la transacción y en ARS por separado (C3, ADR-013).
function hasEmptyInstallment({ amount, currency, fxRate, installmentsCount }: TransactionDraft): boolean {
  if (!amount) return false
  const totals = currency === 'USD' && fxRate ? [amount, convertToArs(amount, fxRate)] : [amount]
  return totals.some((total) => prorate(total, installmentsCount)[0].lte(0))
}
