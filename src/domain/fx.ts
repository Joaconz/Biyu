import type { Decimal } from './money'

export type Currency = 'ARS' | 'USD'

export type FxResolution =
  | { kind: 'none' } // ARS: fx_rate null (I5)
  | { kind: 'rate'; value: Decimal }
  | { kind: 'missing' } // USD sin tipo de cambio: el guardado se bloquea, nunca se asume un default

/** El override de la transacción pisa al de referencia del mes (US-21). */
export function resolveFxRate(input: {
  currency: Currency
  override?: Decimal | null
  referenceRate?: Decimal | null
}): FxResolution {
  if (input.currency === 'ARS') return { kind: 'none' }
  const value = input.override ?? input.referenceRate
  return value ? { kind: 'rate', value } : { kind: 'missing' }
}
