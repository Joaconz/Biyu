import { supabase } from './supabase'

// US-68 (ADR-025): una fila por usuario. Sin fila todavía = setup no completado.
export interface SetupStatus {
  completed: boolean
  usageReason: string | null
}

export async function fetchSetupStatus(): Promise<SetupStatus> {
  const { data, error } = await supabase.from('user_setup').select('usage_reason, completed_at').maybeSingle()
  if (error) throw error
  return { completed: !!data?.completed_at, usageReason: data?.usage_reason ?? null }
}

export async function completeSetup(usageReason: string | null): Promise<void> {
  const { error } = await supabase
    .from('user_setup')
    .upsert({ usage_reason: usageReason, completed_at: new Date().toISOString() })
  if (error) throw error
}
