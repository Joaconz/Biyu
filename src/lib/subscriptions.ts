import { serializeMoney } from '@/domain/money'
import { fromDbDate, toDbDate } from '@/domain/period'
import type { SubscriptionDraft, SubscriptionRecord } from '@/domain/subscriptions'
import { supabase } from './supabase'

// subscriptions es de solo lectura para el cliente: toda escritura es una RPC (ADR-030). RLS (C7)
// filtra por user_id en las lecturas.

const SUBSCRIPTION_COLUMNS = `
  id, name, amount_text:amount::text, currency, billing_day, start_period, end_period, status,
  paused_at, cancelled_at, description,
  category:categories!subscriptions_category_fk (name),
  account:accounts!subscriptions_account_fk (name)
`

interface SubscriptionRow {
  id: string
  name: string
  amount_text: unknown
  currency: SubscriptionRecord['currency']
  billing_day: number
  start_period: string
  end_period: string | null
  status: SubscriptionRecord['status']
  paused_at: string | null
  cancelled_at: string | null
  description: string | null
  category: { name: string } | null
  account: { name: string } | null
}

// C2: con ::text el monto llega exacto, como string, igual que en debts.ts.
function toRecord(row: SubscriptionRow): SubscriptionRecord {
  return {
    id: row.id,
    name: row.name,
    amount: row.amount_text as string,
    currency: row.currency,
    categoryName: row.category?.name ?? '',
    accountName: row.account?.name ?? '',
    billingDay: row.billing_day,
    startPeriod: fromDbDate(row.start_period),
    endPeriod: row.end_period ? fromDbDate(row.end_period) : null,
    status: row.status,
    pausedAt: row.paused_at,
    cancelledAt: row.cancelled_at,
    description: row.description,
  }
}

/** Todas las suscripciones del usuario; el orden y los grupos son del dominio (`groupSubscriptions`). */
export async function fetchSubscriptions(): Promise<SubscriptionRecord[]> {
  const { data, error } = await supabase.from('subscriptions').select(SUBSCRIPTION_COLUMNS)
  if (error) throw error
  return (data as unknown as SubscriptionRow[]).map(toRecord)
}

/** Una suscripción, o null si no existe o es de otro usuario (RLS no distingue una de otra, CA-13). */
export async function fetchSubscription(id: string): Promise<SubscriptionRecord | null> {
  const { data, error } = await supabase.from('subscriptions').select(SUBSCRIPTION_COLUMNS).eq('id', id).maybeSingle()
  // Un id que no es un uuid ("/subscriptions/abc") es una suscripción que no existe.
  if (error?.code === '22P02') return null
  if (error) throw error
  return data ? toRecord(data as unknown as SubscriptionRow) : null
}

// C2: los montos viajan como string; los tipos generados dicen `number` para numeric.
const asNumeric = (value: string) => value as unknown as number

/** Alta (US-52): una sola RPC que valida, inserta y pone al día esa suscripción (ADR-030). */
export async function createSubscription(draft: SubscriptionDraft): Promise<{ subscriptionId: string; generated: number }> {
  const { data, error } = await supabase.rpc('create_subscription', {
    p_name: draft.name,
    p_amount: asNumeric(serializeMoney(draft.amount)),
    p_currency: draft.currency,
    p_category_id: draft.categoryId,
    p_account_id: draft.accountId,
    p_billing_day: draft.billingDay,
    p_start_period: toDbDate(draft.startPeriod),
    p_end_period: draft.endPeriod ? toDbDate(draft.endPeriod) : undefined,
    p_description: draft.description ?? undefined,
  })
  if (error) throw error
  const result = data as { subscription_id: string; generated: number }
  return { subscriptionId: result.subscription_id, generated: result.generated }
}
