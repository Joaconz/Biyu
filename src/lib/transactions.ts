import { Decimal } from '@/domain/money'
import type { TransactionDraft } from '@/domain/validation'
import { supabase } from './supabase'

// C4: crear una transacción es una sola llamada RPC, nunca inserts sueltos.
// C2: los montos viajan como string; los tipos generados dicen `number` para numeric,
// por eso el cast vive únicamente en este borde.
const asNumeric = (d: Decimal) => d.toFixed() as unknown as number

export async function createTransaction(draft: TransactionDraft & { description?: string }) {
  if (!draft.amount || !draft.accountId) throw new Error('Borrador incompleto: validalo antes de guardar')
  const { data, error } = await supabase.rpc('create_transaction', {
    p_type: draft.type,
    p_amount: asNumeric(draft.amount),
    p_currency: draft.currency,
    p_fx_rate: draft.fxRate ? asNumeric(draft.fxRate) : (null as unknown as number),
    p_category_id: draft.categoryId as string,
    p_account_id: draft.accountId,
    p_installments_count: draft.installmentsCount,
    p_occurred_on: draft.occurredOn,
    p_description: draft.description,
  })
  if (error) throw error
  return data
}
