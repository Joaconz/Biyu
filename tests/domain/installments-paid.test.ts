import { describe, expect, it } from 'vitest'
import { getTransactionDeletionImpact } from '@/domain/deletion'
import { EMPTY_CELL, type ImportColumn, type ImportRow, type SheetCell } from '@/domain/importFile'
import { buildImportResult, importPayload, type ImportResponse } from '@/domain/importResult'
import { reviewRow, reviewRows } from '@/domain/importRows'
import { pendingAmount } from '@/domain/installments'
import { Decimal, parseMoney } from '@/domain/money'
import { SEEDED_CATALOG } from './importFixtures'

// US-80 (#268), ADR-039: compra en cuotas empezada. H = octubre 2026 (hoy = 8/10/2026).
const TODAY = '2026-10-08'
const t = (text: string): SheetCell => ({ kind: 'text', text })
const n = (text: string): SheetCell => ({ kind: 'number', text })
const d = (date: string): SheetCell => ({ kind: 'date', date })
const H4 = '2026-06-10'
const H3 = '2026-07-10'
const H2 = '2026-08-10'
const H1 = '2026-09-10'
const H0 = '2026-10-03'

const BASE: Record<ImportColumn, SheetCell> = {
  date: d(H4), type: t('Gasto'), amount: n('120000'), currency: t('ARS'), fxRate: EMPTY_CELL,
  category: t('Otros'), account: t('Tarjeta de crédito'), installments: n('6'), installmentsPending: n('3'), note: t('Heladera'),
}
const row = (patch: Partial<Record<ImportColumn, SheetCell>> = {}, rowNumber = 2): ImportRow => ({ rowNumber, cells: { ...BASE, ...patch } })
const review = (patch: Partial<Record<ImportColumn, SheetCell>> = {}) => reviewRow(row(patch), SEEDED_CATALOG, TODAY)
const errorsOf = (patch: Partial<Record<ImportColumn, SheetCell>>) => {
  const r = review(patch)
  return r.status === 'error' ? r.errors : []
}

describe('pendingAmount (ADR-039 §2)', () => {
  it.each([
    ['120000', 6, 3, '60000'],
    ['100000', 3, 1, '66666.67'],
    ['120000', 6, 0, '120000'],
    ['100.01', 3, 1, '66.68'],
  ])('%s en %i cuotas con %i pagadas falta %s', (total, count, paid, expected) => {
    expect(pendingAmount(parseMoney(total), count, paid).toFixed(2)).toBe(new Decimal(expected).toFixed(2))
  })
})

describe('fila con Cuotas pendientes', () => {
  it('CA-2: queda Lista con "Faltan 3 de 6 cuotas" y el equivalente en pesos de lo que falta', () => {
    const r = review()
    expect(r).toMatchObject({
      status: 'ready',
      card: { pending: 'Faltan 3 de 6 cuotas ($60.000,00)', installments: null },
      transaction: { installmentsCount: 6, installmentsPaid: 3, occurredOn: H4, description: 'Heladera' },
    })
    expect(r.status === 'ready' && r.amountArs.toFixed(2)).toBe('60000.00')
  })

  it('CA-4: con resto, el monto que falta es $66.666,67', () => {
    const r = review({ date: d(H1), amount: n('100000'), installments: n('3'), installmentsPending: n('2') })
    expect(r).toMatchObject({ status: 'ready', card: { pending: 'Faltan 2 de 3 cuotas ($66.666,67)' } })
  })

  it('CA-5: P = N queda con 0 pagadas y el monto completo', () => {
    const r = review({ date: d(H1), installmentsPending: n('6') })
    expect(r).toMatchObject({ status: 'ready', card: { pending: 'Faltan 6 de 6 cuotas ($120.000,00)' }, transaction: { installmentsPaid: 0 } })
  })

  it('con P = 1 dice "Falta 1 de N cuotas"', () => {
    expect(review({ date: d('2026-05-10'), installmentsPending: n('1') })).toMatchObject({ card: { pending: 'Falta 1 de 6 cuotas ($20.000,00)' } })
  })

  it('CA-6: vacía es una compra normal, con "6 cuotas" y sin installmentsPaid', () => {
    expect(review({ installmentsPending: EMPTY_CELL })).toMatchObject({
      status: 'ready',
      card: { pending: null, installments: '6 cuotas' },
      transaction: { installmentsPaid: null },
    })
  })

  it('CA-11: USD sin resto', () => {
    const r = review({ date: d(H2), amount: n('300'), currency: t('USD'), fxRate: n('1000'), installments: n('3'), installmentsPending: n('1') })
    expect(r).toMatchObject({ status: 'ready', card: { pending: 'Falta 1 de 3 cuotas (US$100,00)' } })
    expect(r.status === 'ready' && r.amountArs.toFixed(2)).toBe('100000.00')
  })

  it('CA-12: USD con resto, el equivalente es lo que falta × TC', () => {
    const r = review({ date: d(H1), amount: n('100'), currency: t('USD'), fxRate: n('1000'), installments: n('3'), installmentsPending: n('2') })
    expect(r).toMatchObject({ status: 'ready', card: { pending: 'Faltan 2 de 3 cuotas (US$66,67)' } })
    expect(r.status === 'ready' && r.amountArs.toFixed(2)).toBe('66670.00')
  })

  it('CA-13: el resumen del paso 2 suma lo que falta, no el Monto escrito', () => {
    const reviewed = reviewRows([row()], SEEDED_CATALOG, TODAY)
    expect(reviewed.expensesArs.toFixed(2)).toBe('60000.00')
  })
})

