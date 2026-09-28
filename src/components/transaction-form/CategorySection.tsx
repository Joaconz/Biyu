import { CategoryIcon } from '@/components/shared/CategoryIcon'
import type { Category } from '@/lib/catalog'
import { sortCategoriesForGrid } from '@/lib/visuals'
import { ChipGroup } from './ChipGroup'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

/** Categoría en una grilla visible de 4 columnas (US-06). Solo llegan las activas: ver lib/catalog. */
export function CategorySection({
  values,
  errors,
  touched,
  onChange,
  categories,
  onPick,
}: SectionProps & { categories: Category[]; onPick?: (id: string) => void }) {
  const errorId = 'transaction-form-category-error'
  return (
    <div className="grid gap-2.5">
      <span id="transaction-form-category-label" className="sr-only">Categoría</span>
      {categories.length === 0 ? (
        <p data-testid="transaction-form-category-empty" className="text-callout text-muted-foreground">
          Todavía no tenés categorías cargadas.
        </p>
      ) : (
        <ChipGroup
          layout="tiles"
          testId="transaction-form-category"
          labelId="transaction-form-category-label"
          describedBy={errors.categoryId ? errorId : undefined}
          options={sortCategoriesForGrid(categories)}
          value={values.categoryId}
          onChange={(id) => onChange({ categoryId: id })}
          onPick={onPick}
          renderIcon={(category) => <CategoryIcon name={category.name} color={category.color} />}
        />
      )}
      <FieldError id={errorId} message={errors.categoryId} active={!!touched.categoryId} />
    </div>
  )
}
