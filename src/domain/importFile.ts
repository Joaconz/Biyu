// Importar desde Excel (US-74): validación del archivo entero (A1–A7) y lectura de los
// encabezados. Recibe las celdas ya extraídas del .xlsx (src/lib/xlsx.ts): este módulo no conoce la
// librería que abre el archivo, solo la forma de cada celda. Spec: entrega-2/historias/importar-excel.md
// §2 y §3.

/**
 * Una celda de la primera hoja, tal como la deja el lector del .xlsx. Un número llega como el texto
 * que guardó Excel (`<v>`), nunca como `number` (C2); una fecha, como el día calendario que guarda la
 * celda, sin hora.
 */
export type SheetCell =
  | { kind: 'empty' }
  | { kind: 'text'; text: string }
  | { kind: 'number'; text: string }
  | { kind: 'date'; date: string } // YYYY-MM-DD
  | { kind: 'boolean'; value: boolean }

export const EMPTY_CELL: SheetCell = { kind: 'empty' }

export type ImportColumn =
  | 'date'
  | 'type'
  | 'amount'
  | 'currency'
  | 'fxRate'
  | 'category'
  | 'account'
  | 'installments'
  | 'note'

export interface ImportColumnSpec {
  key: ImportColumn
  /** El encabezado de la plantilla. */
  header: string
  /** Sin el encabezado, el archivo se rechaza con A4. */
  requiredHeader: boolean
  /** Las cuatro columnas de la tabla de §2, que también van en la hoja "Instrucciones". */
  requiredCell: string
  meaning: string
  formats: string
}

/**
 * Las columnas de §2, en el orden de la plantilla, con el texto de su tabla (sin las referencias
 * internas de la spec, que no le dicen nada a quien llena la planilla).
 */
export const IMPORT_COLUMNS: readonly ImportColumnSpec[] = [
  {
    key: 'date',
    header: 'Fecha',
    requiredHeader: true,
    requiredCell: 'Sí',
    meaning: 'Fecha del movimiento',
    formats:
      'Celda con formato de fecha de Excel (si tiene hora, se toma solo el día), o texto DD/MM/AAAA con día y mes de 1 o 2 dígitos ("5/9/2026" vale). Una celda numérica sin formato de fecha (por ejemplo 46000) no es una fecha',
  },
  { key: 'type', header: 'Tipo', requiredHeader: true, requiredCell: 'Sí', meaning: 'Gasto o Ingreso', formats: 'Texto, sin distinguir mayúsculas' },
  {
    key: 'amount',
    header: 'Monto',
    requiredHeader: true,
    requiredCell: 'Sí',
    meaning: 'Monto total del movimiento, siempre positivo (el signo lo da Tipo)',
    formats:
      'Celda numérica, o texto: "1234,56", "1.234,56", "1234.56"; un punto seguido de grupos de 3 dígitos es separador de miles ("1.500" = 1500). Sin símbolo de moneda ni espacios internos',
  },
  { key: 'currency', header: 'Moneda', requiredHeader: true, requiredCell: 'Sí', meaning: 'ARS o USD', formats: 'Texto, sin distinguir mayúsculas' },
  {
    key: 'fxRate',
    header: 'Tipo de cambio',
    requiredHeader: false,
    requiredCell: 'Solo si Moneda = USD',
    meaning: 'Pesos por dólar de esa fila',
    formats: 'Celda numérica o texto con el criterio de Monto, hasta 4 decimales. No se completa con el tipo de cambio de referencia del mes',
  },
  {
    key: 'category',
    header: 'Categoría',
    requiredHeader: false,
    requiredCell: 'Sí si Tipo = Gasto',
    meaning: 'Nombre de una categoría activa del usuario',
    formats:
      'Se compara sin distinguir mayúsculas; las tildes sí cuentan, porque "Educación" y "Educacion" pueden ser dos categorías distintas. En un Ingreso es opcional; si viene, tiene que existir',
  },
  {
    key: 'account',
    header: 'Cuenta',
    requiredHeader: true,
    requiredCell: 'Sí',
    meaning: 'Nombre de una cuenta activa del usuario',
    formats: 'Mismo criterio que Categoría',
  },
  {
    key: 'installments',
    header: 'Cuotas',
    requiredHeader: false,
    requiredCell: 'No (vacía = 1)',
    meaning: 'Cantidad de cuotas',
    formats: 'Entero de 1 a 12, celda numérica o texto',
  },
  { key: 'note', header: 'Nota', requiredHeader: false, requiredCell: 'No', meaning: 'Descripción', formats: 'Texto libre. Vacía = sin descripción' },
]

