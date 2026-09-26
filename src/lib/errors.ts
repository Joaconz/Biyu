/** El índice único parcial (`user_id, name where archived_at is null`) es la fuente de verdad;
 * esto solo traduce su violación a un mensaje que el formulario pueda mostrar (C6). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505'
}
