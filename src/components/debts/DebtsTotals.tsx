import { debtNetText, type DebtTotals } from '@/domain/debts'
import { formatArs } from '@/domain/money'
import { GroupedCard } from '@/components/shared/GroupedList'

/**
 * Tarjeta de totales de Deudas (US-37): "Te deben" en verde y "Debés" en bordó, con el neto abajo.
 * Solo suman las pendientes y no siguen el filtro de la lista.
 */
export function DebtsTotals({ totals }: { totals: DebtTotals }) {
  return (
    <section aria-label="Totales de deudas pendientes" className="mb-5 flex flex-col gap-1.5">
      <GroupedCard data-testid="debts-totals">
        <div className="flex gap-4 px-4 py-3.5">
          <div data-testid="debts-total-owed-to-me" className="flex min-w-0 flex-1 flex-col">
            <span className="text-footnote text-muted-foreground">Te deben</span>
            <span className="tabular text-title-2 font-bold break-words text-primary">{formatArs(totals.owedToMe)}</span>
          </div>
          <div data-testid="debts-total-i-owe" className="flex min-w-0 flex-1 flex-col">
            <span className="text-footnote text-muted-foreground">Debés</span>
            <span className="tabular text-title-2 font-bold break-words text-destructive">{formatArs(totals.iOwe)}</span>
          </div>
        </div>
        <div className="px-4 py-3">
          <span data-testid="debts-net" className="tabular text-callout font-semibold text-foreground">
            {debtNetText(totals.net)}
          </span>
        </div>
      </GroupedCard>
      <p data-testid="debts-totals-note" className="px-1 text-footnote text-muted-foreground">
        Solo suman las deudas pendientes.
      </p>
    </section>
  )
}
