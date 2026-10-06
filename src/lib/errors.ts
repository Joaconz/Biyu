/** El índice único parcial (`user_id, name where archived_at is null`) es la fuente de verdad;
 * esto solo traduce su violación a un mensaje que el formulario pueda mostrar (C6). */
export function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: string }).code === '23505'
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
