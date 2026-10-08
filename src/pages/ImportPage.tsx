import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { FileStep } from '@/components/import/FileStep'
import { ImportSteps } from '@/components/import/ImportSteps'
import { ReviewStep } from '@/components/import/ReviewStep'
import { PageHeader } from '@/components/layout/PageHeader'
import { fileErrorMessage, type ImportSheet } from '@/domain/importFile'
import type { ImportReview } from '@/domain/importRows'
import { CatalogError, downloadTemplate, ReaderLoadError, reviewImportFile } from '@/lib/importFile'
import { isNetworkError } from '@/lib/errors'

type ImportState =
  | { step: 1; error: string | null }
  | { step: 2; fileName: string; sheet: ImportSheet; review: ImportReview }

function importFailureMessage(error: unknown): string {
  if (error instanceof ReaderLoadError || (error instanceof CatalogError && isNetworkError(error.cause))) {
    return 'No pudimos revisar el archivo: revisá tu conexión y probá de nuevo.'
  }
  if (error instanceof CatalogError) return 'No se pudieron cargar tus categorías y cuentas. Probá de nuevo.'
  return 'No pudimos revisar el archivo. Probá de nuevo.'
}

/**
 * Importar desde Excel (US-74, US-76; entrega-2/historias/importar-excel.md). El paso vive en el estado, no en
 * la URL: recargar vuelve al paso 1 sin archivo, porque el archivo se lee en el navegador y no se
 * guarda en ningún lado (§1, C14).
 */
export function ImportPage() {
  const [state, setState] = useState<ImportState>({ step: 1, error: null })
  const [reading, setReading] = useState(false)

  async function onFile(file: File) {
    setReading(true)
    // El error del archivo anterior no queda a la vista mientras se lee el nuevo.
    setState({ step: 1, error: null })
    try {
      const result = await reviewImportFile(file)
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
          onChangeFile={() => setState({ step: 1, error: null })}
        />
      )}
    </div>
  )
}
