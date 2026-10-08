import type { ReviewedRow } from '@/domain/importRows'
import { cn } from '@/lib/utils'

/**
 * Tarjeta de una fila del archivo (§1): número de fila de Excel, los datos leídos y su estado. Con
 * error, cada mensaje de §4 en una línea.
 */
export function ImportRowCard({ row }: { row: ReviewedRow }) {
  const { rowNumber: n, card } = row
  const ready = row.status === 'ready'
  const details = [card.date, card.type, card.category, card.account, card.fxRate, card.installments].filter(Boolean)
  return (
    <li
      data-testid={`import-row-${n}`}
      data-status={row.status}
      className="flex flex-col gap-1.5 border-b border-hairline px-4 py-3 last:border-b-0"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-footnote font-semibold text-muted-foreground">Fila {n}</span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-caption font-semibold',
            ready ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive',
          )}
        >
          {ready ? 'Lista' : 'Con error'}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-callout break-words text-foreground">{details.join(' · ')}</span>
        <span className="tabular shrink-0 text-callout font-semibold">{card.amount}</span>
      </div>
      {row.status === 'error' && (
        <ul data-testid={`import-row-${n}-errors`} className="flex flex-col gap-0.5 text-footnote text-destructive">
          {row.errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}
    </li>
  )
}
