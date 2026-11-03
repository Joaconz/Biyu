import { describe, expect, it } from 'vitest'
import { canPurge, purgeConsequences, PURGED_NOTICE } from '@/domain/transactionPurge'

// US-85 (#328), ADR-044 §1-§2.
describe('canPurge', () => {
  it('un movimiento común se puede borrar para siempre', () => {
    expect(canPurge({ subscriptionName: null })).toBe(true)
  })

  it('uno generado por una suscripción no: la puesta al día lo volvería a crear (ADR-044 §2, I11)', () => {
    expect(canPurge({ subscriptionName: 'Netflix' })).toBe(false)
  })
})

describe('purgeConsequences', () => {
  const base = { installmentsCount: 1, sharedPeople: [], subscriptionName: null }

  it('un gasto de una cuota y sin deuda no arrastra nada', () => {
    expect(purgeConsequences(base)).toEqual([])
  })

  it('una compra en cuotas dice cuántas se borran', () => {
    expect(purgeConsequences({ ...base, installmentsCount: 12 })).toEqual(['Se borran también sus 12 cuotas.'])
  })

  it('un gasto compartido dice que se borra la deuda con la persona', () => {
    expect(purgeConsequences({ ...base, sharedPeople: ['Sofía'] })).toEqual(['Se borra también la deuda con Sofía.'])
  })

  it('cuotas y deuda a la vez: las dos líneas, en ese orden', () => {
    expect(purgeConsequences({ ...base, installmentsCount: 3, sharedPeople: ['Juan'] })).toEqual([
      'Se borran también sus 3 cuotas.',
      'Se borra también la deuda con Juan.',
    ])
  })

  it('el aviso de éxito', () => {
    expect(PURGED_NOTICE).toBe('Movimiento eliminado definitivamente')
  })
})
