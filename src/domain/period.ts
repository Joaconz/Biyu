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
  return match ? { year: Number(match[1]), month: Number(match[2]) } : null
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
