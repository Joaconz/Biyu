import { tryParseMoney } from './money'
import type { TransactionDraft } from './validation'

/**
 * Lo que el formulario de registro tiene cargado, antes de parsear. Los montos quedan como el
 * texto que tipeó el usuario hasta pasar por decimal.js (C2); el resto ya es el valor final.
 */
export interface DraftInput extends Omit<TransactionDraft, 'amount' | 'fxRate'> {
  amount: string
  fxRate: string
}

export type DraftAccount = Pick<DraftInput, 'accountId' | 'accountType'>

const NO_ACCOUNT: DraftAccount = { accountId: null, accountType: null }

/** Estado inicial del formulario: gasto, ARS, contado y la fecha de hoy (`today` entra por parámetro, C1). */
export function emptyDraftInput(today: string, account: DraftAccount = NO_ACCOUNT): DraftInput {
  return {
    type: 'expense',
    amount: '',
    currency: 'ARS',
    fxRate: '',
    categoryId: null,
    accountId: account.accountId,
    accountType: account.accountType,
    installmentsCount: 1,
    occurredOn: today,
  }
}

/** Borrador listo para validateTransactionDraft y createTransaction: montos vacíos o inválidos → null. */
export function parseDraftInput(input: DraftInput): TransactionDraft {
  return { ...input, amount: tryParseMoney(input.amount), fxRate: tryParseMoney(input.fxRate) }
}
