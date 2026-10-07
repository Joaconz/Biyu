import { describe, expect, it } from 'vitest'
import { isNetworkError, saveErrorMessage, saveFailureReason } from '@/lib/errors'

// DEF-012 (#153): el toast de "No se pudo guardar" mostraba el mensaje crudo de Postgres en
// inglés ("numeric field overflow"). La validación del cliente ya lo evita; esto cubre el
// caso en que igual llegue a la base.
describe('saveErrorMessage (DEF-012)', () => {
  it('traduce el desborde numérico', () => {
    expect(saveErrorMessage({ code: '22003', message: 'numeric field overflow' })).toBe(
      'El monto es demasiado grande para guardarlo',
    )
  })
  it('deja pasar los mensajes propios de la base, que ya están en español', () => {
    expect(saveErrorMessage({ code: '23514', message: 'I6: installments_count > 1 solo aplica a gastos con cuenta credit_card' }))
      .toBe('I6: installments_count > 1 solo aplica a gastos con cuenta credit_card')
  })
  it('sin mensaje, uno genérico', () => {
    expect(saveErrorMessage(new Error(''))).toBe('Probá de nuevo en un momento')
  })
})

describe('saveFailureReason (US-52)', () => {
  it('sin código de Postgres es un error de red, con el motivo del issue', () => {
    const network = { message: 'TypeError: Failed to fetch', code: '' }
    expect(isNetworkError(network)).toBe(true)
    expect(saveFailureReason(network)).toBe('revisá tu conexión y probá de nuevo')
  })
  it('un rechazo de la base no es de red y usa saveErrorMessage', () => {
    expect(isNetworkError({ code: '23514', message: 'El día de cobro va de 1 a 31' })).toBe(false)
    expect(saveFailureReason({ code: '22003', message: 'numeric field overflow' })).toBe(
      'El monto es demasiado grande para guardarlo',
    )
  })
})
