import type { SaveFailure } from '@/domain/saveFailure'

/** El índice único parcial (`user_id, name where archived_at is null`) es la fuente de verdad;
 * esto solo traduce su violación a un mensaje que el formulario pueda mostrar (C6). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505'
}

/** Sin código de Postgres no es un rechazo de la base: es la red ("TypeError: Failed to fetch"). */
export function isNetworkError(error: unknown): boolean {
  const { code } = (typeof error === 'object' && error !== null ? error : {}) as { code?: string }
  return !code
}

/** Motivo de "No se pudo guardar: <motivo>" en Suscripciones (US-52): sin red, el texto del issue. */
export function saveFailureReason(error: unknown): string {
  return isNetworkError(error) ? 'revisá tu conexión y probá de nuevo' : saveErrorMessage(error)
}

/**
 * Motivo del toast "No se pudo guardar". Los errores propios de la base ya vienen en español
 * (I4–I8, create_transaction); los de Postgres no, así que se traducen los que pueden llegar
 * (DEF-012: "numeric field overflow").
 */
export function saveErrorMessage(error: unknown): string {
  const { code, message } = (typeof error === 'object' && error !== null ? error : {}) as { code?: string; message?: string }
  if (code === '22003') return 'El monto es demasiado grande para guardarlo'
  return message || 'Probá de nuevo en un momento'
}

/** Texto del aviso "No se pudo guardar" de Registrar según el tipo de fallo (US-70, ADR-034). */
export function saveFailureText(failure: SaveFailure, error: unknown): string {
  if (failure.kind === 'network') return 'Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.'
  if (failure.sessionExpired) return 'Tu sesión venció. Volvé a entrar.'
  return saveErrorMessage(error)
}
