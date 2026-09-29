import { describe, expect, it } from 'vitest'
import { isSetupPending, shouldRedirectToSetup } from '@/lib/setupGate'

// DEF-022: el guard de US-68 dejaba afuera de la app a quien ya tenía cuenta y a quien no podía
// guardar el setup. Estos casos son la alarma que faltaba.

describe('isSetupPending', () => {
  it('sin fila: la cuenta es anterior a US-68, no se le pide el setup', () => {
    expect(isSetupPending(null)).toBe(false)
  })

  it('fila sin completar: cuenta nueva que todavía no pasó por el setup', () => {
    expect(isSetupPending({ completed_at: null })).toBe(true)
  })

  it('fila completada: no se vuelve a pedir', () => {
    expect(isSetupPending({ completed_at: '2026-09-30T12:00:00Z' })).toBe(false)
  })
})

describe('shouldRedirectToSetup', () => {
  it('solo redirige si el setup está pendiente y no se terminó en esta sesión', () => {
    expect(shouldRedirectToSetup({ status: 'pending', finishedThisSession: false })).toBe(true)
  })

  it('setup completo: entra a la app', () => {
    expect(shouldRedirectToSetup({ status: 'done', finishedThisSession: false })).toBe(false)
  })

  it('si leer el estado falla, entra a la app en vez de quedar atrapado en /setup', () => {
    expect(shouldRedirectToSetup({ status: 'error', finishedThisSession: false })).toBe(false)
  })

  it('si terminó el setup en esta sesión, entra aunque guardar haya fallado', () => {
    expect(shouldRedirectToSetup({ status: 'pending', finishedThisSession: true })).toBe(false)
  })
})
