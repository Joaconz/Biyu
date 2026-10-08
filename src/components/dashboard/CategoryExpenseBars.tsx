import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { buildCategoryPie } from '@/domain/categoryChart'
import { formatArs, type Decimal } from '@/domain/money'
import { formatPeriod, type Period } from '@/domain/period'
import type { CategoryExpenseSummary } from '@/domain/summary'
import { displayCategoryColor } from '@/lib/visuals'
import { BreakdownRow } from './BreakdownRow'
import { CategoryPieChart } from './CategoryPieChart'

/**
 * Gasto por categoría: la torta (US-72, ADR-038) arriba y la lista de barras de US-27 debajo, que
 * hace de leyenda, muestra todas las categorías aunque la torta agrupe en "Resto" y abre el
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
  return (
    <GroupedSection title="Por categoría" data-testid="dashboard-category-bars">
      {categories.length === 0 ? (
        <p data-testid="dashboard-categories-empty" className="px-1 text-callout text-muted-foreground">
          No hay gastos por categoría en este mes.
        </p>
      ) : (
        <GroupedCard>
          {slices.length > 0 && (
            <div className="flex justify-center px-4 pt-5 pb-4">
              <CategoryPieChart slices={slices} period={period} />
            </div>
          )}
          {/* role="list" explícito: con list-style: none Safari le quita la semántica de lista al <ul>. */}
          <ul role="list" data-testid="dashboard-categories-list" className="[&>*+*]:border-t [&>*+*]:border-hairline">
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
                        className="shrink-0 rounded-md bg-secondary px-1.5 py-0.5 text-caption font-medium text-muted-foreground"
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
                barColor={displayCategoryColor(cat.color, cat.name)}
                ariaLabel={`${cat.name}: ${cat.percentage}%`}
              />
            ))}
          </ul>
        </GroupedCard>
      )}
    </GroupedSection>
  )
}
