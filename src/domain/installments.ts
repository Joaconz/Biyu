import { addMonths, type Period } from './period'
import { convertToArs, prorate, type Decimal } from './money'

export interface LedgerEntryDraft {
  period: Period
  installmentNumber: number
  amount: Decimal // en la moneda de la transacción
  amountArs: Decimal // prorrateo del total en ARS, no conversión cuota a cuota (I1')
}

// I1:  sum(amount)    == amount, exacto.
// I1': sum(amountArs) == convertToArs(amount, fxRate), exacto.
// Copia de previsualización de la regla de create_transaction (la que persiste es la de SQL).
export function generateLedgerEntries(
  amount: Decimal,
  fxRate: Decimal | null, // null ⇒ ARS (I5)
  installmentsCount: number,
  firstPeriod: Period,
): LedgerEntryDraft[] {
  if (!Number.isInteger(installmentsCount) || installmentsCount < 1) {
    throw new RangeError('installmentsCount debe ser un entero >= 1')
  }
  const amounts = prorate(amount, installmentsCount)
  const amountsArs = prorate(convertToArs(amount, fxRate), installmentsCount)
  return amounts.map((a, i) => ({
    period: addMonths(firstPeriod, i),
    installmentNumber: i + 1,
    amount: a,
    amountArs: amountsArs[i],
  }))
}
