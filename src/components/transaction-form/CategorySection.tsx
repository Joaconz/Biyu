import type { Category } from '@/lib/catalog'
import { ChipGroup } from './ChipGroup'
import { FieldError } from './FieldError'
import type { SectionProps } from './types'

/** Categoría por chips en una grilla visible (US-06). Solo llegan las activas: ver lib/catalog. */
export function CategorySection({ values, errors, touched, onChange, categories }: SectionProps & { categories: Category[] }) {
  const errorId = 'transaction-form-category-error'
  return (
    <div className="grid gap-2">
      <span id="transaction-form-category-label" className="text-sm font-medium">Categoría</span>
      {categories.length === 0 ? (
        <p data-testid="transaction-form-category-empty" className="text-sm text-muted-foreground">
          Todavía no tenés categorías cargadas.
        </p>
      ) : (
        <ChipGroup
          testId="transaction-form-category"
          labelId="transaction-form-category-label"
          describedBy={errors.categoryId ? errorId : undefined}
          options={categories}
          value={values.categoryId}
          onChange={(id) => onChange({ categoryId: id })}
        />
      )}
      <FieldError id={errorId} message={errors.categoryId} active={!!touched.categoryId} />
    </div>
  )
}
