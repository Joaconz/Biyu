import { describe, expect, it } from 'vitest'
import {
  checkFileBeforeReading,
  fileErrorMessage,
  ignoredColumnsMessage,
  IMPORT_COLUMNS,
  MAX_FILE_BYTES,
  readImportSheet,
  templateSheets,
  type SheetCell,
} from '@/domain/importFile'

const t = (text: string): SheetCell => ({ kind: 'text', text })
const n = (text: string): SheetCell => ({ kind: 'number', text })
const E: SheetCell = { kind: 'empty' }
const HEADERS = IMPORT_COLUMNS.map((c) => t(c.header))
const ROW = [t('01/09/2026'), t('Gasto'), n('45800'), t('ARS'), E, t('Otros'), t('Efectivo'), E, t('Nota')]

function rows(count: number): SheetCell[][] {
  return Array.from({ length: count }, () => ROW)
}

describe('A1 y A2: antes de abrir el archivo (US-74 · CA-3, CA-4)', () => {
  it('acepta .xlsx sin distinguir mayúsculas', () => {
    expect(checkFileBeforeReading({ name: 'gastos.xlsx', size: 10 })).toBeNull()
    expect(checkFileBeforeReading({ name: 'GASTOS.XLSX', size: 10 })).toBeNull()
  })

  it.each(['gastos.xls', 'gastos.csv', 'gastos.ods', 'gastos.numbers', 'gastos.xlsx.pdf', 'gastos'])('A1 con %s', (name) => {
    const error = checkFileBeforeReading({ name, size: 10 })
    expect(error).toEqual({ rule: 'A1' })
    expect(fileErrorMessage(error!)).toBe('Solo se aceptan archivos .xlsx (Excel).')
  })

  it('A2: 1.048.576 bytes pasa y 1.048.577 no', () => {
    expect(checkFileBeforeReading({ name: 'a.xlsx', size: MAX_FILE_BYTES })).toBeNull()
    const error = checkFileBeforeReading({ name: 'a.xlsx', size: MAX_FILE_BYTES + 1 })
    expect(fileErrorMessage(error!)).toBe('El archivo pesa más de 1 MB. Dividilo en varios archivos.')
  })

  it('A1 se evalúa antes que A2', () => {
    expect(checkFileBeforeReading({ name: 'a.csv', size: MAX_FILE_BYTES + 1 })).toEqual({ rule: 'A1' })
  })

  it('A3 tiene su mensaje', () => {
    expect(fileErrorMessage({ rule: 'A3' })).toBe(
      'No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.',
    )
  })
})

