// Único módulo que importa decimal.js (ADR-013). El resto del dominio usa `Decimal` desde acá.
import Decimal from 'decimal.js'

export { Decimal }

/**
 * Parsea un monto que viene como string (PostgREST, input). Nunca desde `number` (C2).
 * Acepta "1234.56" (PostgREST) y "1.234,56" (formato argentino): si hay coma, la coma es el
 * decimal y los puntos son miles.
 */
export function parseMoney(value: string): Decimal {
  const v = value.trim()
  return new Decimal(v.includes(',') ? v.replace(/\./g, '').replace(',', '.') : v)
}

// Número con signo opcional: "1234.56", "1234,56" o "1.234,56". Sin exponentes, hex ni
// Infinity, que decimal.js aceptaría.
const MONEY_INPUT_RE = /^-?(?:\d+(?:\.\d+)?|(?:\d{1,3}(?:\.\d{3})+|\d+),\d+)$/
// Puntos de miles sin coma decimal ("1.500", "12.345.678"): en Argentina es un entero.
const THOUSANDS_ONLY_RE = /^-?\d{1,3}(?:\.\d{3})+$/

/**
 * Monto tipeado en el formulario → Decimal, o null si está vacío o no es un número. El signo se
 * conserva: decidir que un negativo no vale es de validateTransactionDraft (I4), no del parseo.
 * Un punto seguido de grupos de exactamente 3 dígitos es separador de miles: "1.500" son mil
 * quinientos, no 1,5 (con parseMoney, decimal.js lo leería como 1.500 → $1,50 y pasaría la
 * validación de 2 decimales). "1.5" o "1234.56" siguen siendo decimales.
 */
export function tryParseMoney(value: string): Decimal | null {
  const v = value.trim()
  if (THOUSANDS_ONLY_RE.test(v)) return new Decimal(v.replace(/\./g, ''))
  return MONEY_INPUT_RE.test(v) ? parseMoney(v) : null
}

/**
 * Prorrateo: cuotas 1..n-1 = total/n truncado a 2 decimales; la última absorbe el resto
 * (C3, ADR-013). Con half-up la última podría quedar menor que las demás.
 */
export function prorate(total: Decimal, n: number): Decimal[] {
  const base = total.div(n).toDecimalPlaces(2, Decimal.ROUND_DOWN)
  const parts = Array.from({ length: n - 1 }, () => base)
  return [...parts, total.minus(base.times(n - 1))]
}

/** Conversión a ARS: half-up a 2 decimales, igual al round() de la columna generada. */
export function convertToArs(amount: Decimal, fxRate: Decimal | null): Decimal {
  const converted = fxRate ? amount.times(fxRate) : amount
  return converted.toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
}

/** Formato argentino: $1.234,56 */
export function formatArs(amount: Decimal): string {
  return `$${formatArgentineNumber(amount)}`
}

/** Dólares con el mismo formato argentino: US$1.234,56 */
export function formatUsd(amount: Decimal): string {
  return `US$${formatArgentineNumber(amount)}`
}

function formatArgentineNumber(amount: Decimal): string {
  const [int, dec] = amount.toFixed(2).split('.')
  return `${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`
}
