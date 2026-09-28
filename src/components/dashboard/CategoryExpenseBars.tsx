import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { formatArs } from '@/domain/money'
import type { CategoryExpenseSummary } from '@/domain/summary'
import { displayCategoryColor } from '@/lib/visuals'
import { BreakdownRow } from './BreakdownRow'

/** Gasto por categoría (US-27): una barra por categoría, en su tono apagado (ADR-023). */
export function CategoryExpenseBars({ categories }: { categories: CategoryExpenseSummary[] }) {
  return (
    <GroupedSection title="Por categoría" data-testid="dashboard-category-bars">
      {categories.length === 0 ? (
        <p data-testid="dashboard-categories-empty" className="px-1 text-callout text-muted-foreground">
          No hay gastos por categoría en este mes.
        </p>
      ) : (
        <GroupedCard data-testid="dashboard-categories-list" role="list">
          {categories.map((cat) => (
            <BreakdownRow
              key={cat.id}
              testId={`dashboard-category-bar-${cat.id}`}
              icon={<CategoryIcon name={cat.name} color={cat.color} />}
              label={
                <>
                  <span data-testid="category-bar-name" className="truncate text-callout font-medium text-foreground">
                    {cat.name}
                  </span>
                  {cat.isArchived && (
                    <span
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
        </GroupedCard>
      )}
    </GroupedSection>
  )
}
