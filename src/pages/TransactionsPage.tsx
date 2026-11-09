import { ListSkeleton } from '@/components/skeletons/Skeleton'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { ExportTransactionsDialog } from '@/components/transactions/ExportTransactionsDialog'
import { PurgeTransactionDialog } from '@/components/transactions/PurgeTransactionDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { isExportAvailable } from '@/domain/exportCsv'
import { canPurge } from '@/domain/transactionPurge'
import { formatDayHeading, formatPeriod } from '@/domain/period'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { today } from '@/lib/clock'
import type { DashboardTransaction, TransactionsView } from '@/lib/dashboard'
import { restoreTransaction } from '@/lib/transactions'
import { cn } from '@/lib/utils'
import { groupByDay } from '@/lib/transactionGroups'

export function TransactionsPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  // C11: el filtro vive en la URL, junto al período. Sin ?view, los activos.
  const [params, setParams] = useSearchParams()
  const view: TransactionsView = params.get('view') === 'deleted' ? 'deleted' : 'active'
  const transactionsState = useMonthlyTransactions(period, undefined, view)
  const [txToPurge, setTxToPurge] = useState<DashboardTransaction | null>(null)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const now = today()
  const isFuturePeriod = !isExportAvailable(period, now)

  function selectView(next: TransactionsView) {
    setParams((prev) => {
      const p = new URLSearchParams(prev)
      if (next === 'deleted') p.set('view', 'deleted')
      else p.delete('view')
      return p
    })
  }

  // DEF-007: restaurar no destruye nada, así que no pide confirmación; el toast confirma.
  async function onRestore(tx: DashboardTransaction) {
    try {
      await restoreTransaction(tx.id)
      toast.success('Movimiento restaurado', { testId: 'transactions-restored' })
      transactionsState.refresh()
    } catch (err) {
      toast.error('No se pudo restaurar el movimiento', { description: (err as { message?: string }).message })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader
        title="Movimientos"
        testId="transactions-title"
        leading={
          // US-69 · CA-7: Movimientos cuelga del Resumen; se vuelve al mismo mes (C11).
          <Link
            to={`/dashboard?period=${formatPeriod(period)}`}
            data-testid="transactions-back"
            className="press -ml-1 inline-flex min-h-11 items-center rounded-full px-1 text-callout font-medium text-primary hover:underline"
          >
            ‹ Resumen
          </Link>
        }
      >
        <button
          type="button"
          data-testid="transactions-export"
          disabled={isFuturePeriod}
          aria-disabled={isFuturePeriod}
          onClick={() => setIsExportOpen(true)}
          className="press flex h-11 shrink-0 items-center gap-2 rounded-full bg-card px-4 text-footnote font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:bg-transparent disabled:text-muted-foreground"
        >
          <Download className="size-4" aria-hidden="true" />
          Exportar
        </button>
      </PageHeader>

      {/* ADR-052: el mes va solo en su renglón, centrado; el filtro, debajo. */}
      <PeriodSwitcher screen="transactions" period={period} onShift={shift} onSelect={setPeriod} className="mb-4 self-center" />

      {isFuturePeriod && (
        <p
          data-testid="transactions-export-future"
          className="mb-4 rounded-xl bg-warning-surface px-4 py-3 text-footnote text-warning"
        >
          Solo podés exportar el mes actual o meses anteriores.
        </p>
      )}

      {/* DEF-007 (FR-08): las eliminadas siguen en el historial, en su propia vista. */}
      <div role="group" aria-label="Qué movimientos ver" className="mb-6 inline-flex w-fit self-center rounded-full bg-secondary p-1">
        {(
          [
            ['active', 'Activos'],
            ['deleted', 'Eliminados'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={view === value}
            data-testid={`transactions-filter-${value}`}
            onClick={() => selectView(value)}
            className={cn(
              'press min-h-9 rounded-full px-4 py-1.5 text-footnote font-medium text-muted-foreground',
              view === value && 'bg-card text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {transactionsState.status === 'loading' && (
        <ListSkeleton testId="transactions-loading" label="Cargando…" rows={6} />
      )}

      {transactionsState.status === 'error' && (
        <p role="alert" data-testid="transactions-error" className="text-callout text-destructive">
          No se pudieron cargar los movimientos: {transactionsState.message}
        </p>
      )}

      {transactionsState.status === 'ready' && transactionsState.transactions.length === 0 && (
        <div data-testid="transactions-empty" className="rounded-xl bg-card px-6 py-14 text-center">
          <p className="text-callout text-muted-foreground">
            {view === 'deleted' ? 'No eliminaste movimientos de este mes.' : 'No hay movimientos en este mes.'}
          </p>
        </div>
      )}

      {transactionsState.status === 'ready' && transactionsState.transactions.length > 0 && (
        // ADR-052: una sola lista continua; cada día es un rótulo dentro de la tarjeta, no una tarjeta aparte.
        <GroupedCard data-testid="transactions-list" className="py-2">
          {groupByDay(transactionsState.transactions).map((group) => (
            <section key={group.date} aria-label={formatDayHeading(group.date, now)} className="flex flex-col">
              <h2 className="px-4 pt-4 pb-1 text-footnote font-semibold text-muted-foreground first-letter:uppercase">
                {formatDayHeading(group.date, now)}
              </h2>
              {group.items.map((tx) => (
                <TransactionItem
                  key={`${tx.id}-${tx.installment_number}`}
                  transaction={tx}
                  testId="transactions-item"
                  showDate={false}
                  editHref={view === 'active' ? `/transactions/${tx.id}/edit?period=${formatPeriod(period)}` : undefined}
                  onRestoreRequest={view === 'deleted' ? onRestore : undefined}
                  onPurgeRequest={
                    view === 'deleted' && canPurge({ subscriptionName: tx.subscription?.name ?? null }) ? setTxToPurge : undefined
                  }
                />
              ))}
            </section>
          ))}
        </GroupedCard>
      )}

      <PurgeTransactionDialog
        transaction={txToPurge}
        isOpen={txToPurge !== null}
        onClose={() => setTxToPurge(null)}
        onPurged={() => transactionsState.refresh()}
      />

      <ExportTransactionsDialog
        isOpen={isExportOpen}
        period={period}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  )
}
