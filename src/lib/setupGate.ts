// US-68 (ADR-025, DEF-022): cuándo AppLayout manda a /setup. Sin imports, para testearlo solo.

/** La fila de user_setup del usuario, o null si no tiene (cuenta anterior a US-68). */
export type SetupRow = { completed_at: string | null } | null

export type SetupStatus = 'pending' | 'done' | 'error'

/** Pendiente solo si la base creó la fila al registrarse y todavía no se completó. */
export function isSetupPending(row: SetupRow): boolean {
  return row !== null && row.completed_at === null
}

/**
 * Nunca deja a nadie afuera de la app: si leer el estado falla, o si el usuario ya terminó el
 * setup en esta sesión aunque guardarlo haya fallado, entra igual. El setup se puede reabrir
 * desde Ajustes; quedar atrapado en /setup no tiene salida.
 */
export function shouldRedirectToSetup({
  status,
  finishedThisSession,
}: {
  status: SetupStatus
  finishedThisSession: boolean
}): boolean {
  return status === 'pending' && !finishedThisSession
}
