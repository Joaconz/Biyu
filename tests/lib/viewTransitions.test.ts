import { describe, expect, it } from 'vitest'
import { classifyTransition } from '@/lib/viewTransitions'

describe('clasificación de transiciones entre pantallas (ADR-049)', () => {
  it('la misma ruta (cambiar de mes) no se anima', () => {
    expect(classifyTransition('/dashboard', '/dashboard')).toBe('none')
  })

  it('entre pestañas es un fundido', () => {
    expect(classifyTransition('/dashboard', '/debts')).toBe('tab')
    expect(classifyTransition('/register', '/settings')).toBe('tab')
    expect(classifyTransition('/subscriptions/abc', '/debts')).toBe('tab')
  })

  it('entrar a un detalle avanza y volver retrocede', () => {
    expect(classifyTransition('/subscriptions', '/subscriptions/abc')).toBe('forward')
    expect(classifyTransition('/subscriptions/abc', '/subscriptions/abc/edit')).toBe('forward')
    expect(classifyTransition('/subscriptions/abc/edit', '/subscriptions/abc')).toBe('back')
    expect(classifyTransition('/debts/new', '/debts')).toBe('back')
    expect(classifyTransition('/dashboard', '/dashboard/categories/x')).toBe('forward')
  })

  it('Movimientos cuelga del Resumen (US-69) e Importar del Registro (US-74)', () => {
    expect(classifyTransition('/dashboard', '/transactions')).toBe('forward')
    expect(classifyTransition('/transactions/t1/edit', '/transactions')).toBe('back')
    expect(classifyTransition('/register', '/import')).toBe('forward')
    expect(classifyTransition('/import', '/register')).toBe('back')
  })

  it('una ruta desconocida se trata como cambio de pestaña', () => {
    expect(classifyTransition('/dashboard', '/nada')).toBe('tab')
  })
})
