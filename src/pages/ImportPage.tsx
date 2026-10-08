import { useRef, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { FileStep } from '@/components/import/FileStep'
import { ImportSteps } from '@/components/import/ImportSteps'
import { ResultStep } from '@/components/import/ResultStep'
import { ReviewStep } from '@/components/import/ReviewStep'
import { PageHeader } from '@/components/layout/PageHeader'
import { fileErrorMessage, type ImportSheet } from '@/domain/importFile'
import { buildImportResult, importPayload, type ImportResult } from '@/domain/importResult'
import type { ImportReview } from '@/domain/importRows'
import { CatalogError, downloadTemplate, importTransactions, ReaderLoadError, reviewImportFile } from '@/lib/importFile'
import { isNetworkError } from '@/lib/errors'

type ImportState =
  | { step: 1; error: string | null }
  | { step: 2; fileName: string; sheet: ImportSheet; review: ImportReview }
  | { step: 3; result: ImportResult }

function importFailureMessage(error: unknown): string {
  if (error instanceof ReaderLoadError || (error instanceof CatalogError && isNetworkError(error.cause))) {
    return 'No pudimos revisar el archivo: revisá tu conexión y probá de nuevo.'
  }
  if (error instanceof CatalogError) return 'No se pudieron cargar tus categorías y cuentas. Probá de nuevo.'
  return 'No pudimos revisar el archivo. Probá de nuevo.'
}

/**
 * Importar desde Excel (US-74, US-76, US-77; entrega-2/historias/importar-excel.md). El paso vive en el estado, no en
 * la URL: recargar vuelve al paso 1 sin archivo, porque el archivo se lee en el navegador y no se
 * guarda en ningún lado (§1, C14).
 */
export function ImportPage() {
  const [state, setState] = useState<ImportState>({ step: 1, error: null })
  const [reading, setReading] = useState(false)
  const [importing, setImporting] = useState(false)
  // Corta el doble toque antes de que React pinte el botón deshabilitado: una sola llamada (ADR-035).
  const importingRef = useRef(false)
  // Un id por archivo revisado (ADR-035): volver a confirmar el mismo archivo repite el id y la base
  // devuelve lo ya guardado en lugar de duplicarlo. Se renueva al elegir otro archivo.
  const importId = useRef<string | null>(null)

  async function onFile(file: File) {
    setReading(true)
    // El error del archivo anterior no queda a la vista mientras se lee el nuevo.
    setState({ step: 1, error: null })
    try {
      const result = await reviewImportFile(file)
      importId.current = result.ok ? crypto.randomUUID() : null
      setState(
        result.ok
          ? { step: 2, fileName: file.name, sheet: result.sheet, review: result.review }
          : { step: 1, error: fileErrorMessage(result.error) },
      )
    } catch (error) {
      // No es un error del archivo (A1–A7), así que no va en import-file-error.
      toast.error(importFailureMessage(error))
    } finally {
      setReading(false)
    }
  }

  async function onImport(review: ImportReview) {
    if (importingRef.current) return
    importingRef.current = true
    setImporting(true)
    try {
      importId.current ??= crypto.randomUUID()
      const response = await importTransactions(importId.current, importPayload(review))
      importId.current = null
      setState({ step: 3, result: buildImportResult(review, response) })
    } catch (error) {
      // Sin respuesta no se sabe si se guardó: no se afirma que no. Los mensajes de §7, "Reintentar" y
      // el diálogo de salida llegan con US-78.
      toast.error(
        isNetworkError(error)
          ? 'No pudimos confirmar la importación. Puede que se haya guardado: volvé a tocar Importar y te decimos qué pasó.'
          : 'No se importó ninguna fila. Probá de nuevo en un rato.',
      )
    } finally {
      importingRef.current = false
      setImporting(false)
    }
  }

  function onDownloadTemplate() {
    downloadTemplate().catch(() => toast.error('No se pudo generar la plantilla. Probá de nuevo.'))
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col">
      {/* La vuelta va arriba del título: a 390 px los dos no entran en una línea. */}
      <Link
        to="/register"
        data-testid="import-back"
        className="press -ml-1 inline-flex min-h-11 items-center self-start rounded-md px-1 pt-1 text-callout font-medium text-primary hover:underline lg:pt-0"
      >
        <span aria-hidden="true">‹&nbsp;</span>Registrar
      </Link>
      <PageHeader title="Importar desde Excel" testId="import-title" className="pt-0 pb-4 lg:pb-5" />
      <div className="pb-6">
        <ImportSteps current={state.step} />
      </div>

      {state.step === 1 && (
        <FileStep error={state.error} reading={reading} onFile={onFile} onDownloadTemplate={onDownloadTemplate} />
      )}
      {state.step === 2 && (
        <ReviewStep
          fileName={state.fileName}
          sheet={state.sheet}
          review={state.review}
          importing={importing}
          onChangeFile={() => setState({ step: 1, error: null })}
          onSubmit={() => onImport(state.review)}
        />
      )}
      {state.step === 3 && <ResultStep result={state.result} onImportAnother={() => setState({ step: 1, error: null })} />}
    </div>
  )
}
