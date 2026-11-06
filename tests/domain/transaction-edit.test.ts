import { describe, expect, it } from 'vitest'
import {
  amountInputText,
  closedMonthChanges,
  editBlock,
  editInputFromTransaction,
  hasEditChanges,
  snapshotOf,
  type EditableTransaction,
  type EditNames,
  type EditSnapshot,
} from '@/domain/transactionEdit'
import { Decimal } from '@/domain/money'

// US-84 (#284): el aviso de meses cerrados (FR-07) y lo que decide la pantalla de edición, con `today` fijo.

const NAMES: EditNames = {
  category: (id) => ({ food: 'Comida y supermercado', other: 'Otros' })[id ?? ''] ?? '—',
  account: (id) => ({ cash: 'Efectivo', debit: 'Tarjeta de débito', visa: 'Tarjeta de crédito' })[id ?? ''] ?? '—',
}

const snap = (over: Partial<EditSnapshot> = {}): EditSnapshot => ({
  amount: new Decimal(30000),
  fxRate: null,
  installmentsCount: 1,
  occurredOn: '2026-09-15',
  categoryId: 'food',
  accountId: 'cash',
  ...over,
})
const day = (iso: string) => new Date(`${iso}T12:00:00`)
const lines = (before: EditSnapshot, after: EditSnapshot, today: string) =>
  closedMonthChanges(before, after, NAMES, day(today)).map((c) => `${c.key} · ${c.text}`)

