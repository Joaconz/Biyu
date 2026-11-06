import { Decimal, serializeMoney } from '@/domain/money'
import type { EditableTransaction } from '@/domain/transactionEdit'
import { debtsOfDraft } from '@/domain/sharedDebt'
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
  // Las deudas de un gasto compartido viajan en la misma llamada (ADR-036, ADR-040): nunca un insert a debts.
  const debts = debtsOfDraft(draft)
  if (draft.type === 'expense' && draft.shared && !debts) throw new Error('Borrador incompleto: validalo antes de guardar')
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
        p_shared_persons: debts?.map((d) => d.person),
        p_shared_amounts: debts?.map((d) => asNumeric(d.amount)),
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


/**
 * US-85, ADR-044 §1: borra para siempre un movimiento ya eliminado, con sus imputaciones y su deuda vinculada,
 * en una sola RPC (C4). Rechaza uno activo y el generado por una suscripción.
 */
export async function purgeTransaction(id: string): Promise<void> {
  const { error } = await supabase.rpc('purge_transaction', { p_transaction_id: id })
  if (error) throw error
}

/** Deshace la baja lógica de deleteTransaction desde el filtro "Eliminados" (DEF-007, C10). */
export async function restoreTransaction(id: string): Promise<void> {
  const { error } = await supabase.rpc('restore_transaction', { p_transaction_id: id })
  if (error) throw error
}

/**
 * US-84: un movimiento para la pantalla de edición, con su categoría y cuenta (también si están archivadas),
 * la suscripción que lo generó y las personas de sus deudas. Los montos se piden como texto (C2). RLS deja ver
 * solo los propios (C7): uno ajeno, inexistente o con un id que no es uuid devuelve null.
 */
export async function fetchTransactionForEdit(id: string): Promise<EditableTransaction | null> {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      id,
      type,
      amount_text:amount::text,
      currency,
      fx_rate_text:fx_rate::text,
      installments_count,
      installments_paid,
      occurred_on,
      description,
      deleted_at,
      category:categories!transactions_category_fk (id, name, archived_at),
      account:accounts!transactions_account_fk (id, name, type, archived_at),
      debts:debts!debts_transaction_fk (person),
      subscription:subscriptions!transactions_subscription_fk (name)
    `)
    .eq('id', id)
    .maybeSingle()
  // 22P02: el id de la URL no es un uuid. Es lo mismo que no encontrarlo.
  if (error) {
    if (error.code === '22P02') return null
    throw error
  }
  if (!data) return null
  const row = data as unknown as {
    id: string
    type: 'expense' | 'income'
    amount_text: string
    currency: 'ARS' | 'USD'
    fx_rate_text: string | null
    installments_count: number
    installments_paid: number
    occurred_on: string
    description: string | null
    deleted_at: string | null
    category: { id: string; name: string; archived_at: string | null } | null
    account: { id: string; name: string; type: EditableTransaction['account']['type']; archived_at: string | null }
    debts: { person: string }[] | null
    subscription: { name: string } | null
  }
  return {
    id: row.id,
    type: row.type,
    amount: row.amount_text,
    currency: row.currency,
    fxRate: row.fx_rate_text,
    installmentsCount: row.installments_count,
    occurredOn: row.occurred_on,
    description: row.description,
    category: row.category && { id: row.category.id, name: row.category.name, archivedAt: row.category.archived_at },
    account: { id: row.account.id, name: row.account.name, type: row.account.type, archivedAt: row.account.archived_at },
    deletedAt: row.deleted_at,
    subscriptionName: row.subscription?.name ?? null,
    sharedPeople: (row.debts ?? []).map((d) => d.person),
    installmentsPaid: row.installments_paid,
  }
}

/**
 * US-84, ADR-043: edita el movimiento con una sola RPC que regenera sus imputaciones (C4). No manda tipo,
 * moneda ni tipo de cambio: la base los conserva (C5). Falla con el mismo `SaveError` que createTransaction.
 */
export async function updateTransaction(id: string, draft: TransactionDraft): Promise<string> {
  if (!draft.amount || !draft.accountId) throw new Error('Borrador incompleto: validalo antes de guardar')
  const timeout = abortAfter(SAVE_TIMEOUT_MS)
  try {
    const { data, error, status } = await supabase
      .rpc('update_transaction', {
        p_transaction_id: id,
        p_amount: asNumeric(draft.amount),
        // Un ingreso no lleva categoría (I8 solo la exige en un gasto).
        p_category_id: draft.categoryId as string,
        p_account_id: draft.accountId,
        p_installments_count: draft.installmentsCount,
        p_occurred_on: draft.occurredOn,
        p_description: draft.description ?? undefined,
      })
      .abortSignal(timeout.signal)
    if (error) throw { code: error.code ?? '', message: error.message, status } satisfies SaveError
    return data
  } finally {
    timeout.clear()
  }
}
