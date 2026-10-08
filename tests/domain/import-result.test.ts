import { describe, expect, it } from 'vitest'
import { EMPTY_CELL, type ImportColumn, type ImportRow, type SheetCell } from '@/domain/importFile'
import {
  buildImportResult,
  dbRejectionMessage,
  importPayload,
  notImportedHeading,
  notImportedLine,
  resultAmountsText,
  resultTitle,
  type ImportResponse,
} from '@/domain/importResult'
import { reviewRows } from '@/domain/importRows'
import { SEEDED_CATALOG } from './importFixtures'

const TODAY = '2026-10-08'
const t = (text: string): SheetCell => ({ kind: 'text', text })
const n = (text: string): SheetCell => ({ kind: 'number', text })
const d = (date: string): SheetCell => ({ kind: 'date', date })

function row(rowNumber: number, cells: Partial<Record<ImportColumn, SheetCell>>): ImportRow {
  return {
    rowNumber,
    cells: {
      date: EMPTY_CELL, type: t('Gasto'), amount: EMPTY_CELL, currency: t('ARS'), fxRate: EMPTY_CELL,
      category: EMPTY_CELL, account: EMPTY_CELL, installments: EMPTY_CELL, note: EMPTY_CELL,
      ...cells,
    },
  }
}

// La hoja "Movimientos" del archivo de ejemplo (§6), sin la fila 12 vacía.
const EXAMPLE: ImportRow[] = [
  row(2, { date: d('2026-09-01'), amount: n('45800'), category: t('Comida y supermercado'), account: t('Tarjeta de débito'), installments: n('1'), note: t('Compra del mes') }),
  row(3, { date: d('2026-09-03'), amount: n('240000'), category: t('Indumentaria'), account: t('Tarjeta de crédito'), installments: n('6'), note: t('Campera') }),
  row(4, { date: d('2026-09-05'), amount: n('12.5'), currency: t('USD'), fxRate: n('1450'), category: t('Entretenimiento'), account: t('Tarjeta de crédito'), note: t('Juego online') }),
  row(5, { date: d('2026-09-08'), type: t('Ingreso'), amount: n('850000'), account: t('Cuenta bancaria'), note: t('Sueldo') }),
  row(6, { date: d('2026-09-10'), amount: n('3200'), category: t('Transporte'), account: t('Billetera virtual'), note: t('Carga SUBE') }),
  row(7, { date: d('2026-09-12'), amount: n('0'), category: t('Salud'), account: t('Efectivo'), note: t('Farmacia') }),
  row(8, { date: d('2026-09-15'), amount: n('30'), currency: t('USD'), category: t('Otros'), account: t('Efectivo'), note: t('Regalo') }),
  row(9, { date: d('2026-09-18'), amount: n('15000'), category: t('Mascotas'), account: t('Efectivo'), note: t('Veterinaria') }),
  row(10, { date: d('2026-09-20'), amount: n('60000'), category: t('Educación'), account: t('Efectivo'), installments: n('3'), note: t('Curso') }),
  row(11, { date: t('22/09/2026'), amount: t('9.990,50'), category: t('Servicios'), account: t('Cuenta bancaria'), note: t('Internet') }),
  row(13, { date: d('2026-09-25'), amount: n('7800'), category: t('Comida y supermercado'), account: t('Efectivo'), note: t('Verdulería') }),
]

const REVIEW = reviewRows(EXAMPLE, SEEDED_CATALOG, TODAY)

/** La respuesta de la base cuando importa todas las filas mandadas, salvo las de `rejected`. */
function respond(rejected: Record<number, string> = {}): ImportResponse {
  const rows = importPayload(REVIEW).map((p): ImportResponse['rows'][number] =>
    rejected[p.row]
      ? { row: p.row, status: 'rejected', error_code: '23503', error_message: rejected[p.row] }
      : { row: p.row, status: 'imported', transaction_id: `tx-${p.row}` },
  )
  return {
    import_id: 'imp-1',
    already_imported: false,
    sent_rows: rows.length,
    imported_rows: rows.filter((r) => r.status === 'imported').length,
    rows,
  }
}

describe('lo que se manda a import_transactions (ADR-035)', () => {
  it('solo las 7 filas Lista, con montos como texto (C2) y cada dato de su fila (US-77 · CA-1)', () => {
    const payload = importPayload(REVIEW)
    expect(payload.map((p) => p.row)).toEqual([2, 3, 4, 5, 6, 11, 13])
    expect(payload.find((p) => p.row === 3)).toEqual({
      row: 3,
      type: 'expense',
      amount: '240000',
      currency: 'ARS',
      fx_rate: null,
      category_id: 'cat-6',
      account_id: 'acc-cc',
      installments_count: 6,
      occurred_on: '2026-09-03',
      description: 'Campera',
    })
    expect(payload.find((p) => p.row === 4)).toMatchObject({ amount: '12.5', currency: 'USD', fx_rate: '1450', installments_count: 1 })
    expect(payload.find((p) => p.row === 5)).toMatchObject({ type: 'income', category_id: null })
    expect(payload.find((p) => p.row === 11)).toMatchObject({ amount: '9990.5', occurred_on: '2026-09-22' })
    for (const p of payload) expect(typeof p.amount).toBe('string')
  })
})

