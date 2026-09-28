import { useState } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard } from '@/components/shared/GroupedList'
import { PeriodSwitcher } from '@/components/shared/PeriodSwitcher'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { formatDayHeading } from '@/domain/period'
import { useMonthlyTransactions } from '@/hooks/useMonthlyTransactions'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { today } from '@/lib/clock'
import type { DashboardTransaction } from '@/lib/dashboard'
import { groupByDay } from '@/lib/transactionGroups'

export function TransactionsPage() {
  const { period, setPeriod, shift } = usePeriodParam()
  const transactionsState = useMonthlyTransactions(period)
  const [txToDelete, setTxToDelete] = useState<DashboardTransaction | null>(null)
  const now = today()

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Movimientos" testId="transactions-title" className="flex-wrap items-center">
        <PeriodSwitcher screen="transactions" period={period} onShift={shift} onSelect={setPeriod} className="-mr-2" />
      </PageHeader>

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
          <p className="text-callout text-muted-foreground">No hay movimientos en este mes.</p>
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
                    onDeleteRequest={setTxToDelete}
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
    </div>
  )
}
