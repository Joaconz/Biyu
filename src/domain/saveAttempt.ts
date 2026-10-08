import { parseDraftInput, type DraftInput } from './draft'
import type { Currency } from './fx'
import { formatArs, formatUsd, tryParseMoney, type Decimal } from './money'
import { debtOfDraft, sharedDebtSavedMessage } from './sharedDebt'
import type { SaveFailure } from './saveFailure'

/**
 * El intento de guardar de un borrador (US-70, ADR-034). Sin React ni Supabase: las claves (UUID) las
 * genera quien llama y entran por parámetro.
 *
 * - `draftId`: identifica al borrador del formulario, no al intento. Es la clave de su movimiento
 *   pendiente: editar un borrador que falló y volver a fallar actualiza el mismo pendiente.
 * - `last`: el último intento con su clave y los valores con los que se envió. Mientras los valores
 *   sigan siendo esos, el próximo Guardar reusa la clave ("Reintentar").
 * - `failure`: el aviso visible, hasta guardar con éxito o cambiar algún valor.
 */
export interface SaveAttempt {
  draftId: string
  last: { requestId: string; values: DraftInput } | null
  failure: SaveFailure | null
}

export function newSaveAttempt(draftId: string): SaveAttempt {
  return { draftId, last: null, failure: null }
}

/**
 * Mismo borrador en cuanto a lo que se guarda: compara los valores ya parseados, así "12500" y
 * "12.500,00" son el mismo monto, y la nota con espacios alrededor, la misma nota. Volver a tocar el
 * mismo chip o ir y volver entre pasos no es un cambio.
 */
export function sameDraftValues(a: DraftInput, b: DraftInput): boolean {
  const x = parseDraftInput(a)
  const y = parseDraftInput(b)
  const sameMoney = (m: Decimal | null, n: Decimal | null) => (m === null || n === null ? m === n : m.eq(n))
  const sameShared =
    x.shared == null || y.shared == null
      ? x.shared == y.shared
      : x.shared.person.trim() === y.shared.person.trim() &&
        sameMoney(tryParseMoney(x.shared.amount), tryParseMoney(y.shared.amount))
  return (
    x.type === y.type &&
    sameMoney(x.amount, y.amount) &&
    x.currency === y.currency &&
    sameMoney(x.fxRate, y.fxRate) &&
    x.categoryId === y.categoryId &&
    x.accountId === y.accountId &&
    x.installmentsCount === y.installmentsCount &&
    x.occurredOn === y.occurredOn &&
    x.description === y.description &&
    sameShared
  )
}

/**
 * La clave del próximo Guardar: la del último intento si los valores no cambiaron y no fue un rechazo
 * (reintento tras un error de red, o el borrador recuperado de un pendiente, ADR-034); si no, `freshId`.
 */
export function requestIdFor(attempt: SaveAttempt, values: DraftInput, freshId: string): string {
  const reusable = attempt.last && attempt.failure?.kind !== 'rejected' && sameDraftValues(attempt.last.values, values)
  return reusable ? attempt.last!.requestId : freshId
}

/** Registra el intento que se está por enviar. */
export function startAttempt(attempt: SaveAttempt, requestId: string, values: DraftInput): SaveAttempt {
  return { ...attempt, last: { requestId, values }, failure: null }
}

/** Resultado de un intento fallido: el aviso queda hasta guardar o cambiar algún valor. */
export function failAttempt(attempt: SaveAttempt, failure: SaveFailure): SaveAttempt {
  return { ...attempt, failure }
}

/**
 * El borrador cargado desde un pendiente que "Recuperar" verificó que no se guardó: mismo `draftId`
 * y, mientras no se cambie nada, la última clave con que se intentó (ADR-034).
 */
export function recoveredAttempt(draftId: string, requestId: string, values: DraftInput): SaveAttempt {
  return { draftId, last: { requestId, values }, failure: null }
}

/**
 * Un cambio del formulario. Si algún valor queda distinto del intento que falló, el aviso se va y la
 * clave se descarta: el próximo Guardar es un intento nuevo, aunque después se vuelva al valor de
 * antes (US-70 · CA-6).
 */
export function afterDraftChange(attempt: SaveAttempt, values: DraftInput): SaveAttempt {
  if (!attempt.last || sameDraftValues(attempt.last.values, values)) return attempt
  return { ...attempt, last: null, failure: null }
}

/** Qué dice el botón principal del último paso (US-70). */
export function submitLabel(attempt: SaveAttempt, values: DraftInput, saving: boolean): string {
  if (saving) return 'Guardando…'
  if (attempt.failure?.kind === 'network' && attempt.last && sameDraftValues(attempt.last.values, values)) {
    return 'Reintentar'
  }
  return values.type === 'income' ? 'Guardar ingreso' : 'Guardar gasto'
}

export interface SavedSummaryInput {
  amount: Decimal
  currency: Currency
  installmentsCount: number
  categoryName: string | null
  accountName: string | null
}

/**
 * Descripción del toast "Gasto guardado" (US-70 · CA-1, CA-2): monto, " en N cuotas" si hay más de
 * una, categoría si hay y cuenta, separados por " · ". "$120.000,00 en 12 cuotas · Tecnología · Visa BBVA".
 */
export function savedTransactionDescription({
  amount,
  currency,
  installmentsCount,
  categoryName,
  accountName,
}: SavedSummaryInput): string {
  const money = currency === 'USD' ? formatUsd(amount) : formatArs(amount)
  const head = installmentsCount > 1 ? `${money} en ${installmentsCount} cuotas` : money
  return [head, categoryName, accountName].filter(Boolean).join(' · ')
}

/**
 * Descripción del toast de éxito para un borrador: la de US-70 y, si es un gasto compartido, la línea
 * de US-34 ("Sofía te debe $60.000,00") al final.
 */
export function savedDraftDescription(
  values: DraftInput,
  names: { categoryName: string | null; accountName: string | null },
): string {
  const draft = parseDraftInput(values)
  if (!draft.amount) return ''
  const base = savedTransactionDescription({
    amount: draft.amount,
    currency: draft.currency,
    installmentsCount: draft.installmentsCount,
    categoryName: names.categoryName,
    accountName: names.accountName,
  })
  const debt = debtOfDraft(draft)
  return debt ? `${base} · ${sharedDebtSavedMessage(debt, draft.currency)}` : base
}
