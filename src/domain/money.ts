// Único módulo que importa decimal.js (ADR-013). El resto del dominio usa `Decimal` desde acá.
import Decimal from 'decimal.js'

export { Decimal }

/** Parsea un monto que viene como string (PostgREST, input). Nunca desde `number` (C2). */
export function parseMoney(value: string): Decimal {
  return new Decimal(value.trim().replace(',', '.'))
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
  const [int, dec] = amount.toFixed(2).split('.')
  return `$${int.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`
}
