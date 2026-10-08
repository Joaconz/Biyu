import { Link } from 'react-router'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  notImportedHeading,
  notImportedLine,
  resultAmountsText,
  resultTitle,
  type ImportResult,
} from '@/domain/importResult'

/** Paso 3 · Resultado (§1). */
export function ResultStep({ result, onImportAnother }: { result: ImportResult; onImportAnother: () => void }) {
  const rejected = result.notImported.length
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p data-testid="import-result-title" className="text-title-2 font-bold">
          {resultTitle(result)}
        </p>
        <p data-testid="import-result-amounts" className="text-callout text-muted-foreground">
          {resultAmountsText(result)}
        </p>
      </div>

      {rejected > 0 && (
        <div data-testid="import-result-rejected" className="flex flex-col gap-2 rounded-xl border border-hairline bg-card p-4">
          <p className="text-callout font-semibold">{notImportedHeading(rejected)}</p>
          <ul className="flex flex-col gap-1 text-footnote text-destructive">
            {result.notImported.map((line) => (
              <li key={line.rowNumber} data-testid={`import-result-row-${line.rowNumber}`}>
                {notImportedLine(line)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-start">
        {result.period && (
          <Link
            to={`/transactions?period=${result.period}`}
            data-testid="import-go-transactions"
            className={buttonVariants({ size: 'lg' })}
          >
            Ver en Movimientos
          </Link>
        )}
        <Button type="button" variant="outline" size="lg" onClick={onImportAnother} data-testid="import-again">
          Importar otro archivo
        </Button>
      </div>
    </div>
  )
}
