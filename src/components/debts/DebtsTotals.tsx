import { Amount } from '@/components/shared/Amount'
import { debtNetText, type DebtTotals } from '@/domain/debts'
import { formatArs } from '@/domain/money'

/**
 * Totales de Deudas (US-37), con la forma del Resumen (ADR-052): el neto en la tarjeta protagonista y
 * "Te deben" (verde) y "Debés" (bordó) en dos datos chicos debajo. Solo suman las pendientes y no siguen
 * el filtro de la lista.
 */
export function DebtsTotals({ totals }: { totals: DebtTotals }) {
  return (
    <section aria-label="Totales de deudas pendientes" className="mb-6 flex flex-col gap-3">
      <div
        data-testid="debts-totals"
        className="hero flex flex-col items-center gap-1 rounded-3xl px-6 py-7 text-center ring-1 ring-hero-foreground/8 ring-inset"
      >
        <span className="text-footnote font-medium text-hero-muted">Saldo de tus deudas</span>
        <span data-testid="debts-net" className="tabular text-title-1 font-bold tracking-tight text-balance">
          {debtNetText(totals.net)}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div data-testid="debts-total-owed-to-me" className="flex min-w-0 flex-col gap-1 rounded-2xl bg-card p-4">
          <span className="text-footnote text-muted-foreground">Te deben</span>
          <Amount text={formatArs(totals.owedToMe)} className="tabular text-title-2 font-bold break-words text-primary" />
        </div>
        <div data-testid="debts-total-i-owe" className="flex min-w-0 flex-col gap-1 rounded-2xl bg-card p-4">
          <span className="text-footnote text-muted-foreground">Debés</span>
          <Amount text={formatArs(totals.iOwe)} className="tabular text-title-2 font-bold break-words text-destructive" />
        </div>
      </div>
      <p data-testid="debts-totals-note" className="px-1 text-footnote text-muted-foreground">
        Solo suman las deudas pendientes.
      </p>
    </section>
  )
}
