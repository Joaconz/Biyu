import { Link } from 'react-router'
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
        // DEF-026: si archivó todas, no se vuelven a sembrar (DEF-010); hay que decir dónde se arregla.
        <p data-testid="transaction-form-category-empty" className="text-callout text-muted-foreground">
          No tenés categorías activas. Creá una o reactivá una archivada en{' '}
          <Link to="/settings" data-testid="transaction-form-category-empty-settings" className="font-medium text-primary underline">
            Ajustes
          </Link>
          .
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
