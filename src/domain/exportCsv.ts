import { currentPeriod, daysInMonth, formatPeriod, formatPeriodLong, isPeriodBefore, type Period } from './period'

export type ExportScope = 'month' | 'year'

export interface ExportTransactionRow {
  id: string
  type: 'expense' | 'income'
  amount: string
  currency: 'ARS' | 'USD'
  fx_rate: string | null
  amount_ars: string
  installments_count: number
  occurred_on: string
  first_period: string
  description: string | null
  created_at: string
  category_name: string | null
  account_name: string
}

const AMOUNT_REGEX = /^\d+\.\d{2}$/
const FX_RATE_REGEX = /^\d+\.\d{4}$/

/**
 * Calcula el rango de fechas [startDate, endDate] en formato YYYY-MM-DD
 * para el período y alcance elegidos (C1, ADR-029).
 */
export function getExportDateRange(
  scope: ExportScope,
  period: Period,
): { startDate: string; endDate: string } {
  if (scope === 'year') {
    return {
      startDate: `${period.year}-01-01`,
      endDate: `${period.year}-12-31`,
    }
  }

  const startDate = `${formatPeriod(period)}-01`
  const lastDay = daysInMonth(period)
  const endDate = `${formatPeriod(period)}-${String(lastDay).padStart(2, '0')}`
  return { startDate, endDate }
}

/**
 * Nombre de archivo propuesto para la descarga (ADR-029).
 * Mes: `biyu-movimientos-AAAA-MM.csv`
 * Año: `biyu-movimientos-AAAA.csv`
 */
export function getExportFileName(scope: ExportScope, period: Period): string {
  if (scope === 'year') {
    return `biyu-movimientos-${period.year}.csv`
  }
  return `biyu-movimientos-${formatPeriod(period)}.csv`
}

/**
 * Solo se permite exportar el mes actual o meses pasados (CA-2, ADR-029).
 */
export function isExportAvailable(period: Period, today: Date): boolean {
  const current = currentPeriod(today)
  return !isPeriodBefore(current, period)
}

/**
 * Rótulo para la opción de radio (CA-1):
 * 'Solo <mes año>' (ej. 'Solo septiembre 2026') o 'Todo <año>' (ej. 'Todo 2026').
 */
export function formatExportScopeLabel(scope: ExportScope, period: Period): string {
  if (scope === 'year') {
    return `Todo ${period.year}`
  }
  return `Solo ${formatPeriodLong(period)}`
}

/**
 * Mensaje de estado Vacío (CA-20):
 * "No tenés movimientos con fecha en <mes año>." o "No tenés movimientos con fecha en <año>."
 */
export function formatEmptyExportMessage(scope: ExportScope, period: Period): string {
  if (scope === 'year') {
    return `No tenés movimientos con fecha en ${period.year}.`
  }
  return `No tenés movimientos con fecha en ${formatPeriodLong(period)}.`
}

/**
 * Formatea la cantidad de movimientos para el toast de éxito (CA-15, CA-19):
 * 1 -> "Exportamos 1 movimiento"
 * N -> "Exportamos N movimientos" (con punto de miles para 1.000, 1.500, etc.)
 */
export function formatSuccessExportMessage(count: number): string {
  if (count === 1) {
    return 'Exportamos 1 movimiento'
  }
  const formatted = String(count).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `Exportamos ${formatted} movimientos`
}

const FORMULA_PREFIX_CHARS = ['=', '+', '-', '@', '\t', '\r']

/**
 * Neutralización de fórmulas (ADR-029, OWASP CSV injection):
 * si empieza con =, +, -, @, \t o \r, se le agrega un apóstrofo ' adelante.
 * Los espacios al principio y final se conservan.
 */
export function neutralizeCsvField(value: string): string {
  if (value.length > 0 && FORMULA_PREFIX_CHARS.includes(value[0])) {
    return `'${value}`
  }
  return value
}

/**
 * Entrecomillado según RFC 4180 / ADR-029:
 * Solo se encierra entre comillas dobles si contiene coma, comillas dobles, CR o LF.
 * Las comillas internas se duplican.
 */
