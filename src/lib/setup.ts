import { supabase } from './supabase'
import { isSetupPending, type SetupStatus } from './setupGate'

// US-68 (ADR-025): la base crea la fila pendiente al registrarse. Sin fila = cuenta anterior a
// US-68, que no tiene que pasar por el setup (DEF-022).

export async function fetchSetupStatus(): Promise<SetupStatus> {
  try {
    const { data, error } = await supabase.from('user_setup').select('completed_at').maybeSingle()
    if (error) return 'error'
    return isSetupPending(data) ? 'pending' : 'done'
  } catch {
    return 'error'
  }
}

// DEF-022: vale por la sesión de la pestaña. Si guardar el setup falla, el usuario igual entra
// a la app en vez de volver a /setup en un bucle; se le vuelve a mostrar en la próxima sesión.
let finishedThisSession = false

export function markSetupFinishedThisSession(): void {
  finishedThisSession = true
}

export function setupFinishedThisSession(): boolean {
  return finishedThisSession
}

export async function completeSetup(usageReason: string | null): Promise<void> {
  const { error } = await supabase
    .from('user_setup')
    .upsert({ usage_reason: usageReason, completed_at: new Date().toISOString() })
  if (error) throw error
}
