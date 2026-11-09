import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { buildCategoryPie } from '@/domain/categoryChart'
import { formatArs, type Decimal } from '@/domain/money'
import { formatPeriod, type Period } from '@/domain/period'
import type { CategoryExpenseSummary } from '@/domain/summary'
import { displayCategoryColor } from '@/lib/visuals'
import { useResolvedTheme } from '@/components/layout/ThemeProvider'
import { BreakdownRow } from './BreakdownRow'
import { CategoryDonutChart } from './CategoryDonutChart'

/**
 * Gasto por categoría: la dona (US-72, ADR-038, ADR-050) arriba y la lista de barras de US-27 debajo, que
 * hace de leyenda, muestra todas las categorías aunque la dona agrupe en "Resto" y abre el
 * detalle de cada una (US-73).
 */
export function CategoryExpenseBars({
  categories,
  totalExpenses,
  period,
}: {
  categories: CategoryExpenseSummary[]
  totalExpenses: Decimal
  period: Period
}) {
  const slices = buildCategoryPie(categories, totalExpenses)
  const theme = useResolvedTheme()
  return (
    <GroupedSection title="Por categoría" data-testid="dashboard-category-bars">
      {categories.length === 0 ? (
        <p data-testid="dashboard-categories-empty" className="px-1 text-callout text-muted-foreground">
          No hay gastos por categoría en este mes.
        </p>
      ) : (
        <GroupedCard>
          {slices.length > 0 && (
            <div className="flex justify-center px-4 pt-6 pb-5">
              <CategoryDonutChart slices={slices} period={period} total={totalExpenses} />
            </div>
          )}
          {/* role="list" explícito: con list-style: none Safari le quita la semántica de lista al <ul>. */}
          <ul role="list" data-testid="dashboard-categories-list" className="">
            {categories.map((cat) => (
              <BreakdownRow
                key={cat.id}
                testId={`dashboard-category-bar-${cat.id}`}
                link={{
                  to: `/dashboard/categories/${cat.id}?period=${formatPeriod(period)}`,
                  label: `Ver detalle de ${cat.name}`,
                  describedBy: cat.isArchived ? `category-archived-${cat.id}` : undefined,
                }}
                icon={<CategoryIcon name={cat.name} color={cat.color} />}
                label={
                  <>
                    <span data-testid="category-bar-name" className="truncate text-callout font-medium text-foreground">
                      {cat.name}
                    </span>
                    {cat.isArchived && (
                      <span
                        id={`category-archived-${cat.id}`}
                        data-testid="category-bar-archived"
                        className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-caption font-medium text-muted-foreground"
                      >
                        archivada
                      </span>
                    )}
                  </>
                }
                amount={formatArs(cat.amount)}
                amountTestId="category-bar-amount"
                percentage={cat.percentage}
                percentageTestId="category-bar-percentage"
                barColor={displayCategoryColor(cat.color, cat.name, theme)}
                ariaLabel={`${cat.name}: ${cat.percentage}%`}
              />
            ))}
          </ul>
        </GroupedCard>
      )}
    </GroupedSection>
  )
}
