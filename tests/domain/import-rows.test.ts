import { describe, expect, it } from 'vitest'
import { EMPTY_CELL, type ImportColumn, type ImportRow, type SheetCell } from '@/domain/importFile'
import {
  cellNumber,
  readSummaryText,
  reviewRow,
  reviewRows,
  submitLabel,
  toImportText,
  type ImportCatalog,
} from '@/domain/importRows'
import { Decimal } from '@/domain/money'
import { SEEDED_CATALOG } from './importFixtures'

const TODAY = '2026-10-08'
const t = (text: string): SheetCell => ({ kind: 'text', text })
const n = (text: string): SheetCell => ({ kind: 'number', text })
const d = (date: string): SheetCell => ({ kind: 'date', date })

const CATALOG = SEEDED_CATALOG

const VALID: Record<ImportColumn, SheetCell> = {
  date: d('2026-09-01'),
  type: t('Gasto'),
  amount: n('45800'),
  currency: t('ARS'),
  fxRate: EMPTY_CELL,
  category: t('Comida y supermercado'),
  account: t('Tarjeta de débito'),
  installments: EMPTY_CELL,
  note: t('Compra del mes'),
}
const USD = { currency: t('USD'), fxRate: n('1450'), amount: n('12.5') }
const CREDIT = { account: t('Tarjeta de crédito') }

function row(patch: Partial<Record<ImportColumn, SheetCell>> = {}, rowNumber = 2): ImportRow {
  return { rowNumber, cells: { ...VALID, ...patch } }
}
const errorsOf = (patch: Partial<Record<ImportColumn, SheetCell>>) => {
  const reviewed = reviewRow(row(patch), CATALOG, TODAY)
  return reviewed.status === 'error' ? reviewed.errors : []
}

describe('fila válida', () => {
  it('queda Lista con la transacción y su tarjeta', () => {
    const reviewed = reviewRow(row(), CATALOG, TODAY)
    expect(reviewed).toMatchObject({
      status: 'ready',
      card: {
        date: '01/09/2026',
        type: 'Gasto',
        amount: '$45.800,00',
        category: 'Comida y supermercado',
        account: 'Tarjeta de débito',
        fxRate: null,
        installments: null,
      },
      transaction: {
        type: 'expense',
        currency: 'ARS',
        fxRate: null,
        categoryId: 'cat-0',
        accountId: 'acc-dc',
        installmentsCount: 1,
        occurredOn: '2026-09-01',
        description: 'Compra del mes',
      },
    })
    if (reviewed.status === 'ready') expect(reviewed.transaction.amount.toFixed(2)).toBe('45800.00')
  })

  it('una Nota vacía queda sin descripción; un ingreso no necesita categoría', () => {
    const reviewed = reviewRow(row({ note: t('  '), type: t('Ingreso'), category: EMPTY_CELL }), CATALOG, TODAY)
    expect(reviewed).toMatchObject({ status: 'ready', transaction: { description: null, categoryId: null, type: 'income' } })
  })

  it('USD muestra el TC y suma el equivalente en pesos half-up (ADR-013)', () => {
    const reviewed = reviewRow(row({ ...USD, amount: n('0.01'), fxRate: n('0.5') }), CATALOG, TODAY)
    expect(reviewed).toMatchObject({ status: 'ready', card: { amount: 'US$0,01', fxRate: 'TC 0,50' } })
    // 0,01 × 0,5 = 0,005 → 0,01 (half-up)
    if (reviewed.status === 'ready') expect(reviewed.amountArs.toFixed(2)).toBe('0.01')
  })

  it('cuotas con tarjeta de crédito', () => {
    expect(reviewRow(row({ ...CREDIT, installments: n('6') }), CATALOG, TODAY)).toMatchObject({
      status: 'ready',
      card: { installments: '6 cuotas' },
      transaction: { installmentsCount: 6 },
    })
  })
})