describe('paso 3 (§1, §6)', () => {
  it('con el archivo de ejemplo muestra exactamente el resultado de la §6 (US-77 · CA-3)', () => {
    const result = buildImportResult(REVIEW, respond())
    expect(resultTitle(result)).toBe('Se importaron 7 de 11 filas.')
    expect(resultAmountsText(result)).toBe('$324.915,50 en gastos y $850.000,00 en ingresos (en pesos).')
    expect(notImportedHeading(result.total - result.imported)).toBe('4 filas no se importaron:')
    expect(result.notImported.map(notImportedLine)).toEqual([
      'Fila 7: El monto debe ser mayor a cero',
      'Fila 8: Falta el tipo de cambio',
      'Fila 9: No existe la categoría «Mascotas» o está archivada',
      'Fila 10: Solo los gastos con tarjeta de crédito admiten cuotas',
    ])
    expect(result.period).toBe('2026-09')
    expect(result.alreadyImported).toBe(false)
  })

  it('una fila que la base rechaza se lista con el mensaje de la §5 y no suma (US-77 · CA-4)', () => {
    const result = buildImportResult(REVIEW, respond({ 6: 'la categoría no existe, no es tuya o está archivada' }))
    expect(resultTitle(result)).toBe('Se importaron 6 de 11 filas.')
    expect(resultAmountsText(result)).toBe('$321.715,50 en gastos y $850.000,00 en ingresos (en pesos).')
    expect(result.notImported.map(notImportedLine)).toContain('Fila 6: No existe la categoría «Transporte» o está archivada')
    // Ordenadas por número de fila, mezclando las del paso 2 y las de la base.
    expect(result.notImported.map((r) => r.rowNumber)).toEqual([6, 7, 8, 9, 10])
  })

  it('"Ver en Movimientos" va al mes de la fecha más reciente creada, no al de la última cuota', () => {
    const result = buildImportResult(REVIEW, respond({ 13: 'x', 11: 'x' }))
    expect(result.period).toBe('2026-09')
    const onlyOld = reviewRows([row(2, { date: d('2026-08-31'), amount: n('10'), category: t('Otros'), account: t('Tarjeta de crédito'), installments: n('12') })], SEEDED_CATALOG, TODAY)
    expect(buildImportResult(onlyOld, { import_id: 'i', already_imported: false, sent_rows: 1, imported_rows: 1, rows: [{ row: 2, status: 'imported', transaction_id: 't' }] }).period).toBe('2026-08')
  })

  it('sin filas creadas no hay período (el botón no se muestra)', () => {
    const all = Object.fromEntries(importPayload(REVIEW).map((p) => [p.row, 'boom']))
    expect(buildImportResult(REVIEW, respond(all)).period).toBeNull()
  })

  it('plurales y singulares del paso 3', () => {
    expect(resultTitle({ imported: 1, total: 11 })).toBe('Se importó 1 de 11 filas.')
    expect(resultTitle({ imported: 1, total: 1 })).toBe('Se importó 1 de 1 fila.')
    expect(resultTitle({ imported: 0, total: 1 })).toBe('Se importaron 0 de 1 fila.')
    expect(notImportedHeading(1)).toBe('1 fila no se importó:')
    expect(notImportedLine({ rowNumber: 3, messages: ['Falta la fecha', 'Falta el monto'] })).toBe('Fila 3: Falta la fecha · Falta el monto')
  })
})

describe('mensajes de la base (§5.3)', () => {
  const ready = REVIEW.rows.find((r) => r.rowNumber === 6)!
  it.each([
    ['la cuenta no existe, no es tuya o está archivada', 'No existe la cuenta «Billetera virtual» o está archivada'],
    ['la categoría no existe, no es tuya o está archivada', 'No existe la categoría «Transporte» o está archivada'],
    ['FR-06: la fecha no puede ser posterior a hoy', 'La fecha no puede ser futura'],
    ['I4: el monto debe ser mayor a cero', 'La base rechazó esta fila: I4: el monto debe ser mayor a cero'],
  ])('%s', (server, shown) => {
    expect(dbRejectionMessage(server, ready)).toBe(shown)
  })
})