/** El archivo que baja "Descargar plantilla" (§1). */
export const TEMPLATE_FILE_NAME = 'biyu-plantilla-importacion.xlsx'
export const TEMPLATE_SHEETS = { rows: 'Movimientos', instructions: 'Instrucciones' } as const
export const INSTRUCTIONS_HEADER = ['Encabezado', 'Celda obligatoria', 'Qué va', 'Formatos aceptados'] as const

/** Hoja 1 con solo los encabezados y hoja 2 con la tabla de columnas de §2. */
export function templateSheets(): { name: string; rows: string[][] }[] {
  return [
    { name: TEMPLATE_SHEETS.rows, rows: [IMPORT_COLUMNS.map((c) => c.header)] },
    {
      name: TEMPLATE_SHEETS.instructions,
      rows: [[...INSTRUCTIONS_HEADER], ...IMPORT_COLUMNS.map((c) => [c.header, c.requiredCell, c.meaning, c.formats])],
    },
  ]
}

/** 1 MB: un archivo de exactamente este tamaño se acepta (§2). */
export const MAX_FILE_BYTES = 1_048_576
/** Filas con datos por archivo (§2). Las vacías no cuentan. */
export const MAX_IMPORT_ROWS = 500

export type FileError =
  | { rule: 'A1' }
  | { rule: 'A2' }
  | { rule: 'A3' }
  | { rule: 'A4'; missing: string[] }
  | { rule: 'A5'; column: string }
  | { rule: 'A6' }
  | { rule: 'A7'; rows: number }

/** Mensajes exactos de §3. */
export function fileErrorMessage(error: FileError): string {
  switch (error.rule) {
    case 'A1':
      return 'Solo se aceptan archivos .xlsx (Excel).'
    case 'A2':
      return 'El archivo pesa más de 1 MB. Dividilo en varios archivos.'
    case 'A3':
      return 'No pudimos leer el archivo. Abrilo en Excel, guardalo como .xlsx y probá de nuevo.'
    case 'A4': {
      const tail = 'La primera fila tiene que tener los encabezados de la plantilla.'
      return error.missing.length === 1
        ? `Falta la columna: ${error.missing[0]}. ${tail}`
        : `Faltan columnas: ${error.missing.join(', ')}. ${tail}`
    }
    case 'A5':
      return `La columna ${error.column} está repetida. Dejá una sola.`
    case 'A6':
      return 'El archivo no tiene filas con datos debajo de los encabezados.'
    case 'A7':
      return `El archivo tiene ${error.rows} filas con datos y el máximo es 500. Dividilo en varios archivos.`
  }
}

/** A1 y A2: se miran antes de abrir el archivo. */
export function checkFileBeforeReading(file: { name: string; size: number }): FileError | null {
  if (!file.name.toLowerCase().endsWith('.xlsx')) return { rule: 'A1' }
  if (file.size > MAX_FILE_BYTES) return { rule: 'A2' }
  return null
}

/**
 * Texto de una celda como lo lee la importación (§2): sin espacios al principio ni al final y en
 * Unicode NFC, así una tilde escrita como carácter aparte cuenta igual que la compuesta.
 */
export function cleanText(text: string): string {
  return text.normalize('NFC').trim()
}

