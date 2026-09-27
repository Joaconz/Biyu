import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatArs } from '@/domain/money'
import type { CategorySummaryItem } from '@/domain/summary'

interface CategoryExpenseChartProps {
  categories: CategorySummaryItem[]
  testId?: string
}

/**
 * Gráfico de barras horizontales con el gasto del período por categoría (US-27).
 * Muestra el nombre de la categoría, porcentaje del total y monto formateado en ARS (C2).
 */
export function CategoryExpenseChart({
  categories,
  testId = 'dashboard-categories',
}: CategoryExpenseChartProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Gasto por categoría</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p
            data-testid="dashboard-categories-empty"
            className="text-sm text-muted-foreground py-4 text-center"
          >
            No hay gastos en este período.
          </p>
        ) : (
          <div data-testid="dashboard-category-list" className="space-y-3.5">
            {categories.map((cat) => {
              const barColor = cat.color || '#64748b'
              return (
                <div
                  key={cat.id ?? cat.name}
                  data-testid="dashboard-category-bar"
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-sm gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: barColor }}
                        aria-hidden="true"
                      />
                      <span
                        data-testid="dashboard-category-name"
                        className="font-medium truncate text-sm"
                      >
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 tabular-nums">
                      <span
                        data-testid="dashboard-category-percentage"
                        className="text-xs text-muted-foreground"
                      >
                        {cat.percentage.toFixed(1)}%
                      </span>
                      <span
                        data-testid="dashboard-category-amount"
                        className="font-semibold text-sm"
                      >
                        {formatArs(cat.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted/60">
                    <div
                      className="h-full rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${cat.percentage.toNumber()}%`,
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