// US-76 · CA-2: cada regla, sobre una fila sin ningún otro error.
describe('reglas F1 a F18 (§4)', () => {
  it.each<[string, Partial<Record<ImportColumn, SheetCell>>, string]>([
    ['F1', { date: EMPTY_CELL }, 'Falta la fecha'],
    ['F1 con espacios', { date: t('   ') }, 'Falta la fecha'],
    ['F2 fecha inexistente', { date: t('31/02/2026') }, 'Fecha inválida: usá DD/MM/AAAA'],
    ['F2 otro formato', { date: t('2026-09-01') }, 'Fecha inválida: usá DD/MM/AAAA'],
    ['F2 número sin formato de fecha (CA-6)', { date: n('46000') }, 'Fecha inválida: usá DD/MM/AAAA'],
    ['F2 fecha fuera de rango', { date: t('########') }, 'Fecha inválida: usá DD/MM/AAAA'],
    ['F3', { date: d('2026-10-09') }, 'La fecha no puede ser futura'],
    ['F4', { type: EMPTY_CELL }, 'Falta el tipo'],
    ['F5', { type: t('Gastos') }, 'Tipo inválido: escribí Gasto o Ingreso'],
    ['F6', { amount: EMPTY_CELL }, 'Falta el monto'],
    ['F7', { amount: t('abc') }, 'Monto inválido: usá un número, por ejemplo 1234,56'],
    ['F7 con símbolo', { amount: t('$100') }, 'Monto inválido: usá un número, por ejemplo 1234,56'],
    ['F8', { amount: n('0') }, 'El monto debe ser mayor a cero'],
    ['F8 negativo', { amount: t('-5') }, 'El monto debe ser mayor a cero'],
    ['F9', { amount: t('10,555') }, 'El monto admite hasta 2 decimales'],
    ['F9 con =100/3 (CA-7)', { amount: n('33.333333333333336') }, 'El monto admite hasta 2 decimales'],
    ['F10', { amount: n('1000000000000') }, 'El monto máximo es $999.999.999.999,99'],
    ['F11', { currency: EMPTY_CELL }, 'Falta la moneda'],
    ['F12', { currency: t('EUR') }, 'Moneda inválida: escribí ARS o USD'],
    ['F13a', { currency: t('USD') }, 'Falta el tipo de cambio'],
    ['F13b', { fxRate: n('1450') }, 'Una transacción en ARS no lleva tipo de cambio'],
    ['F13c no es número', { ...USD, fxRate: t('mil') }, 'Tipo de cambio inválido: usá un número mayor a cero'],
    ['F13c cero', { ...USD, fxRate: n('0') }, 'Tipo de cambio inválido: usá un número mayor a cero'],
    ['F13d', { ...USD, fxRate: t('1450,12345') }, 'Usá hasta 4 decimales en el tipo de cambio'],
    ['F13e', { ...USD, fxRate: n('10000000000') }, 'El tipo de cambio es demasiado grande'],
    ['F14a', { category: EMPTY_CELL }, 'Falta la categoría (es obligatoria en un gasto)'],
    ['F14b', { category: t('  Mascotas ') }, 'No existe la categoría «Mascotas» o está archivada'],
    ['F14b en un ingreso', { type: t('Ingreso'), category: t('Mascotas') }, 'No existe la categoría «Mascotas» o está archivada'],
    ['F14c', { account: EMPTY_CELL }, 'Falta la cuenta'],
    ['F14d', { account: t('Banco X') }, 'No existe la cuenta «Banco X» o está archivada'],
    ['F14e 13', { ...CREDIT, installments: n('13') }, 'Las cuotas van de 1 a 12'],
    ['F14e 0', { ...CREDIT, installments: n('0') }, 'Las cuotas van de 1 a 12'],
    ['F14e decimal', { ...CREDIT, installments: t('2,5') }, 'Las cuotas van de 1 a 12'],
    ['F14e texto', { ...CREDIT, installments: t('dos') }, 'Las cuotas van de 1 a 12'],
    ['F15 cuenta', { installments: n('3') }, 'Solo los gastos con tarjeta de crédito admiten cuotas'],
    ['F15 ingreso', { ...CREDIT, type: t('Ingreso'), installments: n('3') }, 'Solo los gastos con tarjeta de crédito admiten cuotas'],
    ['F16', { currency: t('USD'), amount: n('999999999999'), fxRate: n('2') }, 'En pesos daría más que el máximo de $999.999.999.999,99'],
    ['F17 en la moneda', { ...CREDIT, amount: n('0.05'), installments: n('6') }, 'Con ese monto, cada cuota daría menos de 0,01'],
    ['F17 en pesos', { ...CREDIT, currency: t('USD'), amount: n('0.12'), fxRate: n('0.1'), installments: n('12') }, 'Con ese monto, cada cuota daría menos de 0,01'],
    ['F18', { currency: t('USD'), amount: n('0.01'), fxRate: n('0.1') }, 'En pesos daría menos de $0,01. Revisá el monto o el tipo de cambio'],
  ])('%s', (_, patch, message) => {
    const reviewed = reviewRow(row(patch), CATALOG, TODAY)
    expect(reviewed.status).toBe('error')
    expect(errorsOf(patch)).toEqual([message])
  })
})