/** Encabezado comparable: sin mayúsculas, sin tildes y sin espacios en los bordes ("CATEGORIA" = "Categoría"). */
export function headerKey(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Mn}/gu, '')
    .trim()
    .toLowerCase()
}

const COLUMN_BY_HEADER = new Map(IMPORT_COLUMNS.map((c) => [headerKey(c.header), c]))

/** Una fila con datos de la primera hoja. `rowNumber` es el número de fila de Excel (la primera de datos es la 2). */
export interface ImportRow {
  rowNumber: number
  cells: Record<ImportColumn, SheetCell>
}

export interface ImportSheet {
  rows: ImportRow[]
  /** Encabezados que no son de §2, en el orden del archivo, como están escritos (recortados). */
  ignoredColumns: string[]
}

export type ReadSheetResult = { ok: true; sheet: ImportSheet } | { ok: false; error: FileError }

/** Vacía si no tiene nada o solo espacios (§2). */
export function isBlankCell(cell: SheetCell): boolean {
  return cell.kind === 'empty' || (cell.kind === 'text' && cleanText(cell.text) === '')
}

/**
 * A4 a A7 sobre la primera hoja: `grid[0]` es la fila 1 (encabezados) y `grid[i]` la fila i + 1.
 * Una columna opcional que falta se lee como vacía en todas las filas; las filas vacías se saltean
 * sin renumerar.
 */
export function readImportSheet(grid: readonly (readonly SheetCell[])[]): ReadSheetResult {
  const headerRow = grid[0] ?? []
  const indexOf = new Map<ImportColumn, number>()
  const ignoredColumns: string[] = []
  let repeated: ImportColumnSpec | null = null

  for (const [index, cell] of headerRow.entries()) {
    if (isBlankCell(cell)) continue
    const raw = cellAsText(cell)
    const column = COLUMN_BY_HEADER.get(headerKey(raw))
    if (!column) ignoredColumns.push(raw)
    else if (!indexOf.has(column.key)) indexOf.set(column.key, index)
    else repeated ??= column
  }

  const missing = IMPORT_COLUMNS.filter((c) => c.requiredHeader && !indexOf.has(c.key)).map((c) => c.header)
  if (missing.length > 0) return { ok: false, error: { rule: 'A4', missing } }
  if (repeated) return { ok: false, error: { rule: 'A5', column: repeated.header } }

  const rows: ImportRow[] = []
  grid.slice(1).forEach((line, i) => {
    const cells = Object.fromEntries(
      IMPORT_COLUMNS.map((c) => {
        const index = indexOf.get(c.key)
        return [c.key, index === undefined ? EMPTY_CELL : (line[index] ?? EMPTY_CELL)]
      }),
    ) as Record<ImportColumn, SheetCell>
    if (Object.values(cells).some((cell) => !isBlankCell(cell))) rows.push({ rowNumber: i + 2, cells })
  })

  if (rows.length === 0) return { ok: false, error: { rule: 'A6' } }
  if (rows.length > MAX_IMPORT_ROWS) return { ok: false, error: { rule: 'A7', rows: rows.length } }
  return { ok: true, sheet: { rows, ignoredColumns } }
}

/** El texto que tenía la celda, para mostrarla cuando no se pudo interpretar (§1) o como encabezado. */
export function cellAsText(cell: SheetCell): string {
  switch (cell.kind) {
    case 'empty':
      return ''
    case 'text':
    case 'number':
      return cleanText(cell.text)
    case 'date': {
      const [year, month, day] = cell.date.split('-')
      return `${day}/${month}/${year}`
    }
    case 'boolean':
      return cell.value ? 'VERDADERO' : 'FALSO'
  }
}

/** "Se ignoraron las columnas: A, B." (§1). */
export function ignoredColumnsMessage(columns: readonly string[]): string | null {
  return columns.length === 0 ? null : `Se ignoraron las columnas: ${columns.join(', ')}.`
}
