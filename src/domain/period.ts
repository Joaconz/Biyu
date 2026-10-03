// Borde único entre el período como valor de dominio, "YYYY-MM" (URL) y
// "YYYY-MM-01" (columna date de Postgres). Nada más parsea estos formatos. También formatea la
// fecha del día "YYYY-MM-DD" (toIsoDate), que no es un período pero sale del mismo reloj local.

export interface Period {
  year: number
  month: number // 1..12
}

const PERIOD_RE = /^(\d{4})-(0[1-9]|1[0-2])$/

export function parsePeriod(value: string | null | undefined): Period | null {
  const match = value ? PERIOD_RE.exec(value) : null
  // DEF-014: Postgres no tiene año 0 en una columna date; "0000-01" rompía la consulta.
  return match && match[1] !== '0000' ? { year: Number(match[1]), month: Number(match[2]) } : null
}

export function formatPeriod({ year, month }: Period): string {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`
}

export function toDbDate(period: Period): string {
  return `${formatPeriod(period)}-01`
}

export function fromDbDate(date: string): Period {
  const period = parsePeriod(date.slice(0, 7))
  if (!period) throw new Error(`Fecha inválida: ${date}`)
  return period
}

/** Período de una fecha `YYYY-MM-DD` (ver "Fecha de imputación" en el glosario). */
export function periodOf(date: string): Period {
  return fromDbDate(date)
}

/** Período de un input date; durante la edición el valor puede estar vacío o incompleto. */
export function tryPeriodOf(date: string): Period | null {
  if (!/^\d{4}-(0[1-9]|1[0-2])-\d{2}$/.test(date)) return null
  return parsePeriod(date.slice(0, 7))
}

export function isSamePeriod(a: Period, b: Period): boolean {
  return a.year === b.year && a.month === b.month
}

/** El período actual, a partir de un `today` que entra como parámetro (C1). */
export function currentPeriod(today: Date): Period {
  return { year: today.getFullYear(), month: today.getMonth() + 1 }
}

export function addMonths({ year, month }: Period, delta: number): Period {
  const index = year * 12 + (month - 1) + delta
  return { year: Math.floor(index / 12), month: (index % 12 + 12) % 12 + 1 }
}

/**
 * Fecha calendario `YYYY-MM-DD` de un instante, en la zona horaria del dispositivo (US-03).
 * No usa toISOString(): eso es UTC y en Argentina, de 21 a 24 h, ya daría el día siguiente.
 */
export function toIsoDate(instant: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${String(instant.getFullYear()).padStart(4, '0')}-${pad(instant.getMonth() + 1)}-${pad(instant.getDate())}`
}

/** Formato de fecha para visualización en Argentina: DD/MM/AAAA */
export function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

/** Indica si el período a es estrictamente anterior al período b */
export function isPeriodBefore(a: Period, b: Period): boolean {
  if (a.year !== b.year) return a.year < b.year
  return a.month < b.month
}


// Nombres fijos y no Intl: los datos CLDR recientes abrevian septiembre como "sept." y cambiarían el
// texto según el navegador.
const MONTH_NAMES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const
const MONTH_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] as const

/** "septiembre 2026": el período como se lee en pantalla. La URL sigue en `YYYY-MM` (C11). */
export function formatPeriodLong({ year, month }: Period): string {
  return `${MONTH_NAMES[month - 1]} ${year}`
}

/** "sep 2026", para rangos como la vista previa de cuotas. */
export function formatPeriodShort({ year, month }: Period): string {
  return `${MONTH_SHORT[month - 1]} ${year}`
}

/** Suma días a una fecha calendario `YYYY-MM-DD`. Aritmética en UTC: sin corrimientos por zona horaria. */
export function addDays(isoDate: string, delta: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const shifted = new Date(Date.UTC(year, month - 1, day + delta))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${String(shifted.getUTCFullYear()).padStart(4, '0')}-${pad(shifted.getUTCMonth() + 1)}-${pad(shifted.getUTCDate())}`
}

export type RelativeDay = 'today' | 'yesterday' | 'other'

/** Qué opción de "Hoy | Ayer | Otra" corresponde a una fecha, con `today` como parámetro (C1). */
export function relativeDay(isoDate: string, today: Date): RelativeDay {
  const todayIso = toIsoDate(today)
  if (isoDate === todayIso) return 'today'
  if (isoDate === addDays(todayIso, -1)) return 'yesterday'
  return 'other'
}

const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'] as const

/** "27 sep": fecha corta para las filas de movimientos, sin el año del período que ya se está viendo. */
export function formatDayShort(isoDate: string): string {
  const [, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTH_SHORT[month - 1]}`
}

/** Encabezado de un día en la lista de movimientos: "Hoy", "Ayer" o "sábado 27 de septiembre" (C1: `today` por parámetro). */
export function formatDayHeading(isoDate: string, today: Date): string {
  const relative = relativeDay(isoDate, today)
  if (relative === 'today') return 'Hoy'
  if (relative === 'yesterday') return 'Ayer'
  const [year, month, day] = isoDate.split('-').map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return `${WEEKDAY_NAMES[weekday]} ${day} de ${MONTH_NAMES[month - 1]}`
}

/**
 * Días del período que ya pasaron, contando hoy: el mes entero si es pasado, 0 si es futuro.
 * Es el denominador de "días con registro" (US-32).
 */
export function daysElapsedInPeriod(period: Period, today: Date): number {
  const current = currentPeriod(today)
  if (isPeriodBefore(current, period)) return 0
  if (isSamePeriod(current, period)) return today.getDate()
  return new Date(Date.UTC(period.year, period.month, 0)).getUTCDate()
}
