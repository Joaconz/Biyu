import { supabase } from './supabase'

// Pausar, reanudar, cancelar y editar una suscripción son RPC que usan el hoy del servidor y ponen al
// día esa suscripción antes de cambiarla (ADR-030). El cliente no manda fechas ni pisos de generación.

/** US-56: devuelve cuántos gastos vencidos se cargaron antes de pausar (`generated_before`). */
export async function pauseSubscription(subscriptionId: string): Promise<{ generatedBefore: number }> {
  const { data, error } = await supabase.rpc('pause_subscription', { p_subscription_id: subscriptionId })
  if (error) throw error
  // El conteo solo redacta el aviso: con una respuesta inesperada, la pausa (que ya se hizo) no puede figurar como fallida.
  const generatedBefore = (data as { generated_before?: unknown } | null)?.generated_before
  return { generatedBefore: Number.isInteger(generatedBefore) ? (generatedBefore as number) : 0 }
}
