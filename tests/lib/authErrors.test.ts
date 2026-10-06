import { AuthApiError } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'
import { translateAuthError } from '@/lib/authErrors'

describe('translateAuthError', () => {
  // DEF-027 (#197): con el límite de altas por IP, Auth responde 429 over_request_rate_limit y el
  // formulario decía "Probá de nuevo", aunque reintentar sigue fallando un buen rato.
  it('DEF-027: el límite de pedidos pide esperar, no reintentar', () => {
    const error = new AuthApiError('Request rate limit reached', 429, 'over_request_rate_limit')
    expect(translateAuthError(error)).toBe('Demasiados intentos. Esperá unos minutos antes de volver a intentar')
  })

  it('un 429 sin código conocido también pide esperar', () => {
    expect(translateAuthError(new AuthApiError('Too many requests', 429, undefined))).toBe(
      'Demasiados intentos. Esperá unos minutos antes de volver a intentar',
    )
  })

  it('los códigos ya traducidos no cambian', () => {
    expect(translateAuthError(new AuthApiError('Invalid login credentials', 400, 'invalid_credentials'))).toBe(
      'Email o contraseña incorrectos',
    )
  })
})
