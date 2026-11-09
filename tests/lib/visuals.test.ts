import { describe, expect, it } from 'vitest'
import { CATEGORY_PALETTE, categoryIconKey, darkCategoryColor, displayCategoryColor, fitAmountFontSize, sortCategoriesForGrid, splitAmountText } from '@/lib/visuals'

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

describe('splitAmountText (ADR-052)', () => {
  it('separa los centavos de un monto en pesos, también negativo o en dólares', () => {
    expect(splitAmountText('$436.850,50')).toEqual({ whole: '$436.850', cents: ',50' })
    expect(splitAmountText('-$999.999.999.999,99')).toEqual({ whole: '-$999.999.999.999', cents: ',99' })
    expect(splitAmountText('US$120,00')).toEqual({ whole: 'US$120', cents: ',00' })
  })

  it('sin centavos reconocibles deja todo entero', () => {
    expect(splitAmountText('$436,9 mil')).toEqual({ whole: '$436,9 mil', cents: null })
    expect(splitAmountText('')).toEqual({ whole: '', cents: null })
  })
})

describe('darkCategoryColor (ADR-052)', () => {
  it('aclara el color con 30 % de blanco', () => {
    expect(darkCategoryColor(CATEGORY_PALETTE.comida)).toBe('#cb9375')
    expect(darkCategoryColor('#3E5C76')).toBe('#788d9f')
  })

  it('deja igual lo que no es #rrggbb', () => {
    expect(darkCategoryColor('var(--input)')).toBe('var(--input)')
    expect(darkCategoryColor('#abc')).toBe('#abc')
  })

  it('displayCategoryColor la aplica en el tema oscuro, después de traducir la paleta vieja', () => {
    expect(displayCategoryColor('#f97316', 'Comida', 'dark')).toBe('#cb9375')
    expect(displayCategoryColor(null, 'Transporte', 'dark')).toBe('#788d9f')
    expect(displayCategoryColor(null, 'Transporte', 'light')).toBe(CATEGORY_PALETTE.transporte)
  })
})
