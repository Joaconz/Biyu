/**
 * Clasificación de un fallo al guardar una transacción (US-70, ADR-034). Sin React ni Supabase: recibe
 * lo que devolvió la API (código de Postgres o de PostgREST y estado HTTP) y decide si reintentar
 * tiene sentido.
 */

/**
 * - `network`: no llegó respuesta (sin conexión, corte, 15 s sin respuesta), HTTP 5xx o cualquier otro
 *   error. Se reintenta con la misma clave de idempotencia.
 * - `rejected`: la base rechazó el dato (clase 22 o 23) o la sesión (42501, HTTP 401). Repetir el mismo
 *   dato fallaría igual. `sessionExpired` cambia el texto del aviso.
 */
export type SaveFailure = { kind: 'network' } | { kind: 'rejected'; sessionExpired: boolean }

/** Lo que importa del error: `code` de Postgres/PostgREST (vacío si no hubo respuesta) y el HTTP. */
export interface SaveErrorInfo {
  code?: string | null
  status?: number | null
}

export function classifySaveError(error: unknown): SaveFailure {
  const { code, status } = (typeof error === 'object' && error !== null ? error : {}) as SaveErrorInfo
  // Token vencido (PGRST301) o sin sesión en la RPC (42501): reintentar no lo arregla.
  if (status === 401 || code === 'PGRST301' || code === '42501') return { kind: 'rejected', sessionExpired: true }
  // Clase 22 (dato inválido: 22003, 22023, 22P02…) y clase 23 (regla de integridad: 23514, 23503…).
  if (code && /^2[23][0-9A-Z]{3}$/.test(code)) return { kind: 'rejected', sessionExpired: false }
  return { kind: 'network' }
}
