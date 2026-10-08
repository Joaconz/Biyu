// Importar desde Excel (US-78): errores de toda la importación (§7 de
// entrega-2/historias/importar-excel.md) y cuándo salir de la pantalla pide confirmación (§8).
import { classifySaveError } from './saveFailure'

/**
 * - `no-response`: no llegó respuesta de la base (sin conexión, corte, 30 s sin respuesta, o un error
 *   del gateway sin código de Postgres). Puede haberse guardado: se reintenta con el mismo id.
 * - `session`: la sesión venció (42501, HTTP 401). No se guardó nada y reintentar no lo arregla.
 * - `timeout`: la base cortó por statement_timeout (57014). La RPC es una transacción: no quedó nada.
 * - `other`: cualquier otro error con código, de Postgres o de PostgREST. Los de PostgREST (PGRST000 a
 *   PGRST003, sin conexión a la base) salen antes de ejecutar la RPC: tampoco quedó nada.
 */
export type ImportFailure = 'no-response' | 'session' | 'timeout' | 'other'

export function classifyImportFailure(error: unknown): ImportFailure {
  const save = classifySaveError(error)
  if (save.kind === 'rejected' && save.sessionExpired) return 'session'
  const { code } = (typeof error === 'object' && error !== null ? error : {}) as { code?: string | null }
  if (code === '57014') return 'timeout'
  // Sin código de Postgres no hay prueba de que la transacción se haya deshecho.
  return code ? 'other' : 'no-response'
}

/** Mensajes exactos de §7. */
export function importFailureMessage(failure: ImportFailure): string {
  switch (failure) {
    case 'no-response':
      return 'No pudimos confirmar la importación. Puede que se haya guardado: tocá Reintentar y te decimos qué pasó.'
    case 'session':
      return 'Tu sesión venció y no se importó ninguna fila. Volvé a entrar y subí el archivo de nuevo.'
    case 'timeout':
      return 'La importación tardó demasiado y no se importó ninguna fila. Dividí el archivo en partes más chicas.'
    case 'other':
      return 'No se importó ninguna fila. Probá de nuevo en un rato.'
  }
}

/** Con la sesión vencida no hay "Reintentar": el botón lleva a entrar de nuevo (§7). */
export const IMPORT_LOGIN_PATH = '/login?next=/import'

export type SubmitAction = 'import' | 'retry' | 'login'

/** Qué hace el botón principal del paso 2 después de un error de toda la importación. */
export function submitActionAfter(failure: ImportFailure | null): SubmitAction {
  if (!failure) return 'import'
  return failure === 'session' ? 'login' : 'retry'
}

/**
 * §8: salir pide confirmación mientras dice "Importando…" o mientras se ve "No pudimos confirmar la
 * importación…". En los demás estados no se guardó nada que se pueda perder de vista.
 */
export function importPending(importing: boolean, failure: ImportFailure | null): boolean {
  return importing || failure === 'no-response'
}

export const ALREADY_IMPORTED_TEXT = 'Esta importación ya se había guardado.'

/**
 * Texto del botón principal del paso 2 (§1, §7). "Volver a entrar" no está en la spec: es el rótulo
 * del botón que, con la sesión vencida, lleva a /login?next=/import.
 */
export function submitButtonText(action: SubmitAction, importing: boolean, readyLabel: string): string {
  if (importing) return 'Importando…'
  if (action === 'retry') return 'Reintentar'
  if (action === 'login') return 'Volver a entrar'
  return readyLabel
}