describe('F19 a F21', () => {
  const F19 = 'Las cuotas pendientes solo van en una compra en cuotas'
  it('CA-7 F19: Cuotas vacía o 1', () => {
    expect(errorsOf({ installments: EMPTY_CELL, installmentsPending: n('1') })).toEqual([F19])
    expect(errorsOf({ installments: n('1'), installmentsPending: n('1') })).toEqual([F19])
  })

  it.each(['0', '-1', '7', '2,5', 'dos'])('CA-8 F20: %s', (value) => {
    expect(errorsOf({ installmentsPending: t(value) })).toEqual(['Las cuotas pendientes van de 1 a 6'])
  })
  it.each(['1', '6'])('CA-8: %s es válida', (value) => {
    expect(review({ date: d('2026-05-10'), installmentsPending: t(value) }).status).toBe('ready')
  })

  it('CA-9 F21: valores límite con K = 3', () => {
    expect(review({ date: d(H3) }).status).toBe('ready')
    expect(errorsOf({ date: d(H2) })).toEqual(['Con esa fecha todavía no puede haber 3 cuotas pagadas'])
    expect(errorsOf({ date: d(H0), installmentsPending: n('5') })).toEqual(['Con esa fecha todavía no puede haber 1 cuota pagada'])
  })

  it('F21 cruza el cambio de año', () => {
    const jan = { ...row({ date: d('2025-12-20'), installmentsPending: n('3') }) }
    expect(reviewRow(jan, SEEDED_CATALOG, '2026-02-10')).toMatchObject({ status: 'error', errors: ['Con esa fecha todavía no puede haber 3 cuotas pagadas'] })
    expect(reviewRow(jan, SEEDED_CATALOG, '2026-03-01').status).toBe('ready')
  })

  it('CA-10: las reglas de Cuotas y Cuenta tapan a F19–F21', () => {
    expect(errorsOf({ account: t('Efectivo'), installments: n('3'), installmentsPending: n('2') })).toEqual([
      'Solo los gastos con tarjeta de crédito admiten cuotas',
    ])
    expect(errorsOf({ installments: n('13'), installmentsPending: n('2') })).toEqual(['Las cuotas van de 1 a 12'])
  })

  it('F21 no se evalúa si la fecha tiene error', () => {
    expect(errorsOf({ date: t('31/02/2026') })).toEqual(['Fecha inválida: usá DD/MM/AAAA'])
  })
})

describe('lo que se manda y el paso 3', () => {
  const response = (rows: ImportResponse['rows']): ImportResponse => ({ import_id: 'i', already_imported: false, sent_rows: rows.length, imported_rows: rows.length, rows })

  it('el pedido lleva installments_paid solo en una compra empezada y el Monto total', () => {
    const reviewed = reviewRows([row({}, 2), row({ installmentsPending: EMPTY_CELL }, 3)], SEEDED_CATALOG, TODAY)
    const [started, normal] = importPayload(reviewed)
    expect(started).toMatchObject({ amount: '120000', installments_count: 6, installments_paid: 3 })
    expect('installments_paid' in normal).toBe(false)
  })

  it('CA-3: "Ver en Movimientos" va al mes de hoy aunque la fecha sea de H−4', () => {
    const reviewed = reviewRows([row()], SEEDED_CATALOG, TODAY)
    const result = buildImportResult(reviewed, response([{ row: 2, status: 'imported', transaction_id: 't' }]), TODAY)
    expect(result.period).toBe('2026-10')
    expect(result.expensesArs.toFixed(2)).toBe('60000.00')
  })

  it('una compra normal sigue yendo al mes de su fecha', () => {
    const reviewed = reviewRows([row({ installmentsPending: EMPTY_CELL })], SEEDED_CATALOG, TODAY)
    const result = buildImportResult(reviewed, response([{ row: 2, status: 'imported', transaction_id: 't' }]), TODAY)
    expect(result.period).toBe('2026-06')
  })
})

describe('CA-15: aviso de borrado de una compra empezada', () => {
  it('lista los meses y montos guardados, no un calendario desde la fecha', () => {
    const stored = [
      { period: '2026-10-01', installmentNumber: 4, amountArs: parseMoney('20000') },
      { period: '2026-11-01', installmentNumber: 5, amountArs: parseMoney('20000') },
      { period: '2026-12-01', installmentNumber: 6, amountArs: parseMoney('20000') },
    ]
    const impact = getTransactionDeletionImpact(
      { amount: parseMoney('60000'), fxRate: null, installmentsCount: 6, occurredOn: H4, type: 'expense', storedEntries: stored },
      new Date(2026, 10, 5), // 5/11/2026 = H+1
    )
    expect(impact.hasClosedPeriodImpact).toBe(true)
    expect(impact.affectedPeriods.map((p) => [p.period, p.installmentNumber, p.amountArs.toFixed(2)])).toEqual([
      [{ year: 2026, month: 10 }, 4, '20000.00'],
    ])
  })
})