describe('orden y dependencias (§4)', () => {
  it('un mensaje por columna, en el orden de la tabla (CA-3)', () => {
    expect(errorsOf({ date: t('31/02/2026'), amount: n('0'), account: t('Banco X') })).toEqual([
      'Fecha inválida: usá DD/MM/AAAA',
      'El monto debe ser mayor a cero',
      'No existe la cuenta «Banco X» o está archivada',
    ])
  })

  it('Moneda EUR con tipo de cambio: solo F12 (CA-4)', () => {
    expect(errorsOf({ currency: t('EUR'), fxRate: n('1450') })).toEqual(['Moneda inválida: escribí ARS o USD'])
  })

  it('Tipo "Gastos" con categoría vacía: solo F5 (CA-4)', () => {
    expect(errorsOf({ type: t('Gastos'), category: EMPTY_CELL })).toEqual(['Tipo inválido: escribí Gasto o Ingreso'])
  })

  it('Cuenta "Banco X" con 3 cuotas: solo la cuenta (CA-4)', () => {
    expect(errorsOf({ account: t('Banco X'), installments: n('3') })).toEqual([
      'No existe la cuenta «Banco X» o está archivada',
    ])
  })

  it('F16 y F17 no se evalúan con un error de tipo de cambio o de cuotas', () => {
    expect(errorsOf({ ...CREDIT, amount: n('0.05'), installments: n('13') })).toEqual(['Las cuotas van de 1 a 12'])
    expect(errorsOf({ currency: t('USD'), amount: n('999999999999'), fxRate: t('x') })).toEqual([
      'Tipo de cambio inválido: usá un número mayor a cero',
    ])
  })

  it('F15 en Cuotas no impide el error de Monto', () => {
    expect(errorsOf({ amount: t('abc'), installments: n('3') })).toEqual([
      'Monto inválido: usá un número, por ejemplo 1234,56',
      'Solo los gastos con tarjeta de crédito admiten cuotas',
    ])
  })
})

