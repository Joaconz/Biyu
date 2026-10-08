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

/** US-57: devuelve cuántos gastos se cargaron al reanudar (`generated_after`). */
export async function resumeSubscription(subscriptionId: string): Promise<{ generatedAfter: number }> {
  const { data, error } = await supabase.rpc('resume_subscription', { p_subscription_id: subscriptionId })
  if (error) throw error
  // Como al pausar: el conteo solo redacta el aviso, y la reanudación ya se hizo.
  const generatedAfter = (data as { generated_after?: unknown } | null)?.generated_after
  return { generatedAfter: Number.isInteger(generatedAfter) ? (generatedAfter as number) : 0 }
}

/** US-58: devuelve cuántos gastos vencidos se cargaron antes de cancelar (`generated_before`). */
export async function cancelSubscription(subscriptionId: string): Promise<{ generatedBefore: number }> {
  const { data, error } = await supabase.rpc('cancel_subscription', { p_subscription_id: subscriptionId })
  if (error) throw error
  // Como al pausar: el conteo solo redacta el aviso, y la cancelación ya se hizo.
  const generatedBefore = (data as { generated_before?: unknown } | null)?.generated_before
  return { generatedBefore: Number.isInteger(generatedBefore) ? (generatedBefore as number) : 0 }
}
