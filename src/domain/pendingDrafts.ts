import type { DraftInput } from './draft'
import { formatArs, formatUsd, tryParseMoney } from './money'
import { formatDisplayDate } from './period'

/**
 * Movimientos pendientes (US-70, NFR-09, ADR-034): borradores cuyo guardado falló por la red y que
 * todavía no son una transacción. Sin React ni almacenamiento: estas funciones reciben y devuelven la
 * lista; leerla y escribirla en el dispositivo es de `src/lib/pendingDrafts.ts`.
 *
 * Un pendiente es un borrador, no una clave: guarda sus valores más recientes y todas las claves con
 * las que se intentó guardarlo. Nunca reemplaza a una transacción guardada.
 */
export interface PendingDraft {
  /** El `draftId` del intento (saveAttempt.ts): el mismo borrador actualiza el mismo pendiente. */
  id: string
  values: DraftInput
  /** Las claves con que se intentó guardar, la última al final (la de `data-request-id`). */
  requestIds: string[]
  /** Nombres al momento del fallo, para la fila y el toast aunque después se archiven. */
  categoryName: string | null
  accountName: string | null
}

/** La entrada en Local Storage (`biyu:pending-drafts:<user_id>`), una por usuario. */
export function pendingDraftsStorageKey(userId: string): string {
  return `biyu:pending-drafts:${userId}`
}

/**
 * Guarda un fallo de red. Si el borrador ya tenía pendiente, lo actualiza con los valores nuevos y
 * suma la clave; si no, lo agrega. Queda primero: el aviso muestra el más reciente arriba. Un fallo
 * nunca pisa a otro borrador.
 */
export function recordNetworkFailure(
  list: readonly PendingDraft[],
  failed: Omit<PendingDraft, 'requestIds'> & { requestId: string },
): PendingDraft[] {
  const { requestId, ...draft } = failed
  const previous = list.find((p) => p.id === draft.id)
  const requestIds = previous
    ? previous.requestIds.includes(requestId)
      ? previous.requestIds
      : [...previous.requestIds, requestId]
    : [requestId]
  return [{ ...draft, requestIds }, ...list.filter((p) => p.id !== draft.id)]
}

/** Saca un pendiente: se guardó, "Recuperar" lo encontró ya guardado, o se descartó. */
export function removePendingDraft(list: readonly PendingDraft[], id: string): PendingDraft[] {
  return list.filter((p) => p.id !== id)
}

export function lastRequestId(pending: PendingDraft): string {
  return pending.requestIds[pending.requestIds.length - 1]
}

/** Título del aviso: "Tenés 1 movimiento sin guardar" / "Tenés N movimientos sin guardar". */
export function pendingDraftsTitle(count: number): string {
  return count === 1 ? 'Tenés 1 movimiento sin guardar' : `Tenés ${count} movimientos sin guardar`
}

/** Fila del aviso: "Gasto · $12.500,00 · Comida · 06/10/2026" o "Ingreso · $300.000,00 · 01/10/2026". */
export function pendingDraftLabel(pending: PendingDraft): string {
  const { values } = pending
  const amount = tryParseMoney(values.amount)
  const money = amount ? (values.currency === 'USD' ? formatUsd(amount) : formatArs(amount)) : values.amount
  return [
    values.type === 'income' ? 'Ingreso' : 'Gasto',
    money,
    values.type === 'expense' ? pending.categoryName : null,
    formatDisplayDate(values.occurredOn),
  ]
    .filter(Boolean)
    .join(' · ')
}

/** Lo que encontró "Recuperar" al buscar por API las transacciones propias con alguna de sus claves. */
export type RecoveryOutcome = 'saved' | 'saved-and-deleted' | 'not-saved'

export function recoveryOutcome(found: readonly { deletedAt: string | null }[]): RecoveryOutcome {
  if (found.length === 0) return 'not-saved'
  return found.some((t) => t.deletedAt === null) ? 'saved' : 'saved-and-deleted'
}

/**
 * Toast de "Recuperar" cuando el movimiento ya estaba guardado. `savedDescription` es la descripción
 * del toast de éxito (saveAttempt.ts): solo aplica si la transacción sigue activa.
 */
export function alreadySavedToast(
  outcome: Exclude<RecoveryOutcome, 'not-saved'>,
  savedDescription: string,
): { title: string; description: string } {
  return outcome === 'saved'
    ? { title: 'Ese movimiento ya estaba guardado', description: savedDescription }
    : { title: 'Ese movimiento ya estaba guardado y después se eliminó', description: 'Está en Movimientos, en Eliminados.' }
}

/**
 * El borrador recuperado, listo para el formulario: conserva fecha y tipo de cambio (C5). Si la
 * cuenta o la categoría ya no está activa, ese campo queda vacío y el motivo de US-11 la pide.
 */
export function restorableValues(
  values: DraftInput,
  active: { categoryIds: ReadonlySet<string>; accountIds: ReadonlySet<string> },
): DraftInput {
  const categoryOk = values.categoryId === null || active.categoryIds.has(values.categoryId)
  const accountOk = values.accountId === null || active.accountIds.has(values.accountId)
  return {
    ...values,
    categoryId: categoryOk ? values.categoryId : null,
    accountId: accountOk ? values.accountId : null,
    accountType: accountOk ? values.accountType : null,
  }
}

const DRAFT_STRING_FIELDS = ['amount', 'fxRate', 'description', 'sharedPerson', 'sharedAmount', 'occurredOn'] as const

function isDraftInput(v: unknown): v is DraftInput {
  if (typeof v !== 'object' || v === null) return false
  const d = v as Record<string, unknown>
  return (
    (d.type === 'expense' || d.type === 'income') &&
    (d.currency === 'ARS' || d.currency === 'USD') &&
    DRAFT_STRING_FIELDS.every((f) => typeof d[f] === 'string') &&
    (d.categoryId === null || typeof d.categoryId === 'string') &&
    (d.accountId === null || typeof d.accountId === 'string') &&
    (d.accountType === null || typeof d.accountType === 'string') &&
    Number.isInteger(d.installmentsCount) &&
    typeof d.shared === 'boolean'
  )
}

/**
 * Lee lo que había en el dispositivo. Cualquier cosa que no tenga la forma esperada (otra versión,
 * edición a mano) se ignora: un pendiente es una ayuda, no un dato del que dependa nada (NFR-18).
 */
export function parsePendingDrafts(raw: string | null): PendingDraft[] {
  if (!raw) return []
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return []
  }
  if (!Array.isArray(data)) return []
  return data.filter(
    (p): p is PendingDraft =>
      typeof p === 'object' &&
      p !== null &&
      typeof p.id === 'string' &&
      isDraftInput(p.values) &&
      Array.isArray(p.requestIds) &&
      p.requestIds.length > 0 &&
      p.requestIds.every((id: unknown) => typeof id === 'string') &&
      (p.categoryName === null || typeof p.categoryName === 'string') &&
      (p.accountName === null || typeof p.accountName === 'string'),
  )
}
