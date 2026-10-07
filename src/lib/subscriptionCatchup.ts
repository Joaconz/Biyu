import { supabase } from './supabase'

// Puesta al día de suscripciones (US-53, ADR-017, ADR-031). La genera Postgres; acá solo se invoca
// la Edge Function; el tope de 8 segundos lo pone useSubscriptionCatchup.

export interface CatchupFailure {
  subscription_id: string
  period: string | null
  reason: string
}

export interface CatchupResult {
  generated: number
  /** Ocurrencias que no se pudieron generar (sin tipo de cambio, monto fuera de rango). No es un error (ADR-031 §5). */
  failed: CatchupFailure[]
}

export async function runSubscriptionCatchup(): Promise<CatchupResult> {
  const { data, error } = await supabase.functions.invoke<CatchupResult>('run-subscription-catchup', { method: 'POST' })
  if (error) throw error
  if (!data || typeof data.generated !== 'number') throw new Error('Respuesta inesperada de run-subscription-catchup')
  return data
}

// Una vez por carga de la app y por usuario (ADR-031 §1, US-53 CA-10). Vive fuera de React: AppLayout
// se vuelve a montar al pasar por /setup, y StrictMode monta dos veces en desarrollo. Al cerrar
// sesión se olvida, así volver a entrar sin recargar la vuelve a correr.
const startedFor = new Set<string>()
supabase.auth.onAuthStateChange((event) => {
  if (event === 'SIGNED_OUT') startedFor.clear()
})

export function catchupStarted(userId: string): boolean {
  return startedFor.has(userId)
}

/** Marca la puesta al día del usuario como lanzada; false si ya lo estaba. */
export function claimCatchup(userId: string): boolean {
  if (startedFor.has(userId)) return false
  startedFor.add(userId)
  return true
}