describe('nombres, fechas y números (CA-5 a CA-7)', () => {
  it('categoría y cuenta sin mayúsculas ni espacios, con tildes (CA-5)', () => {
    expect(reviewRow(row({ account: t('  efectivo ') }), CATALOG, TODAY)).toMatchObject({
      status: 'ready',
      transaction: { accountId: 'acc-cash' },
    })
    expect(errorsOf({ category: t('Educacion') })).toEqual(['No existe la categoría «Educacion» o está archivada'])
    expect(reviewRow(row({ category: t('EDUCACIÓN') }), CATALOG, TODAY).status).toBe('ready')
    // Tilde escrita como carácter aparte (NFD) = compuesta.
    expect(reviewRow(row({ category: t('Educación') }), CATALOG, TODAY).status).toBe('ready')
  })

  it('Tipo " gasto " y Moneda "usd" se aceptan (CA-5)', () => {
    expect(reviewRow(row({ type: t(' gasto '), ...USD, currency: t('usd') }), CATALOG, TODAY).status).toBe('ready')
  })

  it('una categoría o cuenta archivada no está en el catálogo activo: F14b / F14d (CA-5)', () => {
    const archived: ImportCatalog = {
      categories: CATALOG.categories.filter((c) => c.name !== 'Otros'),
      accounts: CATALOG.accounts.filter((a) => a.name !== 'Efectivo'),
    }
    const reviewed = reviewRow(row({ category: t('Otros'), account: t('Efectivo') }), archived, TODAY)
    expect(reviewed).toMatchObject({
      status: 'error',
      errors: ['No existe la categoría «Otros» o está archivada', 'No existe la cuenta «Efectivo» o está archivada'],
    })
  })

  it('hoy es Lista y mañana F3 (CA-6); el texto acepta día y mes de un dígito', () => {
    expect(reviewRow(row({ date: d(TODAY) }), CATALOG, TODAY).status).toBe('ready')
    expect(reviewRow(row({ date: t('8/10/2026') }), CATALOG, TODAY)).toMatchObject({ card: { date: '08/10/2026' } })
    expect(errorsOf({ date: t('9/10/2026') })).toEqual(['La fecha no puede ser futura'])
  })

  it('montos de texto y de fórmula (CA-7)', () => {
    expect(reviewRow(row({ amount: t('1.500') }), CATALOG, TODAY)).toMatchObject({ status: 'ready', card: { amount: '$1.500,00' } })
    expect(cellNumber(t('1234.56'))?.toFixed()).toBe('1234.56')
    expect(cellNumber(t('9.990,50'))?.toFixed()).toBe('9990.5')
    // =0,1*3 guarda 0.30000000000000004: 15 dígitos significativos → 0,3.
    expect(reviewRow(row({ amount: n('0.30000000000000004') }), CATALOG, TODAY)).toMatchObject({
      status: 'ready',
      card: { amount: '$0,30' },
    })
    expect(cellNumber(n('1E-3'))?.toFixed()).toBe('0.001')
    expect(cellNumber(n('NaN'))).toBeNull()
  })

  it('una celda que no se pudo interpretar se muestra con su texto', () => {
    expect(reviewRow(row({ amount: t('abc'), date: t('ayer') }), CATALOG, TODAY)).toMatchObject({
      card: { amount: 'abc', date: 'ayer' },
    })
    // Con F9 o F13e no se muestra un valor redondeado que no está en el archivo.
    expect(reviewRow(row({ amount: t('10,555') }), CATALOG, TODAY)).toMatchObject({ card: { amount: '10,555' } })
    expect(reviewRow(row({ ...USD, fxRate: n('10000000000') }), CATALOG, TODAY)).toMatchObject({ card: { fxRate: null } })
  })
})

describe('resumen del paso 2 (§1)', () => {
  it('plurales y singulares', () => {
    expect(readSummaryText({ total: 11, ready: 7, withErrors: 4 })).toBe('11 filas leídas · 7 listas para importar · 4 con error')
    expect(readSummaryText({ total: 1, ready: 1, withErrors: 0 })).toBe('1 fila leída · 1 lista para importar · 0 con error')
    expect(submitLabel(7)).toBe('Importar 7 movimientos')
    expect(submitLabel(1)).toBe('Importar 1 movimiento')
    expect(submitLabel(0)).toBe('Importar 0 movimientos')
    expect(toImportText({ ready: 1, expensesArs: new Decimal('45800'), incomeArs: new Decimal(0) })).toBe(
      'Vas a importar 1 movimiento: $45.800,00 en gastos y $0,00 en ingresos (en pesos).',
    )
  })

  it('suma el monto total en pesos de las filas Lista, no lo que imputa al mes', () => {
    const review = reviewRows(
      [
        row({ ...CREDIT, amount: n('240000'), installments: n('6') }, 2),
        row({ ...USD, ...CREDIT, category: t('Entretenimiento') }, 3),
        row({ amount: n('0') }, 4),
        row({ type: t('Ingreso'), category: EMPTY_CELL, amount: n('850000') }, 5),
      ],
      CATALOG,
      TODAY,
    )
    expect(review).toMatchObject({ total: 4, ready: 3, withErrors: 1 })
    expect(review.expensesArs.toFixed(2)).toBe('258125.00')
    expect(review.incomeArs.toFixed(2)).toBe('850000.00')
  })
})
