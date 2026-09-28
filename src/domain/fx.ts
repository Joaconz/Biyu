import { Decimal, tryParseMoney } from './money'

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

const MAX_FX_RATE = new Decimal('9999999999.9999')

export type FxRateValidation =
  | { rate: Decimal; error: null }
  | { rate: null; error: string }

/** Valida el TC tipeado antes de enviarlo; Postgres repite estas reglas como autoridad (C6). */
export function validateFxRateInput(value: string): FxRateValidation {
  if (!value.trim()) return { rate: null, error: 'Ingresá un tipo de cambio' }
  const rate = tryParseMoney(value)
  if (!rate) return { rate: null, error: 'Ingresá un número válido' }
  if (rate.lte(0)) return { rate: null, error: 'El tipo de cambio debe ser mayor a cero' }
  if (rate.decimalPlaces() > 4) return { rate: null, error: 'Usá hasta 4 decimales' }
  if (rate.greaterThan(MAX_FX_RATE)) return { rate: null, error: 'El tipo de cambio es demasiado grande' }
  return { rate, error: null }
}
