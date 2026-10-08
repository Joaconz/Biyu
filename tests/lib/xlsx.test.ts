import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import writeXlsxFile from 'write-excel-file/universal'
import { describe, expect, it } from 'vitest'
import { readImportSheet, type SheetCell } from '@/domain/importFile'
import { buildTemplate, readFirstSheet } from '@/lib/xlsx'

const EXAMPLE = join(import.meta.dirname, '../../entrega-2/mocks/importar-excel-ejemplo.xlsx')

function exampleFile(): ArrayBuffer {
  const bytes = readFileSync(EXAMPLE)
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

describe('readFirstSheet con el archivo de ejemplo (§6)', () => {
  it('lee la hoja "Movimientos": fechas como día, números como texto y la fila 12 vacía', async () => {
    const grid = await readFirstSheet(exampleFile())
    expect(grid[0].map((c) => (c.kind === 'text' ? c.text : c.kind))).toEqual([
      'Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Nota',
    ])
    // Fila 4: fecha de Excel, 12,5 USD a 1450.
    expect(grid[3].slice(0, 5)).toEqual<SheetCell[]>([
      { kind: 'date', date: '2026-09-05' },
      { kind: 'text', text: 'Gasto' },
      { kind: 'number', text: '12.5' },
      { kind: 'text', text: 'USD' },
      { kind: 'number', text: '1450' },
    ])
    // Fila 11: fecha y monto como texto.
    expect(grid[10][0]).toEqual({ kind: 'text', text: '22/09/2026' })
    expect(grid[10][2]).toEqual({ kind: 'text', text: '9.990,50' })
    expect(grid[11].every((c) => c.kind === 'empty')).toBe(true)
  })

  it('el dominio lee 11 filas, sin la 12, y nada ignorado', async () => {
    const result = readImportSheet(await readFirstSheet(exampleFile()))
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.sheet.rows.map((r) => r.rowNumber)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13])
    expect(result.sheet.ignoredColumns).toEqual([])
  })

  it('un archivo que no es .xlsx por dentro se rechaza (A3)', async () => {
    await expect(readFirstSheet(new TextEncoder().encode('Fecha;Monto').buffer as ArrayBuffer)).rejects.toThrow()
  })
})

describe('plantilla descargada (US-74 · CA-2)', () => {
  it('sus dos hojas y, subida sin cambios, da A6', async () => {
    const template = await buildTemplate()
    const grid = await readFirstSheet(template)
    expect(grid).toEqual([
      ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Tipo de cambio', 'Categoría', 'Cuenta', 'Cuotas', 'Nota'].map((text) => ({
        kind: 'text',
        text,
      })),
    ])
    expect(readImportSheet(grid)).toEqual({ ok: false, error: { rule: 'A6' } })
  })
})

describe('solo la primera hoja (US-74 · CA-5)', () => {
  it('filas válidas en la hoja 2 y solo encabezados en la 1 da A6', async () => {
    const headers = ['Fecha', 'Tipo', 'Monto', 'Moneda', 'Cuenta']
    const file = await writeXlsxFile([
      { sheet: 'Uno', data: [headers] },
      { sheet: 'Dos', data: [headers, ['01/09/2026', 'Gasto', 100, 'ARS', 'Efectivo']] },
    ]).toBlob()
    expect(readImportSheet(await readFirstSheet(file))).toEqual({ ok: false, error: { rule: 'A6' } })
  })
})

describe('celdas de fecha', () => {
  it('con hora se lee solo el día; un serial fuera de rango no rechaza el archivo', async () => {
    const file = await writeXlsxFile([
      [
        { value: new Date(Date.UTC(2026, 8, 5, 18, 30)), type: Date, format: 'dd/mm/yyyy hh:mm' },
        { value: 99999999, format: 'dd/mm/yyyy' },
        { value: 46000 },
      ],
    ]).toBlob()
    const [[withTime, outOfRange, plain]] = await readFirstSheet(file)
    expect(withTime).toEqual({ kind: 'date', date: '2026-09-05' })
    expect(outOfRange).toEqual({ kind: 'text', text: '########' })
    expect(plain).toEqual({ kind: 'number', text: '46000' })
  })
})