export function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\r') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`
  }
  return value
}

/**
 * Valida los datos y formatos exactos requeridos para exportar (CA-10, CA-11, ADR-029).
 * Si un valor leído no cumple ^\d+\.\d{2}$ (montos) o ^\d+\.\d{4}$ (tipo de cambio en USD),
 * devuelve false.
 */
export function validateExportTransaction(tx: ExportTransactionRow): boolean {
  if (!AMOUNT_REGEX.test(tx.amount)) return false
  if (!AMOUNT_REGEX.test(tx.amount_ars)) return false

  if (tx.currency === 'USD') {
    if (!tx.fx_rate || !FX_RATE_REGEX.test(tx.fx_rate)) {
      return false
    }
  } else if (tx.currency !== 'ARS') {
    return false
  }

  if (tx.type !== 'expense' && tx.type !== 'income') return false
  if (
    !Number.isInteger(tx.installments_count) ||
    tx.installments_count < 1 ||
    tx.installments_count > 12
  ) {
    return false
  }
  if (!tx.occurred_on || tx.occurred_on.length !== 10) return false
  if (!tx.first_period || tx.first_period.length < 7) return false
  if (!tx.id || tx.id.length !== 36) return false

  return true
}

/**
 * Comparador para ordenar filas (CA-14, ADR-029):
 * 1. fecha (occurred_on) asc
 * 2. created_at asc
 * 3. id asc (en minúsculas)
 */
export function compareExportRows(a: ExportTransactionRow, b: ExportTransactionRow): number {
  const dateComp = a.occurred_on.localeCompare(b.occurred_on)
  if (dateComp !== 0) return dateComp

  const createdComp = a.created_at.localeCompare(b.created_at)
  if (createdComp !== 0) return createdComp

  return a.id.toLowerCase().localeCompare(b.id.toLowerCase())
}

const CSV_HEADER =
  'fecha,tipo,monto,moneda,tipo_de_cambio,monto_ars,categoria,cuenta,cuotas,primer_periodo,descripcion,id'

/**
 * Construye el archivo CSV completo (CA-8, CA-9, CA-10, CA-12, CA-13, CA-14, ADR-029).
 * - UTF-8 con BOM (\uFEFF -> bytes EF BB BF)
 * - Separador coma
 * - Fin de línea CRLF (\r\n) en cada fila, incluida la última
 * - Encabezado exacto
 */
export function buildExportCsv(rows: ExportTransactionRow[]): string {
  for (const row of rows) {
    if (!validateExportTransaction(row)) {
      throw new Error(`Transacción inválida para exportación: ${row.id}`)
    }
  }

  const sortedRows = [...rows].sort(compareExportRows)

  const lines: string[] = [CSV_HEADER]

  for (const row of sortedRows) {
    const fecha = row.occurred_on
    const tipo = row.type === 'expense' ? 'gasto' : 'ingreso'
    const monto = row.amount
    const moneda = row.currency
    const tipoDeCambio = row.currency === 'ARS' ? '' : (row.fx_rate ?? '')
    const montoArs = row.amount_ars
    const categoria = escapeCsvField(neutralizeCsvField(row.category_name ?? ''))
    const cuenta = escapeCsvField(neutralizeCsvField(row.account_name))
    const cuotas = String(row.installments_count)
    const primerPeriodo = row.first_period.slice(0, 7)
    const descripcion = escapeCsvField(neutralizeCsvField(row.description ?? ''))
    const id = row.id.toLowerCase()

    const line = [
      fecha,
      tipo,
      monto,
      moneda,
      tipoDeCambio,
      montoArs,
      categoria,
      cuenta,
      cuotas,
      primerPeriodo,
      descripcion,
      id,
    ].join(',')

    lines.push(line)
  }

  // BOM UTF-8 (\uFEFF) al inicio y cada fila terminada en \r\n
  return `\uFEFF${lines.join('\r\n')}\r\n`
}
