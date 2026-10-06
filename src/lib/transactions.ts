import { Decimal, serializeMoney } from '@/domain/money'
import { debtOfDraft } from '@/domain/sharedDebt'
import type { TransactionDraft } from '@/domain/validation'
import { supabase } from './supabase'

// C4: crear una transacción es una sola llamada RPC, nunca inserts sueltos.
// C2: los montos viajan como string; los tipos generados dicen `number` para numeric,
// por eso el cast vive únicamente en este borde.
const asNumeric = (d: Decimal) => serializeMoney(d) as unknown as number

export async function createTransaction(draft: TransactionDraft) {
  if (!draft.amount || !draft.accountId) throw new Error('Borrador incompleto: validalo antes de guardar')
  // La deuda de un gasto compartido viaja en la misma llamada (ADR-036): nunca un insert a debts.
  const debt = debtOfDraft(draft)
  if (draft.type === 'expense' && draft.shared && !debt) throw new Error('Borrador incompleto: validalo antes de guardar')
  const { data, error } = await supabase.rpc('create_transaction', {
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
  })
  if (error) throw error
  return data
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
