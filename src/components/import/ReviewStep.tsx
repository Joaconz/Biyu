import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ignoredColumnsMessage, type ImportSheet } from '@/domain/importFile'
import { readSummaryText, toImportText, type ImportReview } from '@/domain/importRows'
import { cn } from '@/lib/utils'
import { ImportRowCard } from './ImportRowCard'

/** Paso 2 · Revisión (§1). No escribe nada en la base. */
export function ReviewStep({
  fileName,
  sheet,
  review,
  importing = false,
  batchError = null,
  submitText,
  onChangeFile,
  onSubmit,
}: {
  fileName: string
  sheet: ImportSheet
  review: ImportReview
  onChangeFile: () => void
  /** Mientras la llamada está en curso: "Importando…" y los dos botones deshabilitados (§1). */
  importing?: boolean
  /** Error de toda la importación (§7), arriba del botón principal. */
  batchError?: string | null
  /** "Importar N movimientos", "Importando…", "Reintentar" o "Volver a entrar". */
  submitText: string
  onSubmit: () => void
}) {
  // El filtro vive en el estado y no en la URL (C11), como todo el paso: el archivo no se persiste y
  // recargar vuelve al paso 1 (§1).
  const [onlyErrors, setOnlyErrors] = useState(false)
  const ignored = ignoredColumnsMessage(sheet.ignoredColumns)
  const noErrors = review.withErrors === 0
  const visible = onlyErrors && !noErrors ? review.rows.filter((r) => r.status === 'error') : review.rows

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <p data-testid="import-file-name" className="text-headline font-semibold break-all">
          {fileName}
        </p>
        <p data-testid="import-summary" className="text-callout text-foreground">
          {readSummaryText(review)}
        </p>
        <p data-testid="import-summary-amounts" className="text-callout text-muted-foreground">
          {toImportText(review)}
        </p>
        {ignored && (
          <p data-testid="import-ignored-columns" className="text-footnote text-muted-foreground">
            {ignored}
          </p>
        )}
      </div>

      <p data-testid="import-duplicates-warning" className="rounded-lg bg-warning-surface p-3 text-footnote text-warning">
        Si ya importaste este archivo, los movimientos se van a duplicar.
      </p>

      <div className="flex min-h-11 items-center gap-3">
        <span id="import-filter-errors-label" className={cn('text-callout font-medium', noErrors && 'text-muted-foreground')}>
          Ver solo filas con error
        </span>
        <Switch
          checked={onlyErrors && !noErrors}
          onCheckedChange={setOnlyErrors}
          disabled={noErrors}
          testId="import-filter-errors"
          labelledBy="import-filter-errors-label"
        />
      </div>

      <ul data-testid="import-rows" className="overflow-hidden rounded-xl border border-hairline bg-card">
        {visible.map((row) => (
          <ImportRowCard key={row.rowNumber} row={row} />
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row-reverse sm:items-start">
        <div className="flex flex-col gap-1.5">
          {batchError && (
            <p role="alert" data-testid="import-batch-error" className="rounded-lg bg-destructive/8 p-3 text-footnote text-destructive">
              {batchError}
            </p>
          )}
          <Button type="button" size="lg" disabled={review.ready === 0 || importing} onClick={onSubmit} data-testid="import-submit">
            {submitText}
          </Button>
          {review.ready === 0 && (
            <p data-testid="import-submit-hint" className="text-footnote text-muted-foreground">
              No hay filas listas para importar
            </p>
          )}
        </div>
        <Button type="button" variant="outline" size="lg" onClick={onChangeFile} disabled={importing} data-testid="import-change-file">
          Elegir otro archivo
        </Button>
      </div>
    </div>
  )
}
