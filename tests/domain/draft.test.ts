import { describe, expect, it } from 'vitest'
import { emptyDraftInput } from '@/domain/draft'
import { toIsoDate } from '@/domain/period'

const TODAY = '2026-08-15'

describe('emptyDraftInput', () => {
  it('arranca como gasto en ARS, de contado, sin monto ni categoría', () => {
    expect(emptyDraftInput(TODAY)).toEqual({
      type: 'expense', amount: '', currency: 'ARS', fxRate: '', categoryId: null,
      accountId: null, accountType: null, installmentsCount: 1, occurredOn: TODAY,
    })
  })
  it('la fecha es el today que recibe, no la del reloj (C1)', () =>
    expect(emptyDraftInput('2020-02-29').occurredOn).toBe('2020-02-29'))
})

describe('toIsoDate', () => {
  it('formatea con ceros a la izquierda', () => expect(toIsoDate(new Date(2026, 0, 5, 12))).toBe('2026-01-05'))
})