describe('closedMonthChanges (FR-07, CA-29)', () => {
  const H = '2026-10-09' // H = octubre 2026; H−1 = septiembre, H−2 = agosto

  it('CA-29: 3 cuotas de $10.000 que pasan a $12.000: una sola línea, septiembre', () => {
    const before = snap({ amount: new Decimal(30000), installmentsCount: 3 })
    const after = snap({ amount: new Decimal(36000), installmentsCount: 3 })
    expect(lines(before, after, H)).toEqual(['2026-09 · de $10.000,00 a $12.000,00'])
  })

  it('CA-29: con today = 2026-09-30 septiembre no está cerrado, con 2026-10-01 sí', () => {
    const before = snap({ installmentsCount: 3 })
    const after = snap({ amount: new Decimal(36000), installmentsCount: 3 })
    expect(lines(before, after, '2026-09-30')).toEqual([])
    expect(lines(before, after, '2026-10-01')).toEqual(['2026-09 · de $10.000,00 a $12.000,00'])
  })

  it('CA-7: un gasto de 1 cuota en un mes cerrado cuyo monto cambia', () => {
    expect(lines(snap(), snap({ amount: new Decimal(35000) }), H)).toEqual(['2026-09 · de $30.000,00 a $35.000,00'])
  })

  it('CA-6: la fecha pasa a un mes cerrado: aparecen imputaciones ahí («de $0,00 a $10.000,00»)', () => {
    const before = snap({ installmentsCount: 3, occurredOn: '2026-10-05' }) // H, H+1, H+2
    const after = snap({ installmentsCount: 3, occurredOn: '2026-09-10' }) //   H−1, H, H+1
    expect(lines(before, after, H)).toEqual(['2026-09 · de $0,00 a $10.000,00'])
  })

  it('CA-14: la fecha pasa de un mes cerrado a H: la imputación de H−1 desaparece («de $30.000,00 a $0,00»)', () => {
    expect(lines(snap(), snap({ occurredOn: '2026-10-03' }), H)).toEqual(['2026-09 · de $30.000,00 a $0,00'])
  })

  it('CA-8: solo cambia la categoría de una compra en 3 cuotas de H−2: H−2 y H−1, sin montos, y H no se lista', () => {
    const before = snap({ installmentsCount: 3, occurredOn: '2026-08-15' })
    const after = snap({ installmentsCount: 3, occurredOn: '2026-08-15', categoryId: 'other' })
    expect(lines(before, after, H)).toEqual([
      '2026-08 · categoría: de Comida y supermercado a Otros',
      '2026-09 · categoría: de Comida y supermercado a Otros',
    ])
  })

  it('CA-9: solo la categoría, con 1 cuota en H−1', () => {
    expect(lines(snap(), snap({ categoryId: 'other' }), H)).toEqual(['2026-09 · categoría: de Comida y supermercado a Otros'])
  })

  it('CA-10: monto y categoría a la vez, separados por « · »', () => {
    expect(lines(snap(), snap({ amount: new Decimal(35000), categoryId: 'other' }), H)).toEqual([
      '2026-09 · de $30.000,00 a $35.000,00 · categoría: de Comida y supermercado a Otros',
    ])
  })

  it('CA-11: solo la cuenta', () => {
    expect(lines(snap({ occurredOn: '2026-08-10' }), snap({ occurredOn: '2026-08-10', accountId: 'debit' }), H)).toEqual([
      '2026-08 · cuenta: de Efectivo a Tarjeta de débito',
    ])
  })

  it('CA-12: la descripción o mover la fecha dentro del mismo mes no abren el aviso', () => {
    expect(lines(snap(), snap(), H)).toEqual([]) // solo cambió la descripción (no entra al snapshot)
    expect(lines(snap({ occurredOn: '2026-09-05' }), snap({ occurredOn: '2026-09-20' }), H)).toEqual([])
  })

  it('CA-13: solo cambia la última cuota, que cae en un mes futuro: sin aviso', () => {
    const before = snap({ amount: new Decimal('100000.00'), installmentsCount: 3, occurredOn: '2026-09-15' })
    const after = snap({ amount: new Decimal('100000.01'), installmentsCount: 3, occurredOn: '2026-09-15' })
    // 33.333,33 + 33.333,33 + 33.333,34 → 33.333,33 + 33.333,33 + 33.333,35: septiembre es igual; cambia noviembre.
    expect(lines(before, after, H)).toEqual([])
  })

  it('CA-16: en USD el aviso va en pesos con el tipo de cambio congelado', () => {
    const before = snap({ amount: new Decimal(100), fxRate: new Decimal(1000) })
    const after = snap({ amount: new Decimal(120), fxRate: new Decimal(1000) })
    expect(lines(before, after, H)).toEqual(['2026-09 · de $100.000,00 a $120.000,00'])
  })

  it('CA-17: un ingreso sin categoría: solo cambia el monto', () => {
    const before = snap({ amount: new Decimal(50000), categoryId: null })
    const after = snap({ amount: new Decimal(55000), categoryId: null })
    expect(lines(before, after, H)).toEqual(['2026-09 · de $50.000,00 a $55.000,00'])
  })

  it('un cambio de cantidad de cuotas lista los meses cerrados que cambian de monto', () => {
    const before = snap({ amount: new Decimal(120000), installmentsCount: 6, occurredOn: '2026-07-15' })
    const after = snap({ amount: new Decimal(120000), installmentsCount: 3, occurredOn: '2026-07-15' })
    expect(lines(before, after, H)).toEqual([
      '2026-07 · de $20.000,00 a $40.000,00',
      '2026-08 · de $20.000,00 a $40.000,00',
      '2026-09 · de $20.000,00 a $40.000,00',
    ])
  })
})

describe('hasEditChanges (CA-22)', () => {
  const tx: EditableTransaction = {
    id: 't',
    type: 'expense',
    amount: '12500.00',
    currency: 'ARS',
    fxRate: null,
    installmentsCount: 1,
    occurredOn: '2026-09-15',
    description: null,
    category: { id: 'food', name: 'Comida y supermercado', archivedAt: null },
    account: { id: 'cash', name: 'Efectivo', type: 'cash', archivedAt: null },
    deletedAt: null,
    subscriptionName: null,
    sharedPeople: [], installmentsPaid: 0,
  }
  const original = editInputFromTransaction(tx)

  it('sin tocar nada no hay cambios', () => {
    expect(hasEditChanges(original, { ...original })).toBe(false)
  })

  it('«12.500,00» y «12500» son el mismo monto', () => {
    expect(original.amount).toBe('12.500,00')
    expect(hasEditChanges(original, { ...original, amount: '12500' })).toBe(false)
    expect(hasEditChanges(original, { ...original, amount: '12.500,01' })).toBe(true)
  })

  it('una nota de solo espacios es igual a ninguna nota', () => {
    expect(hasEditChanges(original, { ...original, description: '   ' })).toBe(false)
    expect(hasEditChanges(original, { ...original, description: 'Heladera' })).toBe(true)
  })

  it('cada campo editable cuenta', () => {
    expect(hasEditChanges(original, { ...original, occurredOn: '2026-09-16' })).toBe(true)
    expect(hasEditChanges(original, { ...original, categoryId: 'other' })).toBe(true)
    expect(hasEditChanges(original, { ...original, accountId: 'debit' })).toBe(true)
    expect(hasEditChanges(original, { ...original, installmentsCount: 3 })).toBe(true)
  })

  it('un monto que no se puede leer cuenta como cambio', () => {
    expect(hasEditChanges(original, { ...original, amount: '' })).toBe(true)
  })
})

