import { Decimal, serializeMoney } from '@/domain/money'
import { debtOfDraft } from '@/domain/sharedDebt'
import type { TransactionDraft } from '@/domain/validation'
import { supabase } from './supabase'
import { abortAfter } from './timeout'

// C4: crear una transacción es una sola llamada RPC, nunca inserts sueltos.
// C2: los montos viajan como string; los tipos generados dicen `number` para numeric,
// por eso el cast vive únicamente en este borde.
const asNumeric = (d: Decimal) => serializeMoney(d) as unknown as number

/** A los 15 s sin respuesta el cliente deja de esperar y lo trata como error de red (US-70, ADR-034). */
export const SAVE_TIMEOUT_MS = 15_000

/**
 * El error de un guardado fallido: el de PostgREST más el estado HTTP, que classifySaveError necesita
 * para distinguir un 401 de un 5xx. Sin respuesta (sin conexión, aborto) llega con `code` vacío y `status` 0.
 */
export interface SaveError {
  code: string
  message: string
  status: number
}

/**
 * Crea la transacción con su clave de idempotencia (ADR-034): reintentar con la misma `requestId`
 * devuelve la transacción ya creada en lugar de duplicarla.
 */
export async function createTransaction(draft: TransactionDraft, requestId: string) {
  if (!draft.amount || !draft.accountId) throw new Error('Borrador incompleto: validalo antes de guardar')
  // La deuda de un gasto compartido viaja en la misma llamada (ADR-036): nunca un insert a debts.
  const debt = debtOfDraft(draft)
  if (draft.type === 'expense' && draft.shared && !debt) throw new Error('Borrador incompleto: validalo antes de guardar')
  const timeout = abortAfter(SAVE_TIMEOUT_MS)
  try {
    const { data, error, status } = await supabase
      .rpc('create_transaction', {
        p_type: draft.type,
        p_amount: asNumeric(draft.amount),
        p_currency: draft.currency,
        p_fx_rate: draft.fxRate ? asNumeric(draft.fxRate) : (null as unknown as number),
        p_category_id: draft.categoryId as string,
        p_account_id: draft.accountId,
        p_installments_count: draft.installmentsCount,
        p_occurred_on: draft.occurredOn,
        p_description: draft.description ?? undefined,
        p_shared_person: debt?.person,
        p_shared_amount: debt ? asNumeric(debt.amount) : undefined,
        p_request_id: requestId,
      })
      .abortSignal(timeout.signal)
    if (error) throw { code: error.code ?? '', message: error.message, status } satisfies SaveError
    return data
  } finally {
    timeout.clear()
  }
}

/**
 * Transacciones propias con alguna de estas claves, incluidas las eliminadas (C10). RLS deja ver solo
 * las del usuario (C7): la clave de otro nunca aparece. Lo usa "Recuperar" (US-70).
 */
export async function findTransactionsByRequestIds(requestIds: readonly string[]) {
  const timeout = abortAfter(SAVE_TIMEOUT_MS)
  try {
    // Sin reintentos automáticos: sin conexión, la fila tiene que decirlo enseguida (CA-22).
    const { data, error } = await supabase
      .from('transactions')
      .select('id, deleted_at')
      .in('request_id', [...requestIds])
      .retry(false)
      .abortSignal(timeout.signal)
    if (error) throw error
    return data.map((t) => ({ id: t.id, deletedAt: t.deleted_at }))
  } finally {
    timeout.clear()
  }
}

/**
 * Da de baja una transacción de forma lógica vía RPC (C4, C10, FR-08).
 */
export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await supabase.rpc('delete_transaction', {
    p_transaction_id: id,
  })
  if (error) throw error
}


/** Deshace la baja lógica de deleteTransaction desde el filtro "Eliminados" (DEF-007, C10). */
export async function restoreTransaction(id: string): Promise<void> {
  const { error } = await supabase.rpc('restore_transaction', { p_transaction_id: id })
  if (error) throw error
}
