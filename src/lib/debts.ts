import type { NewDebt } from '@/domain/debtDraft'
import type { DebtRecord } from '@/domain/debts'
import { serializeMoney, type Decimal } from '@/domain/money'
import { supabase } from './supabase'

// C2: los montos viajan como string; los tipos generados dicen `number` para numeric, por eso el
// cast vive únicamente en este borde (como en transactions.ts).
const asNumeric = (d: Decimal) => serializeMoney(d) as unknown as number

/** Crea una deuda suelta con una sola llamada (US-36, ADR-037): nunca un insert a debts. Devuelve su id. */
export async function createDebt(debt: NewDebt): Promise<string> {
  const { data, error } = await supabase.rpc('create_debt', {
    p_direction: debt.direction,
    p_person: debt.person,
    p_amount: asNumeric(debt.amount),
    p_currency: debt.currency,
    p_fx_rate: debt.fxRate ? asNumeric(debt.fxRate) : (null as unknown as number),
    p_incurred_on: debt.incurredOn,
    p_notes: debt.notes ?? undefined,
  })
  if (error) throw error
  return data
}

/** Pasa la deuda a saldada (US-39); `settled_at` lo pone el servidor (ADR-037 §3, C1). */
export async function settleDebt(id: string): Promise<void> {
  const { error } = await supabase.rpc('settle_debt', { p_debt_id: id })
  if (error) throw error
}

/** La vuelve a pendiente: "Deshacer" de US-39 y "Volver a pendiente" de US-40. */
export async function reopenDebt(id: string): Promise<void> {
  const { error } = await supabase.rpc('reopen_debt', { p_debt_id: id })
  if (error) throw error
}

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
      transaction:transactions!debts_transaction_fk (
        deleted_at, currency, occurred_on, amount_text:amount::text,
        category:categories!transactions_category_fk (name)
      )
    `)
  if (error) throw error
  // C2: PostgREST manda numeric como número JSON; con ::text llega exacto, como en fxRates.ts.
  return (data ?? []).map((row) => ({
    id: row.id,
    person: row.person,
    direction: row.direction,
    amount: row.amount_text as string,
    amountArs: requiredAmountArs(row.amount_ars_text),
    currency: row.currency,
    incurredOn: row.incurred_on,
    notes: row.notes,
    status: row.status,
    settledAt: row.settled_at,
    createdAt: row.created_at,
    transactionId: row.transaction_id,
    linkedTransactionDeleted: row.transaction?.deleted_at != null,
    origin: row.transaction
      ? {
          categoryName: row.transaction.category?.name ?? null,
          amount: row.transaction.amount_text as string,
          currency: row.transaction.currency,
          occurredOn: row.transaction.occurred_on,
        }
      : null,
  }))
}

/**
 * amount_ars es generada y nunca nula (sale de amount, que es not null); los tipos la ven nullable.
 * Si igual faltara, la carga falla y se ve el error de la pantalla, en vez de que los totales
 * (US-37) rompan el render al parsear un monto vacío.
 */
function requiredAmountArs(value: string | null): string {
  if (value === null) throw new Error('Deuda sin amount_ars')
  return value
}
