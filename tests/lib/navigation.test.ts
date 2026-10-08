import { describe, expect, it } from 'vitest'
import { NAV_ITEMS, activeNavScreen, isCurrentNavTarget, navHref, navTestId, screenFromPath } from '@/lib/navigation'

describe('navegación global (ADR-023)', () => {
  it('V2: Registrar, Resumen, Deudas y Suscripciones; sin Movimientos ni Ajustes (US-69 · CA-1)', () => {
    expect(NAV_ITEMS.map((i) => i.label)).toEqual(['Registrar', 'Resumen', 'Deudas', 'Suscripciones'])
    expect(NAV_ITEMS.map((i) => i.screen)).toEqual(['register', 'dashboard', 'debts', 'subscriptions'])
  })

  it('conserva los testids por pantalla de la navegación anterior', () => {
    expect(navTestId('register', 'dashboard')).toBe('register-nav-dashboard')
    expect(navTestId('debts', 'subscriptions')).toBe('debts-nav-subscriptions')
  })

  it('reconoce la pantalla por la ruta, también en subrutas', () => {
    expect(screenFromPath('/dashboard')).toBe('dashboard')
    expect(screenFromPath('/settings')).toBe('settings')
    expect(screenFromPath('/debts')).toBe('debts')
    expect(screenFromPath('/debts/nueva')).toBe('debts')
    expect(screenFromPath('/subscriptions/abc')).toBe('subscriptions')
    expect(screenFromPath('/import')).toBe('register')
    expect(screenFromPath('/otra')).toBeNull()
  })

  it('Movimientos marca Resumen; Ajustes no marca ninguno de los cuatro (US-69 · CA-3)', () => {
    expect(activeNavScreen('transactions')).toBe('dashboard')
    expect(activeNavScreen('dashboard')).toBe('dashboard')
    expect(activeNavScreen('debts')).toBe('debts')
    expect(activeNavScreen('settings')).toBe('settings')
    expect(NAV_ITEMS.some((i) => i.screen === activeNavScreen('settings'))).toBe(false)
  })

  it('el ítem de la ruta exacta no navega; desde una subruta o Movimientos sí (US-69 · CA-10, CA-11)', () => {
    expect(isCurrentNavTarget('register', '/register')).toBe(true)
    expect(isCurrentNavTarget('dashboard', '/dashboard')).toBe(true)
    expect(isCurrentNavTarget('debts', '/debts/nueva')).toBe(false)
    expect(isCurrentNavTarget('dashboard', '/transactions')).toBe(false)
  })

  it('el mes viaja entre Resumen y Movimientos, y no hacia Deudas, Suscripciones ni desde Ajustes (C11)', () => {
    expect(navHref('transactions', 'dashboard', '?period=2026-08')).toBe('/transactions?period=2026-08')
    expect(navHref('dashboard', 'transactions', '?period=2026-08')).toBe('/dashboard?period=2026-08')
    expect(navHref('dashboard', 'settings', '?period=2026-08')).toBe('/dashboard')
    expect(navHref('register', 'dashboard', '?period=2026-08')).toBe('/register')
    expect(navHref('debts', 'dashboard', '?period=2026-08')).toBe('/debts')
    expect(navHref('subscriptions', 'dashboard', '?period=2026-08')).toBe('/subscriptions')
  })
})