describe('A4 a A7: la primera hoja (US-74 · CA-3 a CA-7)', () => {
  it('A4 con varias columnas faltantes, en el orden de la spec', () => {
    const result = readImportSheet([[t('Monto'), t('Fecha')], ROW])
    expect(result).toEqual({ ok: false, error: { rule: 'A4', missing: ['Tipo', 'Moneda', 'Cuenta'] } })
    expect(fileErrorMessage((result as { error: never }).error)).toBe(
      'Faltan columnas: Tipo, Moneda, Cuenta. La primera fila tiene que tener los encabezados de la plantilla.',
    )
  })

  it('A4 con una sola faltante usa el singular', () => {
    const result = readImportSheet([HEADERS.filter((_, i) => i !== 6)])
    expect(fileErrorMessage((result as { error: never }).error)).toBe(
      'Falta la columna: Cuenta. La primera fila tiene que tener los encabezados de la plantilla.',
    )
  })

  it('A4 con una hoja vacía nombra los cinco obligatorios', () => {
    expect(readImportSheet([])).toEqual({
      ok: false,
      error: { rule: 'A4', missing: ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Cuenta'] },
    })
  })

  it('A5: un encabezado repetido, aunque cambie la escritura', () => {
    const result = readImportSheet([[...HEADERS, t(' categoria ')], ROW])
    expect(fileErrorMessage((result as { error: never }).error)).toBe('La columna Categoría está repetida. Dejá una sola.')
  })

  it('A4 se evalúa antes que A5', () => {
    expect(readImportSheet([[t('Fecha'), t('Fecha')]])).toMatchObject({ error: { rule: 'A4' } })
  })

  it('A6: la plantilla sin cambios no tiene filas con datos', () => {
    const result = readImportSheet([HEADERS])
    expect(fileErrorMessage((result as { error: never }).error)).toBe(
      'El archivo no tiene filas con datos debajo de los encabezados.',
    )
  })

  it('A6: filas con solo espacios, o con datos solo en columnas ignoradas, son vacías', () => {
    const blank = [t('  '), E, E, E, E, E, E, E, E, t('dato en Comercio')]
    expect(readImportSheet([[...HEADERS, t('Comercio')], blank])).toMatchObject({ error: { rule: 'A6' } })
  })

  it('A7: 500 filas pasan y 501 muestran la cantidad', () => {
    expect(readImportSheet([HEADERS, ...rows(500)])).toMatchObject({ ok: true })
    const result = readImportSheet([HEADERS, ...rows(501)])
    expect(fileErrorMessage((result as { error: never }).error)).toBe(
      'El archivo tiene 501 filas con datos y el máximo es 500. Dividilo en varios archivos.',
    )
  })

  it('las filas vacías no cuentan para el límite', () => {
    const grid = [HEADERS, ...rows(250), [], [E, t(' ')], ...rows(250)]
    const result = readImportSheet(grid)
    expect(result.ok && result.sheet.rows.length).toBe(500)
  })
})

describe('encabezados y filas (US-74 · CA-6, CA-7)', () => {
  it('reconoce encabezados sin mayúsculas, tildes ni espacios, en cualquier orden', () => {
    const headers = [t('monto'), t('FECHA'), t(' CATEGORIA '), t('Cuenta'), t('moneda'), t('TIPO')]
    const line = [n('100'), t('01/09/2026'), t('Otros'), t('Efectivo'), t('ARS'), t('Gasto')]
    const result = readImportSheet([headers, line])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const [row] = result.sheet.rows
    expect(row.cells.amount).toEqual(n('100'))
    expect(row.cells.date).toEqual(t('01/09/2026'))
    expect(row.cells.category).toEqual(t('Otros'))
    expect(row.cells.type).toEqual(t('Gasto'))
  })

  it('reconoce una tilde escrita como carácter aparte (NFD)', () => {
    const headers = [...HEADERS.slice(0, 5), t('Categória'), ...HEADERS.slice(6)]
    expect(readImportSheet([headers, ROW])).toMatchObject({ ok: true, sheet: { ignoredColumns: [] } })
  })

  it('lista los encabezados desconocidos en el orden del archivo', () => {
    const result = readImportSheet([[t('Comercio'), ...HEADERS, t(' Rubro ')], [E, ...ROW]])
    expect(result.ok && result.sheet.ignoredColumns).toEqual(['Comercio', 'Rubro'])
    expect(ignoredColumnsMessage(['Comercio'])).toBe('Se ignoraron las columnas: Comercio.')
    expect(ignoredColumnsMessage(['Comercio', 'Rubro'])).toBe('Se ignoraron las columnas: Comercio, Rubro.')
    expect(ignoredColumnsMessage([])).toBeNull()
  })

  it('un encabezado vacío no es una columna ignorada', () => {
    const result = readImportSheet([[...HEADERS, E, t('  ')], ROW])
    expect(result.ok && result.sheet.ignoredColumns).toEqual([])
  })

  it('las columnas opcionales que faltan se leen vacías', () => {
    const headers = [t('Fecha'), t('Tipo'), t('Monto'), t('Moneda'), t('Cuenta')]
    const result = readImportSheet([headers, [t('01/09/2026'), t('Gasto'), n('10'), t('ARS'), t('Efectivo')]])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    const { cells } = result.sheet.rows[0]
    expect([cells.fxRate, cells.category, cells.installments, cells.note]).toEqual([E, E, E, E])
  })

  it('numera con el número de fila de Excel y no renumera tras una vacía', () => {
    const result = readImportSheet([HEADERS, ROW, [], ROW])
    expect(result.ok && result.sheet.rows.map((r) => r.rowNumber)).toEqual([2, 4])
  })
})

describe('plantilla (US-74 · CA-2)', () => {
  it('hoja 1 "Movimientos" con los nueve encabezados de A a I y nada más', () => {
    const [rowsSheet, instructions] = templateSheets()
    expect(rowsSheet).toEqual({
      name: 'Movimientos',
      rows: [['Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Nota']],
    })
    expect(instructions.name).toBe('Instrucciones')
    expect(instructions.rows[0]).toEqual(['Encabezado', 'Celda obligatoria', 'Qué va', 'Formatos aceptados'])
    expect(instructions.rows.slice(1).map((r) => r[0])).toEqual(rowsSheet.rows[0])
  })
})