describe('editBlock (CA-21)', () => {
  const base: EditableTransaction = {
    id: 't', type: 'expense', amount: '100.00', currency: 'ARS', fxRate: null, installmentsCount: 1,
    occurredOn: '2026-09-15', description: null,
    category: { id: 'food', name: 'Comida', archivedAt: null },
    account: { id: 'cash', name: 'Efectivo', type: 'cash', archivedAt: null },
    deletedAt: null, subscriptionName: null, sharedPeople: [], installmentsPaid: 0,
  }

  it('sin bloqueo, null', () => {
    expect(editBlock(base)).toBeNull()
  })

  it('un movimiento eliminado, de una suscripción o compartido muestra su aviso', () => {
    expect(editBlock({ ...base, deletedAt: '2026-09-20T10:00:00Z' })?.message).toBe(
      'Este movimiento está eliminado. Restauralo para poder editarlo.',
    )
    expect(editBlock({ ...base, subscriptionName: 'Netflix' })?.message).toBe(
      'Este gasto lo generó la suscripción Netflix. Editar la suscripción no cambia los meses ya cargados.',
    )
    expect(editBlock({ ...base, sharedPeople: ['Sofía'] })?.message).toBe(
      'Este gasto está compartido con Sofía. Para cambiarlo, eliminalo y cargalo de nuevo.',
    )
    expect(editBlock({ ...base, sharedPeople: ['Sofía', 'Marcos'] })?.message).toContain('con 2 personas')
  })

  it('una compra empezada (US-80) tiene su propio aviso y es el último bloqueo', () => {
    expect(editBlock({ ...base, installmentsCount: 12, installmentsPaid: 4 })).toEqual({
      kind: 'started',
      message: 'Esta compra ya venía en curso al importarla: solo tiene las cuotas que faltan. Para cambiarla, eliminala y cargala de nuevo.',
    })
    expect(editBlock({ ...base, sharedPeople: ['Ana'], installmentsPaid: 4 })?.kind).toBe('shared')
  })

  it('con dos bloqueos sale el primero: eliminado va antes que suscripción y que compartido', () => {
    expect(editBlock({ ...base, deletedAt: 'x', subscriptionName: 'Netflix' })?.kind).toBe('deleted')
    expect(editBlock({ ...base, subscriptionName: 'Netflix', sharedPeople: ['Ana'] })?.kind).toBe('subscription')
  })
})

describe('valores iniciales', () => {
  it('amountInputText muestra el total con separador de miles y coma', () => {
    expect(amountInputText('30000.00')).toBe('30.000,00')
    expect(amountInputText('0.11')).toBe('0,11')
    expect(amountInputText('999999999999.99')).toBe('999.999.999.999,99')
  })

  it('snapshotOf devuelve null con un monto o una fecha que no se pueden leer', () => {
    const input = editInputFromTransaction({
      id: 't', type: 'expense', amount: '100.00', currency: 'USD', fxRate: '1000.0000', installmentsCount: 1,
      occurredOn: '2026-09-15', description: 'x',
      category: { id: 'food', name: 'Comida', archivedAt: null },
      account: { id: 'cash', name: 'Efectivo', type: 'cash', archivedAt: null },
      deletedAt: null, subscriptionName: null, sharedPeople: [], installmentsPaid: 0,
    })
    expect(input.fxRate).toBe('1000')
    expect(snapshotOf(input)?.fxRate?.toFixed()).toBe('1000')
    expect(snapshotOf({ ...input, amount: 'abc' })).toBeNull()
    expect(snapshotOf({ ...input, occurredOn: '' })).toBeNull()
  })
})
