import { isAuthApiError } from '@supabase/supabase-js'

const RATE_LIMITED = 'Demasiados intentos. Esperá unos minutos antes de volver a intentar'

const MESSAGES: Partial<Record<string, string>> = {
  user_already_exists: 'Ya existe una cuenta con ese email',
  email_exists: 'Ya existe una cuenta con ese email',
  invalid_credentials: 'Email o contraseña incorrectos',
  // DEF-005: Auth rechaza con los mismos criterios que US-67 (passwordPolicy.ts).
  weak_password: 'La contraseña necesita al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  email_address_invalid: 'El email no es válido',
  over_email_send_rate_limit: 'Demasiados intentos. Esperá un momento y volvé a intentar',
  // DEF-027: el límite de pedidos por IP (altas e inicios de sesión) dura minutos, no segundos.
  over_request_rate_limit: RATE_LIMITED,
  email_not_confirmed: 'Confirmá tu email antes de entrar',
}

/** Los mensajes de Supabase Auth vienen en inglés; esto los traduce para el formulario (C6). */
export function translateAuthError(error: unknown): string {
  if (isAuthApiError(error) && error.code && MESSAGES[error.code]) return MESSAGES[error.code]!
  if (isAuthApiError(error) && error.status === 429) return RATE_LIMITED
  return 'No se pudo completar la operación. Probá de nuevo'
}
