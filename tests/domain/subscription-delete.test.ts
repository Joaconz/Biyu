import { describe, expect, it } from 'vitest'
import {
  DELETE_SUBSCRIPTION_WARNING,
  deletedSubscriptionNotice,
  deleteSubscriptionKeptText,
  subscriptionDeletionSummary,
} from '@/domain/subscriptionDelete'

// US-88 (#330), ADR-044 §4.
const base = { name: 'Netflix', amount: '5000.00', currency: 'ARS' as const, status: 'active' as const, pausedAt: null, cancelledAt: null }

describe('subscriptionDeletionSummary', () => {
  it('dice nombre, monto mensual y estado', () => {
    expect(subscriptionDeletionSummary(base)).toEqual([
      { label: 'Suscripción', value: 'Netflix' },
      { label: 'Monto mensual', value: '$5.000,00' },
      { label: 'Estado', value: 'Activa' },
    ])
  })

  it('en US$ el monto va en dólares y una cancelada lo dice con su fecha', () => {
    const rows = subscriptionDeletionSummary({
      ...base, currency: 'USD', amount: '20.00', status: 'cancelled', cancelledAt: '2026-09-02T15:00:00.000000+00:00',
    })
    expect(rows[1]).toEqual({ label: 'Monto mensual', value: 'US$20,00' })
    expect(rows[2]).toEqual({ label: 'Estado', value: 'Cancelada el 02/09/2026' })
  })
})

describe('deleteSubscriptionKeptText (ADR-044 §4)', () => {
  it('los gastos ya cargados quedan como movimientos sueltos, con los mismos montos y meses', () => {
    expect(deleteSubscriptionKeptText(4)).toBe('Los 4 gastos que ya cargó quedan como movimientos sueltos, con los mismos montos y meses.')
    expect(deleteSubscriptionKeptText(1)).toBe('El gasto que ya cargó queda como un movimiento suelto, con los mismos montos y meses.')
  })

  it('sin gastos, o sin poder contarlos', () => {
    expect(deleteSubscriptionKeptText(0)).toBe('No tiene gastos cargados.')
    expect(deleteSubscriptionKeptText(null)).toBe('Los gastos que ya cargó quedan como movimientos sueltos, con los mismos montos y meses.')
  })

  it('la advertencia y el aviso de éxito', () => {
    expect(DELETE_SUBSCRIPTION_WARNING).toBe('Deja de cargar gastos. Esto no se puede deshacer.')
    expect(deletedSubscriptionNotice('Netflix')).toBe('Suscripción Netflix eliminada')
  })
})
