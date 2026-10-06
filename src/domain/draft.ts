import { formatRate, parseMoney, tryParseMoney } from './money'
import { isSamePeriod, tryPeriodOf, type Period } from './period'
import { allowsInstallments, type TransactionDraft } from './validation'

/**
 * Lo que el formulario de registro tiene cargado, antes de parsear. Los montos quedan como el
 * texto que tipeó el usuario hasta pasar por decimal.js (C2); el resto ya es el valor final.
 */
export interface DraftInput extends Omit<TransactionDraft, 'amount' | 'fxRate' | 'description'> {
  amount: string
  fxRate: string
  description: string
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
    description: '',
  }
}

/** Borrador listo para validateTransactionDraft y createTransaction: montos vacíos o inválidos → null. */
export function parseDraftInput(input: DraftInput): TransactionDraft {
  const trimmed = input.description?.trim()
  return {
    ...input,
    amount: tryParseMoney(input.amount),
    fxRate: tryParseMoney(input.fxRate),
    description: trimmed ? trimmed : null,
  }
}

export interface ActiveAccountOption {
  id: string
  type: DraftAccount['accountType'] | string
}

/**
 * Resuelve la cuenta preseleccionada a partir de la última cuenta usada y la lista de cuentas activas (US-07).
 * Si la última cuenta usada no existe o está archivada (no está entre las activas), no se preselecciona ninguna.
 */
export function resolvePreloadedAccount(
  lastAccountId: string | null | undefined,
  activeAccounts: ActiveAccountOption[],
): DraftAccount {
  if (!lastAccountId) return NO_ACCOUNT
  const active = activeAccounts.find((a) => a.id === lastAccountId)
  if (!active) return NO_ACCOUNT
  return { accountId: active.id, accountType: active.type as DraftAccount['accountType'] }
}

/** Después de guardar: formulario en su estado inicial, conservando la última cuenta usada si sigue activa (US-10, US-07). */
export function draftInputAfterSave(
  saved: DraftInput,
  today: string,
  activeAccounts?: ActiveAccountOption[],
): DraftInput {
  const account: DraftAccount = activeAccounts
    ? resolvePreloadedAccount(saved.accountId, activeAccounts)
    : { accountId: saved.accountId, accountType: saved.accountType }
  return emptyDraftInput(today, account)
}

/**
 * Aplica un cambio del formulario. Si el borrador deja de admitir cuotas (otra cuenta, o pasa a
 * ingreso) y había más de una elegida, vuelven a 1: el selector se oculta y un valor escondido
 * bloquearía el guardado por I6 (US-14). `installmentsReset` avisa que hay que mostrar el aviso.
 */
export function applyDraftChange(
  prev: DraftInput,
  patch: Partial<DraftInput>,
): { values: DraftInput; installmentsReset: boolean } {
  const values = { ...prev, ...patch }
  const installmentsReset = values.installmentsCount > 1 && !allowsInstallments(values)
  return { values: installmentsReset ? { ...values, installmentsCount: 1 } : values, installmentsReset }
}

/**
 * Aplica el TC de referencia que llegó de forma asíncrona solo si el usuario sigue en el mismo
 * borrador USD y todavía no escribió un valor propio. Así una respuesta tardía no pisa un override
 * manual ni el TC de otro mes (US-20, punto de extensión para US-21).
 */
export function applyReferenceRateSuggestion(
  prev: DraftInput,
  request: { currency: DraftInput['currency']; period: Period },
  referenceRate: string | null,
): DraftInput {
  const draftPeriod = tryPeriodOf(prev.occurredOn)
  if (
    prev.currency !== 'USD' ||
    request.currency !== 'USD' ||
    !draftPeriod ||
    !isSamePeriod(draftPeriod, request.period) ||
    prev.fxRate !== ''
  ) {
    return prev
  }

  // DEF-020: PostgREST devuelve "1250.0000"; el campo lo muestra como el resto de la app ("1.250,00").
  return referenceRate === null ? prev : { ...prev, fxRate: formatRate(parseMoney(referenceRate)) }
}

/**
 * Indica si el TC válido del borrador difiere de la referencia mensual (US-21).
 * La comparación pasa por Decimal para que formatos equivalentes (punto o coma) no parezcan un override.
 */
export function isReferenceRateOverridden(
  fxRateInput: string,
  referenceRate: string | null,
): boolean {
  if (referenceRate === null) return false
  const fxRate = tryParseMoney(fxRateInput)
  const reference = tryParseMoney(referenceRate)
  return fxRate !== null && reference !== null && !fxRate.eq(reference)
}
