import { describe, expect, it } from 'vitest'
import { NAV_ITEMS_V1, navHref, navTestId, screenFromPath } from '@/lib/navigation'

describe('navegación global (ADR-023)', () => {
  it('V1: Registrar, Resumen y Movimientos; Ajustes va aparte', () => {
    expect(NAV_ITEMS_V1.map((i) => i.label)).toEqual(['Registrar', 'Resumen', 'Movimientos'])
  })

  it('conserva los testids por pantalla de la navegación anterior', () => {
    expect(navTestId('register', 'dashboard')).toBe('register-nav-dashboard')
    expect(navTestId('transactions', 'dashboard')).toBe('transactions-nav-dashboard')
  })

  it('reconoce la pantalla por la ruta', () => {
    expect(screenFromPath('/dashboard')).toBe('dashboard')
    expect(screenFromPath('/settings')).toBe('settings')
    expect(screenFromPath('/otra')).toBeNull()
  })

  it('el mes viaja entre Resumen y Movimientos, y no desde Ajustes (C11)', () => {
    expect(navHref('transactions', 'dashboard', '?period=2026-08')).toBe('/transactions?period=2026-08')
    expect(navHref('dashboard', 'transactions', '?period=2026-08')).toBe('/dashboard?period=2026-08')
    expect(navHref('dashboard', 'settings', '?period=2026-08')).toBe('/dashboard')
    expect(navHref('register', 'dashboard', '?period=2026-08')).toBe('/register')
  })
})
