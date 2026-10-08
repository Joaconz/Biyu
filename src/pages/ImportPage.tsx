import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useBlocker, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { FileStep } from '@/components/import/FileStep'
import { ImportSteps } from '@/components/import/ImportSteps'
import { LeaveDialog } from '@/components/import/LeaveDialog'
import { ResultStep } from '@/components/import/ResultStep'
import { ReviewStep } from '@/components/import/ReviewStep'
import { PageHeader } from '@/components/layout/PageHeader'
import {
  classifyImportFailure,
  IMPORT_LOGIN_PATH,
  importFailureMessage as batchFailureMessage,
  importPending,
  submitActionAfter,
  submitButtonText,
  type ImportFailure,
} from '@/domain/importFailure'
import { fileErrorMessage, type ImportSheet } from '@/domain/importFile'
import { buildImportResult, importPayload, type ImportResult } from '@/domain/importResult'
import { submitLabel, type ImportReview } from '@/domain/importRows'
import {
  CatalogError,
  downloadTemplate,
  endExpiredSession,
  importTransactions,
  ReaderLoadError,
  reviewImportFile,
} from '@/lib/importFile'
import { isNetworkError } from '@/lib/errors'

type ImportState =
  | { step: 1; error: string | null }
  | { step: 2; fileName: string; sheet: ImportSheet; review: ImportReview }
  | { step: 3; result: ImportResult }

function fileReadFailureMessage(error: unknown): string {
  if (error instanceof ReaderLoadError || (error instanceof CatalogError && isNetworkError(error.cause))) {
    return 'No pudimos revisar el archivo: revisá tu conexión y probá de nuevo.'
  }
  if (error instanceof CatalogError) return 'No se pudieron cargar tus categorías y cuentas. Probá de nuevo.'
  return 'No pudimos revisar el archivo. Probá de nuevo.'
}

/**
 * Importar desde Excel (US-74, US-76, US-77, US-78; entrega-2/historias/importar-excel.md). El paso vive en el estado, no en
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
  // US-78 (§7): el error de toda la importación, que se ve arriba del botón del paso 2.
  const [failure, setFailure] = useState<ImportFailure | null>(null)
  // §8: "Elegir otro archivo" con una importación pendiente espera la confirmación del diálogo.
  const [confirmChangeFile, setConfirmChangeFile] = useState(false)
  const navigate = useNavigate()
  const pending = importPending(importing, failure)

  // §8: con una importación pendiente, salir de /import (volver, la barra, el botón atrás) pregunta.
  // La redirección a /login de una sesión vencida no se frena: sin sesión no hay nada que confirmar.
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      pending && currentLocation.pathname !== nextLocation.pathname && nextLocation.pathname !== '/login',
  )
  // Si la importación termina con el diálogo abierto, ya se sabe qué pasó: se cierra y queda a la vista.
  useEffect(() => {
    if (!pending && blocker.state === 'blocked') blocker.reset()
  }, [pending, blocker])
  // Recargar o cerrar la pestaña muestra el aviso nativo del navegador.
  useEffect(() => {
    if (!pending) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [pending])

  async function onFile(file: File) {
    setReading(true)
    // El error del archivo anterior no queda a la vista mientras se lee el nuevo.
    setState({ step: 1, error: null })
    try {
      const result = await reviewImportFile(file)
      importId.current = result.ok ? crypto.randomUUID() : null
      setFailure(null)
      setState(
        result.ok
          ? { step: 2, fileName: file.name, sheet: result.sheet, review: result.review }
          : { step: 1, error: fileErrorMessage(result.error) },
      )
    } catch (error) {
      // No es un error del archivo (A1–A7), así que no va en import-file-error.
      toast.error(fileReadFailureMessage(error))
    } finally {
      setReading(false)
    }
  }

  async function onImport(review: ImportReview) {
    if (importingRef.current) return
    if (submitActionAfter(failure) === 'login') {
      importingRef.current = true
      await endExpiredSession()
      navigate(IMPORT_LOGIN_PATH, { replace: true })
      return
    }
    importingRef.current = true
    setImporting(true)
    try {
      // Reintentar repite el mismo id: si la primera llamada se guardó, la base devuelve ese
      // resultado sin crear nada (ADR-035, NFR-10).
      importId.current ??= crypto.randomUUID()
      const response = await importTransactions(importId.current, importPayload(review))
      const result = buildImportResult(review, response)
      // Recién con el resultado armado se suelta el id: si algo fallara antes, el reintento lo repite.
      importId.current = null
      setFailure(null)
      setState({ step: 3, result })
    } catch (error) {
      setFailure(classifyImportFailure(error))
    } finally {
      importingRef.current = false
      setImporting(false)
    }
  }

  function backToStepOne() {
    importId.current = null
    setFailure(null)
    setState({ step: 1, error: null })
  }

  const stay = useCallback(() => {
    setConfirmChangeFile(false)
    if (blocker.state === 'blocked') blocker.reset()
  }, [blocker])

  function leave() {
    if (confirmChangeFile) {
      setConfirmChangeFile(false)
      backToStepOne()
    } else if (blocker.state === 'blocked') {
      blocker.proceed()
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
          batchError={failure && batchFailureMessage(failure)}
          submitText={submitButtonText(submitActionAfter(failure), importing, submitLabel(state.review.ready))}
          onChangeFile={() => (pending ? setConfirmChangeFile(true) : backToStepOne())}
          onSubmit={() => onImport(state.review)}
        />
      )}
      {state.step === 3 && <ResultStep result={state.result} onImportAnother={backToStepOne} />}
      <LeaveDialog isOpen={confirmChangeFile || blocker.state === 'blocked'} onStay={stay} onLeave={leave} />
    </div>
  )
}
