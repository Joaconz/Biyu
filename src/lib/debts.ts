import type { DebtRecord } from '@/domain/debts'
import { supabase } from './supabase'

/**
 * Las deudas del usuario (RLS, C7), con la baja lógica del gasto de origen para que el dominio
 * oculte las de gastos eliminados (ADR-037 §4). Se traen todas: el filtro y el orden de la
 * pantalla son del dominio (`debtsForFilter`), y cambiar de filtro no vuelve a pedir datos.
 */
export async function fetchDebts(): Promise<DebtRecord[]> {
  const { data, error } = await supabase
    .from('debts')
    .select(`
      id, person, direction, amount_text:amount::text, amount_ars_text:amount_ars::text, currency, incurred_on, notes, status, settled_at,
      created_at, transaction_id,
      transaction:transactions!debts_transaction_fk (deleted_at)
    `)
  if (error) throw error
  // C2: PostgREST manda numeric como número JSON; con ::text llega exacto, como en fxRates.ts.
  return (data ?? []).map((row) => ({
    id: row.id,
    person: row.person,
    direction: row.direction,
    amount: row.amount_text as string,
    // amount_ars es generada y nunca nula (CHECK amount_ars > 0); los tipos la ven nullable.
    amountArs: (row.amount_ars_text ?? '') as string,
    currency: row.currency,
    incurredOn: row.incurred_on,
    notes: row.notes,
    status: row.status,
    settledAt: row.settled_at,
    createdAt: row.created_at,
    transactionId: row.transaction_id,
    linkedTransactionDeleted: row.transaction?.deleted_at != null,
  }))
}
