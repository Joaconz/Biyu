import { addMonths, formatPeriod, parsePeriod, type Period } from './period'
import { convertToArs, formatArs, formatUsd, prorate, type Decimal } from './money'
import type { DraftErrors, TransactionDraft } from './validation'

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

export interface InstallmentsPreview {
  /** "12 cuotas de $10.000,00 — de 2026-08 a 2027-07": `${installments} — ${range}` */
  summary: string
  /** "12 cuotas de $10.000,00" */
  installments: string
  /** "de 2026-08 a 2027-07". Separado para que la UI no lo corte en el guion del período. */
  range: string
  /** "La última es de $33.333,34" cuando el prorrateo deja resto (C3); si no, null. */
  lastInstallment: string | null
}

/**
 * Previsualización del impacto mensual (US-13), con la misma regla que persiste
 * create_transaction: la calcula generateLedgerEntries, no se rehace acá. Los montos van en la
 * moneda de la transacción. Devuelve null con una sola cuota o si el monto, las cuotas o la
 * fecha tienen errores de validateTransactionDraft (no hay nada confiable para mostrar).
 */
export function previewInstallments(draft: TransactionDraft, errors: DraftErrors): InstallmentsPreview | null {
  const { amount, currency, installmentsCount, occurredOn } = draft
  const firstPeriod = parsePeriod(occurredOn.slice(0, 7))
  if (installmentsCount < 2 || !amount || !firstPeriod) return null
  if (errors.amount || errors.installmentsCount || errors.occurredOn) return null
  // Solo se muestra la serie en la moneda original: el tipo de cambio no cambia ese reparto.
  const entries = generateLedgerEntries(amount, null, installmentsCount, firstPeriod)
  const first = entries[0]
  const last = entries[entries.length - 1]
  const format = currency === 'USD' ? formatUsd : formatArs
  const installments = `${installmentsCount} cuotas de ${format(first.amount)}`
  const range = `de ${formatPeriod(first.period)} a ${formatPeriod(last.period)}`
  return {
    summary: `${installments} — ${range}`,
    installments,
    range,
    lastInstallment: last.amount.eq(first.amount) ? null : `La última es de ${format(last.amount)}`,
  }
}
