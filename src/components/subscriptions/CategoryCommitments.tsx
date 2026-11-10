import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { GroupedCard, GroupedSection } from '@/components/shared/GroupedList'
import { BreakdownRow } from '@/components/dashboard/BreakdownRow'
import { useResolvedTheme } from '@/components/layout/ThemeProvider'
import { formatArs, formatUsdCode } from '@/domain/money'
import { formatPercentage } from '@/domain/summary'
import type { CategoryCommitment } from '@/domain/subscriptions'
import { displayCategoryColor } from '@/lib/visuals'

const countText = (count: number) => (count === 1 ? '1 suscripción' : `${count} suscripciones`)

/**
 * "Por categoría": el comprometido del mes repartido entre las categorías de las suscripciones activas,
 * de mayor a menor. Barras horizontales HTML propias (sin librería, ADR-038 §5) con el color de la
 * categoría y el nombre, el monto y el porcentaje en texto: el color nunca es la única señal. Las USD
 * se convierten con el tipo de cambio del mes, igual que el héroe; las que no lo tienen se avisan en la
 * fila y no entran en la barra. La tabla oculta es la versión para lector de pantalla.
 */
export function CategoryCommitments({ rows }: { rows: readonly CategoryCommitment[] }) {
  const theme = useResolvedTheme()
  return (
    <GroupedSection title="Por categoría" data-testid="subscriptions-by-category">
      <GroupedCard>
        {/* role="list" explícito (Safari); la lista es decorativa para el lector: la tabla de abajo trae lo mismo. */}
        <div role="list" aria-hidden="true" data-testid="subscriptions-by-category-list">
          {rows.map((row) => (
            <BreakdownRow
              key={row.categoryId}
              testId={`subscriptions-by-category-${row.categoryId}`}
              icon={<CategoryIcon name={row.name} color={row.color} />}
              label={
                <span data-testid="subscriptions-by-category-name" className="truncate text-callout font-medium text-foreground">
                  {row.name}
                </span>
              }
              sublabel={
                <span className="tabular truncate text-footnote text-muted-foreground">
                  {countText(row.count)}
                  {row.usdPending && ` · + ${formatUsdCode(row.usdPending)} sin tipo de cambio`}
                </span>
              }
              amount={formatArs(row.totalArs)}
              amountTestId="subscriptions-by-category-amount"
              percentage={row.percentage.toNumber()}
              percentageTestId="subscriptions-by-category-percentage"
              barColor={displayCategoryColor(row.color, row.name, theme)}
              ariaLabel={`${row.name}: ${formatPercentage(row.percentage)}`}
            />
          ))}
        </div>
      </GroupedCard>
      {/* Vista de tabla para lector de pantalla (en un div: una tabla ignora el ancho de sr-only). */}
      <div className="sr-only">
        <table data-testid="subscriptions-by-category-table">
          <caption>Comprometido por categoría este mes</caption>
          <thead>
            <tr>
              <th scope="col">Categoría</th>
              <th scope="col">Suscripciones</th>
              <th scope="col">Comprometido</th>
              <th scope="col">Parte del total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.categoryId}>
                <th scope="row">{row.name}</th>
                <td>{row.count}</td>
                <td>
                  {formatArs(row.totalArs)}
                  {row.usdPending && `, más ${formatUsdCode(row.usdPending)} sin tipo de cambio`}
                </td>
                <td>{formatPercentage(row.percentage)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GroupedSection>
  )
}
