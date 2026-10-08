// Borde con las librerías de .xlsx (ADR-042). Se carga con import() solo desde la pantalla de
// importación, así no entra al bundle de las demás. Usa las builds "universal", que corren igual en
// el navegador y en Node: los tests leen el archivo de ejemplo con el mismo código que la app.
import { readSheet } from 'read-excel-file/universal'
import writeXlsxFile from 'write-excel-file/universal'
import { templateSheets, type SheetCell } from '@/domain/importFile'

/** El texto de un número tal como lo guardó Excel. Marcado para no confundirlo con una celda de texto. */
interface RawNumber {
  readonly rawNumber: string
}

/**
 * Las celdas de la primera hoja (las demás se ignoran, §2). Con `parseNumber`, la librería entrega
 * el `<v>` de cada celda numérica como texto, sin pasar por `number` (C2). Las fechas llegan como
 * `Date` en UTC y se toma solo el día. Si el archivo no se puede abrir, la promesa se rechaza (A3).
 */
export async function readFirstSheet(file: Blob | ArrayBuffer): Promise<SheetCell[][]> {
  const data = await readSheet<RawNumber>(file, 1, {
    parseNumber: (text: string) => ({ rawNumber: text }),
    trim: false,
  })
  return data.map((row) => row.map(toSheetCell))
}

function toSheetCell(value: unknown): SheetCell {
  if (value === null || value === undefined) return { kind: 'empty' }
  if (typeof value === 'string') return { kind: 'text', text: value }
  if (typeof value === 'boolean') return { kind: 'boolean', value }
  if (value instanceof Date) {
    // Un serial fuera de rango (99999999 con formato de fecha) no es un día: Excel lo muestra como
    // "########", y así se muestra en la fila (F2) en lugar de rechazar el archivo entero.
    const year = value.getUTCFullYear()
    if (Number.isNaN(value.getTime()) || year < 1 || year > 9999) return { kind: 'text', text: '########' }
    return { kind: 'date', date: value.toISOString().slice(0, 10) }
  }
  if (typeof value === 'object' && 'rawNumber' in value) return { kind: 'number', text: String(value.rawNumber) }
  // Sin parseNumber la librería devolvería number; con él, nada más llega acá.
  return { kind: 'text', text: String(value) }
}

/** La plantilla de §1, generada en el navegador. */
export function buildTemplate(): Promise<Blob> {
  const sheets = templateSheets().map(({ name, rows }) => ({ sheet: name, data: rows }))
  return writeXlsxFile(sheets).toBlob()
}
