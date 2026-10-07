import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import {
  buildExportCsv,
  formatEmptyExportMessage,
  formatExportScopeLabel,
  formatSuccessExportMessage,
  getExportFileName,
  type ExportScope,
} from '@/domain/exportCsv'
import type { Period } from '@/domain/period'
import { useModalFocus } from '@/hooks/useModalFocus'
import { downloadCsvFile, fetchTransactionsForExport } from '@/lib/exportCsv'
import { cn } from '@/lib/utils'

interface ExportTransactionsDialogProps {
  isOpen: boolean
  period: Period
  onClose: () => void
}

type ExportStatus = 'idle' | 'exporting' | 'empty' | 'error'

/**
 * Hoja "Exportar movimientos" (US-47, ADR-029).
 * Permite descargar un CSV de un mes o un año con fecha en ese período.
 */
export function ExportTransactionsDialog({
  isOpen,
  period,
  onClose,
}: ExportTransactionsDialogProps) {
  const [scope, setScope] = useState<ExportScope>('month')
  const [status, setStatus] = useState<ExportStatus>('idle')

  const panelRef = useRef<HTMLDivElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const location = useLocation()
  const initialLocationKeyRef = useRef(location.key)

  const busy = status === 'exporting'

  useModalFocus(isOpen, panelRef, cancelButtonRef)

  // Al abrir la hoja vuelve al estado Inicial (CA-1, ADR-029)
  useEffect(() => {
    if (isOpen) {
      setScope('month')
      setStatus('idle')
      initialLocationKeyRef.current = location.key
    }
  }, [isOpen, location.key])

  // CA-24: Si mientras está abierta cambia la URL o se presiona Atrás del navegador,
  // la hoja se cierra y la exportación se cancela sin descargar nada.
  useEffect(() => {
    if (isOpen && location.key !== initialLocationKeyRef.current) {
      abortControllerRef.current?.abort()
      onClose()
    }
  }, [location.key, isOpen, onClose])

  useEffect(() => {
    if (!isOpen) return
    function handlePopState() {
      abortControllerRef.current?.abort()
      onClose()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isOpen, onClose])

  // CA-18, CA-23: Escape cierra la hoja solo si no está en "Exportando…"
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen && !busy) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, busy, onClose])

  if (!isOpen) return null

  function handleScopeChange(nextScope: ExportScope) {
    if (busy) return
    setScope(nextScope)
    // El mensaje de vacío o error desaparece al cambiar de opción
    if (status === 'empty' || status === 'error') {
      setStatus('idle')
    }
  }

  async function handleDownload() {
    if (busy) return

    // El mensaje desaparece al volver a tocar Descargar CSV
    setStatus('exporting')
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const rows = await fetchTransactionsForExport(scope, period, controller.signal)
      if (controller.signal.aborted) return

      if (rows.length === 0) {
        setStatus('empty')
        return
      }

      const csv = buildExportCsv(rows)
      const filename = getExportFileName(scope, period)
      downloadCsvFile(csv, filename)
      onClose()
      toast.success(formatSuccessExportMessage(rows.length), {
        testId: 'transactions-export-success',
      })
    } catch {
      if (controller.signal.aborted) return
      setStatus('error')
    } finally {
      abortControllerRef.current = null
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => {
        // CA-18, CA-23: tocar fuera de la hoja la cierra solo si no está en Exportando…
        if (e.target === e.currentTarget && !busy) {
          onClose()
        }
      }}
    >
      <div className="fixed inset-0 -z-10 bg-[rgba(43,30,25,0.32)]" aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-dialog-title"
        data-testid="transactions-export-dialog"
        className="w-full max-w-md flex flex-col gap-3.5 rounded-t-2xl sm:rounded-2xl border border-hairline bg-card p-4 pb-6 sm:p-5"
      >
        <div className="mx-auto h-1 w-9 rounded-full bg-hairline" aria-hidden="true" />
        <h2
          id="export-dialog-title"
          className="text-title-2 font-bold tracking-tight text-foreground"
        >
          Exportar movimientos
        </h2>

        <div
          role="radiogroup"
          aria-label="Período a exportar"
          className={cn(
            'overflow-hidden rounded-xl border border-hairline bg-background',
            busy && 'opacity-50 pointer-events-none',
          )}
        >
          <label
            data-testid="transactions-export-scope-month"
            className={cn(
              'flex min-h-[52px] items-center gap-3 px-4 text-callout font-medium cursor-pointer select-none border-b border-hairline',
              busy && 'cursor-not-allowed',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border border-input',
                scope === 'month' && 'border-primary',
              )}
            >
              {scope === 'month' && <span className="size-2.5 rounded-full bg-primary" />}
            </span>
            <input
              type="radio"
              name="export-scope"
              value="month"
              checked={scope === 'month'}
              onChange={() => handleScopeChange('month')}
              disabled={busy}
              className="sr-only"
            />
            {formatExportScopeLabel('month', period)}
          </label>

          <label
            data-testid="transactions-export-scope-year"
            className={cn(
              'flex min-h-[52px] items-center gap-3 px-4 text-callout font-medium cursor-pointer select-none',
              busy && 'cursor-not-allowed',
            )}
          >
            <span
              className={cn(
                'flex size-5 shrink-0 items-center justify-center rounded-full border border-input',
                scope === 'year' && 'border-primary',
              )}
            >
              {scope === 'year' && <span className="size-2.5 rounded-full bg-primary" />}
            </span>
            <input
              type="radio"
              name="export-scope"
              value="year"
              checked={scope === 'year'}
              onChange={() => handleScopeChange('year')}
              disabled={busy}
              className="sr-only"
            />
            {formatExportScopeLabel('year', period)}
          </label>
        </div>

        {status === 'empty' && (
          <p data-testid="transactions-export-empty" className="text-callout text-muted-foreground">
            {formatEmptyExportMessage(scope, period)}
          </p>
        )}

        {status === 'error' && (
          <p
            role="alert"
            data-testid="transactions-export-error"
            className="text-callout text-destructive"
          >
            No pudimos exportar tus movimientos. Probá de nuevo.
          </p>
        )}

        <p className="text-footnote text-muted-foreground leading-snug">
          Se exportan los movimientos activos con fecha en ese período. Las cuotas de compras
          anteriores no se incluyen.
        </p>

        <div className="flex gap-2.5">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            disabled={busy}
            data-testid="transactions-export-cancel"
            className="press flex h-11 flex-1 items-center justify-center rounded-xl border border-input text-callout font-semibold text-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={busy}
            aria-busy={busy}
            data-testid="transactions-export-submit"
            className="press flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-callout font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-70 disabled:cursor-default"
          >
            {busy ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground"
                  aria-hidden="true"
                />
                Exportando…
              </>
            ) : (
              <>
                <Download className="size-4" aria-hidden="true" />
                Descargar CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
