import { useEffect, useRef } from 'react'
import { Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  GUIDE_EXAMPLE_HEADERS,
  GUIDE_EXAMPLE_ROWS,
  GUIDE_FOOTER,
  GUIDE_INTRO,
  GUIDE_STEPS,
  GUIDE_TITLE,
} from '@/domain/importGuide'
import { useModalFocus } from '@/hooks/useModalFocus'

/**
 * "Cómo armar el archivo" (US-81): una guía corta que se abre a pedido, nunca sola. No guarda nada
 * ni toca el paso, el archivo o la URL. El foco arranca en cerrar, Tab no sale del diálogo, Escape y
 * un toque afuera lo cierran, y al cerrarse el foco vuelve a quien lo abrió (DEF-024).
 */
export function ImportGuideDialog({
  isOpen,
  onClose,
  onDownloadTemplate,
}: {
  isOpen: boolean
  onClose: () => void
  onDownloadTemplate: () => void
}) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  useModalFocus(isOpen, panel, close)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-guide-title"
      data-testid="import-guide-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panel}
        className="relative flex max-h-full w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-xl border border-border bg-card p-5 text-card-foreground"
      >
        <button
          ref={close}
          type="button"
          aria-label="Cerrar guía"
          onClick={onClose}
          data-testid="import-guide-close"
          className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <h2 id="import-guide-title" className="pr-10 text-lg font-semibold tracking-tight">
          {GUIDE_TITLE}
        </h2>
        <p className="text-callout text-muted-foreground">{GUIDE_INTRO}</p>
        <ol data-testid="import-guide-steps" className="list-decimal space-y-2 pl-5 text-callout">
          {GUIDE_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <div className="space-y-2">
          <p className="text-footnote font-semibold">Ejemplo</p>
          <div className="overflow-x-auto rounded-lg border border-hairline">
            <table data-testid="import-guide-example" className="w-max min-w-full text-left text-footnote">
              <thead className="bg-muted">
                <tr>
                  {GUIDE_EXAMPLE_HEADERS.map((header) => (
                    <th key={header} scope="col" className="px-3 py-2 font-semibold whitespace-nowrap">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GUIDE_EXAMPLE_ROWS.map((cells, i) => (
                  <tr key={i} className="border-t border-hairline">
                    {cells.map((cell, j) => (
                      <td key={j} className="px-3 py-2 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-footnote text-muted-foreground">{GUIDE_FOOTER}</p>
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          <Button type="button" variant="outline" size="sm" onClick={onDownloadTemplate} data-testid="import-guide-template-download">
            <Download aria-hidden="true" />
            Descargar plantilla
          </Button>
          <Button type="button" size="sm" onClick={onClose} data-testid="import-guide-done">
            Entendido
          </Button>
        </div>
      </div>
    </div>
  )
}
