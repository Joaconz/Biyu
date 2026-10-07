import { Link, useSearchParams } from 'react-router'
import { DebtItem } from '@/components/debts/DebtItem'
import { DebtsFilter } from '@/components/debts/DebtsFilter'
import { DebtsTotals } from '@/components/debts/DebtsTotals'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard } from '@/components/shared/GroupedList'
import { buttonVariants } from '@/components/ui/button'
import { debtTotals, debtsForFilter, emptyDebtsMessage, parseDebtStatusFilter, type DebtStatusFilter } from '@/domain/debts'
import { useDebts } from '@/hooks/useDebts'

/** Deudas (US-38): la lista con su filtro en la URL (C11). */
export function DebtsPage() {
  const [params, setParams] = useSearchParams()
  // Un valor desconocido se lee como "Pendientes" y la URL queda como está hasta que se elige otro (CA-4).
  const filter = parseDebtStatusFilter(params.get('status'))
  const debtsState = useDebts()

  function selectFilter(next: DebtStatusFilter) {
    setParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('status', next)
      return p
    })
  }

  const debts = debtsState.status === 'ready' ? debtsForFilter(debtsState.debts, filter) : []
  const empty = emptyDebtsMessage(filter)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Deudas" testId="debts-title" className="items-center">
        <Link to="/debts/new" data-testid="debts-new" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          Nueva deuda
        </Link>
      </PageHeader>

      {/* Los totales (US-37) salen de todas las deudas, no de las del filtro (CA-4). Como comparten el
          estado con la lista, se recalculan cada vez que se vuelve a pedir (CA-5). */}
      {debtsState.status === 'ready' && <DebtsTotals totals={debtTotals(debtsState.debts)} />}
      <DebtsFilter value={filter} onChange={selectFilter} />

      {debtsState.status === 'loading' && (
        <p data-testid="debts-loading" className="text-callout text-muted-foreground">
          Cargando deudas…
        </p>
      )}

      {debtsState.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="debts-error" className="text-callout text-destructive">
            No pudimos cargar tus deudas.
          </p>
          <button
            type="button"
            data-testid="debts-retry"
            onClick={debtsState.refresh}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {debtsState.status === 'ready' && (
        <>
          {debts.length === 0 ? (
            <div
              data-testid="debts-empty"
              className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input/50 px-6 py-12 text-center"
            >
              <p className="text-callout text-muted-foreground">{empty.message}</p>
              {empty.offerNew && (
                <Link to="/debts/new" data-testid="debts-empty-new" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Cargar una deuda
                </Link>
              )}
            </div>
          ) : (
            <GroupedCard data-testid="debts-list">
              {debts.map((debt) => (
                <DebtItem key={debt.id} debt={debt} />
              ))}
            </GroupedCard>
          )}
        </>
      )}
    </div>
  )
}
