import { isAuthApiError } from '@supabase/supabase-js'

const MESSAGES: Partial<Record<string, string>> = {
  user_already_exists: 'Ya existe una cuenta con ese email',
  email_exists: 'Ya existe una cuenta con ese email',
  invalid_credentials: 'Email o contraseña incorrectos',
  weak_password: 'La contraseña debe tener al menos 6 caracteres',
  email_address_invalid: 'El email no es válido',
  over_email_send_rate_limit: 'Demasiados intentos. Esperá un momento y volvé a intentar',
  email_not_confirmed: 'Confirmá tu email antes de entrar',
}

/** Los mensajes de Supabase Auth vienen en inglés; esto los traduce para el formulario (C6). */
export function translateAuthError(error: unknown): string {
  if (isAuthApiError(error) && error.code && MESSAGES[error.code]) return MESSAGES[error.code]!
  return 'No se pudo completar la operación. Probá de nuevo'
}
