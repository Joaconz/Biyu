import { describe, expect, it } from 'vitest'
import { seedPlan } from '@/lib/seedPlan'

const DEFAULT_CATEGORIES = [{ name: 'Comida' }, { name: 'Salud' }]
const DEFAULT_ACCOUNTS = [{ name: 'Efectivo' }, { name: 'Visa' }]
const plan = (categories: { name: string; archived: boolean }[], accounts: { name: string }[]) =>
  seedPlan({ categories, accounts }, { categories: DEFAULT_CATEGORIES, accounts: DEFAULT_ACCOUNTS })

describe('seedPlan', () => {
  it('a un usuario nuevo le siembra todo', () => {
    expect(plan([], [])).toEqual({ categories: DEFAULT_CATEGORIES, accounts: DEFAULT_ACCOUNTS })
  })

  // DEF-010 (#151): archivar todas las categorías hacía que /register sembrara las 8 de nuevo.
  it('DEF-010: si archivó todas sus categorías, no se le vuelven a sembrar', () => {
    expect(plan([{ name: 'Comida', archived: true }, { name: 'Salud', archived: true }], [{ name: 'Efectivo' }]))
      .toEqual({ categories: [], accounts: [] })
  })

  // DEF-011: las cuentas se pueden eliminar; quedarse sin ninguna también es una decisión del usuario.
  it('si ya tuvo categorías y eliminó todas sus cuentas, no se le vuelven a sembrar cuentas', () => {
    expect(plan([{ name: 'Comida', archived: false }], [])).toEqual({ categories: [], accounts: [] })
  })

  it('con la siembra a medias de un alta (carrera con /signup), completa lo que falta sin duplicar', () => {
    expect(plan([], [{ name: 'efectivo' }])).toEqual({ categories: DEFAULT_CATEGORIES, accounts: [{ name: 'Visa' }] })
  })
})
