import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs } from '@/domain/money'
import type { CategoryExpenseSummary } from '@/domain/summary'

const DEFAULT_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#64748b', // slate
]

interface CategoryExpenseBarsProps {
  categories: CategoryExpenseSummary[]
}

export function CategoryExpenseBars({ categories }: CategoryExpenseBarsProps) {
  return (
    <Card data-testid="dashboard-category-bars">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Gasto por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p
            data-testid="dashboard-categories-empty"
            className="text-sm text-muted-foreground py-4 text-center"
          >
            No hay gastos por categoría en este período.
          </p>
        ) : (
          <div
            data-testid="dashboard-categories-list"
            role="list"
            className="space-y-4 pt-1"
          >
            {categories.map((cat, index) => {
              const barColor = cat.color || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length]
              return (
                <div
                  key={cat.id}
                  data-testid={`dashboard-category-bar-${cat.id}`}
                  role="listitem"
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <span
                        className="size-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: barColor }}
                        aria-hidden="true"
                      />
                      <span
                        data-testid="category-bar-name"
                        className="font-medium truncate text-foreground"
                      >
                        {cat.name}
                      </span>
                      {cat.isArchived && (
                        <span
                          data-testid="category-bar-archived"
                          className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium shrink-0"
                        >
                          archivada
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 text-right">
                      <span
                        data-testid="category-bar-amount"
                        className="font-semibold tabular-nums text-foreground"
                      >
                        {formatArs(cat.amount)}
                      </span>
                      <span
                        data-testid="category-bar-percentage"
                        className="text-xs text-muted-foreground tabular-nums min-w-[34px] text-right"
                      >
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                    <div
                      role="progressbar"
                      aria-valuenow={cat.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${cat.name}: ${cat.percentage}%`}
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${Math.max(2, Math.min(100, cat.percentage))}%`,
                        backgroundColor: barColor,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
