import { describe, expect, it } from 'vitest'
import { CATEGORY_PALETTE, categoryIconKey, displayCategoryColor, fitAmountFontSize, sortCategoriesForGrid } from '@/lib/visuals'

describe('displayCategoryColor', () => {
  it('traduce la paleta saturada anterior a la apagada, sin importar mayúsculas', () => {
    expect(displayCategoryColor('#f97316', 'Comida y supermercado')).toBe(CATEGORY_PALETTE.comida)
    expect(displayCategoryColor('#3B82F6', 'Mi categoría')).toBe(CATEGORY_PALETTE.transporte)
  })

  it('deja pasar un color que ya es de la paleta nueva', () => {
    expect(displayCategoryColor('#6b4e71', 'Salidas')).toBe('#6b4e71')
  })

  it('sin color: el de la categoría sembrada por nombre, o el de Otros', () => {
    expect(displayCategoryColor(null, 'Educación')).toBe(CATEGORY_PALETTE.educacion)
    expect(displayCategoryColor(null, 'Mascotas')).toBe(CATEGORY_PALETTE.otros)
  })
})

describe('categoryIconKey', () => {
  it('ícono para las sembradas, normalizando acentos; null para las propias', () => {
    expect(categoryIconKey('Educación')).toBe('education')
    expect(categoryIconKey('Comida y supermercado')).toBe('basket')
    expect(categoryIconKey('Mascotas')).toBeNull()
  })
})

describe('sortCategoriesForGrid', () => {
  it('alfabético en español, con Otros al final', () => {
    const sorted = sortCategoriesForGrid([{ name: 'Otros' }, { name: 'Salud' }, { name: 'Educación' }, { name: 'Comida y supermercado' }])
    expect(sorted.map((c) => c.name)).toEqual(['Comida y supermercado', 'Educación', 'Salud', 'Otros'])
  })
})

describe('fitAmountFontSize (DEF-021)', () => {
  it('achica en proporción al largo del monto, sin pasar del máximo de la tarjeta', () => {
    expect(fitAmountFontSize('$0,00')).toBe('min(var(--amount-max), calc(100cqi / 3.10))')
    expect(fitAmountFontSize('-$999.999.999.999,99')).toBe('min(var(--amount-max), calc(100cqi / 12.40))')
  })
})
