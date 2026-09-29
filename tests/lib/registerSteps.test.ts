import { describe, expect, it } from 'vitest'
import { isStepComplete, stepErrors, stepsFor } from '@/lib/registerSteps'

describe('stepsFor', () => {
  it('un gasto pasa por la categoría; un ingreso la salta (I8)', () => {
    expect(stepsFor('expense')).toEqual(['amount', 'category', 'details'])
    expect(stepsFor('income')).toEqual(['amount', 'details'])
  })

  it('nunca más de 4 pasos (NFR-07)', () => {
    expect(stepsFor('expense').length).toBeLessThanOrEqual(4)
  })
})

describe('stepErrors / isStepComplete', () => {
  const errors = { amount: 'El monto debe ser mayor a cero', categoryId: 'Elegí una categoría' }

  it('cada paso ve solo sus campos', () => {
    expect(stepErrors('amount', errors)).toEqual({ amount: errors.amount })
    expect(stepErrors('category', errors)).toEqual({ categoryId: errors.categoryId })
    expect(stepErrors('details', errors)).toEqual({})
  })

  it('un paso sin errores propios está completo aunque falten pasos siguientes', () => {
    expect(isStepComplete('details', errors)).toBe(true)
    expect(isStepComplete('amount', errors)).toBe(false)
    expect(isStepComplete('amount', { categoryId: 'Elegí una categoría' })).toBe(true)
  })

  it('el tipo de cambio es del paso del monto', () => {
    expect(isStepComplete('amount', { fxRate: 'Falta el tipo de cambio' })).toBe(false)
  })
})
