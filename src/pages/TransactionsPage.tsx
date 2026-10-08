import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { ExportTransactionsDialog } from '@/components/transactions/ExportTransactionsDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { isExportAvailable } from '@/domain/exportCsv'
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
  const [txToDelete, setTxToDelete] = useState<DashboardTransaction | null>(null)
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
        className="flex-wrap items-center"
        leading={
          // US-69 · CA-7: Movimientos cuelga del Resumen; se vuelve al mismo mes (C11).
          <Link
            to={`/dashboard?period=${formatPeriod(period)}`}
            data-testid="transactions-back"
            className="press -ml-1 inline-flex min-h-11 items-center rounded-md px-1 text-callout font-medium text-primary hover:underline"
          >
            ‹ Resumen
          </Link>
        }
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-testid="transactions-export"
            disabled={isFuturePeriod}
            aria-disabled={isFuturePeriod}
            onClick={() => setIsExportOpen(true)}
            className="press flex h-9 items-center gap-1.5 rounded-full border border-input px-3 text-footnote font-semibold text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:border-hairline disabled:text-muted-foreground"
          >
            <Download className="size-4" aria-hidden="true" />
            Exportar
          </button>
          <PeriodSwitcher screen="transactions" period={period} onShift={shift} onSelect={setPeriod} className="-mr-2" />
        </div>
      </PageHeader>

      {isFuturePeriod && (
        <p
          data-testid="transactions-export-future"
          className="mb-4 rounded-lg bg-warning-surface px-3 py-2 text-footnote text-warning"
        >
          Solo podés exportar el mes actual o meses anteriores.
        </p>
      )}

      {/* DEF-007 (FR-08): las eliminadas siguen en el historial, en su propia vista. */}
      <div role="group" aria-label="Qué movimientos ver" className="mb-5 inline-flex w-fit rounded-lg bg-secondary p-1">
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
              'press rounded-md px-3 py-1.5 text-footnote font-medium text-muted-foreground',
              view === value && 'bg-card text-foreground shadow-xs',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {transactionsState.status === 'loading' && (
        <p data-testid="transactions-loading" className="text-callout text-muted-foreground">
          Cargando…
        </p>
      )}

      {transactionsState.status === 'error' && (
        <p role="alert" data-testid="transactions-error" className="text-callout text-destructive">
          No se pudieron cargar los movimientos: {transactionsState.message}
        </p>
      )}

      {transactionsState.status === 'ready' && transactionsState.transactions.length === 0 && (
        <div data-testid="transactions-empty" className="rounded-xl border border-dashed border-input/50 px-6 py-12 text-center">
          <p className="text-callout text-muted-foreground">
            {view === 'deleted' ? 'No eliminaste movimientos de este mes.' : 'No hay movimientos en este mes.'}
          </p>
        </div>
      )}

      {transactionsState.status === 'ready' && transactionsState.transactions.length > 0 && (
        <div data-testid="transactions-list" className="flex flex-col gap-6">
          {groupByDay(transactionsState.transactions).map((group) => (
            <section key={group.date} aria-label={formatDayHeading(group.date, now)} className="flex flex-col gap-2">
              <h2 className="px-1 text-footnote font-semibold text-muted-foreground first-letter:uppercase">
                {formatDayHeading(group.date, now)}
              </h2>
              <GroupedCard>
                {group.items.map((tx) => (
                  <TransactionItem
                    key={`${tx.id}-${tx.installment_number}`}
                    transaction={tx}
                    testId="transactions-item"
                    showDate={false}
                    onDeleteRequest={view === 'active' ? setTxToDelete : undefined}
                    onRestoreRequest={view === 'deleted' ? onRestore : undefined}
                  />
                ))}
              </GroupedCard>
            </section>
          ))}
        </div>
      )}

      <DeleteTransactionDialog
        transaction={txToDelete}
        isOpen={txToDelete !== null}
        onClose={() => setTxToDelete(null)}
        onDeleted={() => transactionsState.refresh()}
      />

      <ExportTransactionsDialog
        isOpen={isExportOpen}
        period={period}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  )
}
