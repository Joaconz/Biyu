import { ChevronDown } from 'lucide-react'
import { DebtItem } from '@/components/debts/DebtItem'
import { groupCountText, groupNetText, type DebtGroup, type DebtRecord } from '@/domain/debts'
import { cn, toTestIdSuffix } from '@/lib/utils'

/**
 * Una persona con dos o más deudas (US-91): plegada muestra el nombre, cuántas son y el neto por
 * moneda; al tocarla se despliegan sus deudas con las mismas acciones de siempre (saldar, volver a
 * pendiente). No cambia datos: cada deuda sigue con el nombre como se escribió.
 */
export function DebtGroupItem({
  group,
  expanded,
  onToggle,
  busyIds,
  onSettle,
  onReopen,
  onDelete,
  editHref,
}: {
  group: DebtGroup
  expanded: boolean
  onToggle: (key: string) => void
  busyIds: ReadonlySet<string>
  onSettle: (debt: DebtRecord) => void
  onReopen: (debt: DebtRecord) => void
  onDelete: (debt: DebtRecord) => void
  /** US-86: a dónde lleva «Editar» cada deuda del grupo. */
  editHref?: (debt: DebtRecord) => string
}) {
  const slug = toTestIdSuffix(group.name) || 'persona'
  const panelId = `debts-group-panel-${slug}`
  return (
    <div data-testid={`debts-group-${slug}`} data-person-key={group.key} data-expanded={expanded}>
      <button
        type="button"
        data-testid="debts-group-toggle"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => onToggle(group.key)}
        className="press flex min-h-[4.5rem] w-full items-center gap-3 py-3.5 pr-4 pl-4 text-left outline-offset-[-2px]"
      >
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span data-testid="debts-group-name" className="truncate text-headline font-semibold text-foreground">
            {group.name}
          </span>
          <span data-testid="debts-group-count" className="text-footnote text-muted-foreground">
            {groupCountText(group)}
          </span>
        </span>
        <span data-testid="debts-group-net" className="flex shrink-0 flex-col items-end gap-0.5 text-right">
          {group.nets.map((net) => (
            <span
              key={net.currency}
              data-testid="debts-group-net-item"
              data-currency={net.currency}
              className={cn('tabular text-headline font-semibold', net.net.isNegative() && !net.net.isZero() ? 'text-destructive' : 'text-foreground')}
            >
              {groupNetText(net)}
            </span>
          ))}
        </span>
        <ChevronDown
          aria-hidden="true"
          strokeWidth={1.8}
          className={cn('size-5 shrink-0 text-muted-foreground transition-transform duration-(--dur-fade)', expanded && 'rotate-180')}
        />
      </button>
      {expanded && (
        <div id={panelId} data-testid="debts-group-items" className="mx-2 mb-2 rounded-xl bg-secondary/50 [&>*+*]:border-t [&>*+*]:border-hairline">
          {group.debts.map((debt) => (
            <DebtItem key={debt.id} debt={debt} busy={busyIds.has(debt.id)} onSettle={onSettle} onReopen={onReopen} onDelete={onDelete} editHref={editHref?.(debt)} />
          ))}
        </div>
      )}
    </div>
  )
}
