import { CircleAlert } from 'lucide-react'

/**
 * Aviso de error al guardar (US-70), encima del botón en el área de acción fija. `role="alert"`: el
 * lector de pantalla lo anuncia sin mover el foco (NFR-06). No se va solo (CA-4).
 */
export function SaveErrorAlert({ kind, message }: { kind: 'network' | 'rejected'; message: string }) {
  return (
    <div
      role="alert"
      data-testid="transaction-form-save-error"
      data-kind={kind}
      className="flex gap-2.5 rounded-lg border border-destructive bg-destructive/5 px-3 py-2.5"
    >
      <CircleAlert aria-hidden="true" className="mt-0.5 size-[1.125rem] shrink-0 text-destructive" strokeWidth={2} />
      <div className="text-footnote text-foreground">
        <p className="text-callout font-semibold text-destructive">No se pudo guardar</p>
        <p>{message}</p>
      </div>
    </div>
  )
}
