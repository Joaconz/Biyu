import { lastRequestId, pendingDraftLabel, pendingDraftsTitle, type PendingDraft } from '@/domain/pendingDrafts'
import { cn } from '@/lib/utils'

export type PendingRowStatus = 'verifying' | 'verify-failed'

/**
 * Aviso de movimientos pendientes (US-70, ADR-034), arriba del paso 1 de Registrar: una fila por
 * borrador que falló al guardarse por la red, el más reciente arriba. Ámbar de --warning (ADR-023).
 */
export function PendingDraftsNotice({
  drafts,
  status,
  onRestore,
  onDiscard,
}: {
  drafts: readonly PendingDraft[]
  status: Partial<Record<string, PendingRowStatus>>
  onRestore: (draft: PendingDraft) => void
  onDiscard: (draft: PendingDraft) => void
}) {
  return (
    <section
      aria-labelledby="register-pending-drafts-title"
      data-testid="register-pending-drafts"
      className="rounded-xl border border-warning/30 bg-warning-surface px-4 py-3"
    >
      <h2 id="register-pending-drafts-title" className="text-callout font-semibold text-warning">
        {pendingDraftsTitle(drafts.length)}
      </h2>
      <ul>
        {drafts.map((draft) => {
          const rowStatus = status[draft.id]
          const verifying = rowStatus === 'verifying'
          return (
            <li
              key={draft.id}
              data-testid="register-pending-draft"
              data-request-id={lastRequestId(draft)}
              className="mt-2.5 border-t border-warning/20 pt-2.5"
            >
              <p className="tabular text-callout text-foreground">{pendingDraftLabel(draft)}</p>
              {rowStatus === 'verify-failed' && (
                <p role="alert" className="mt-1 text-footnote text-destructive">
                  No pudimos verificar si ya se guardó. Revisá tu conexión y probá de nuevo.
                </p>
              )}
              <div className="mt-2.5 flex gap-2">
                <button
                  type="button"
                  data-testid="register-pending-draft-restore"
                  disabled={verifying}
                  onClick={() => onRestore(draft)}
                  className="press min-h-11 flex-1 rounded-lg bg-primary px-3 text-callout font-semibold text-primary-foreground disabled:opacity-60"
                >
                  {verifying ? 'Verificando…' : 'Recuperar'}
                </button>
                <button
                  type="button"
                  data-testid="register-pending-draft-discard"
                  disabled={verifying}
                  onClick={() => onDiscard(draft)}
                  className={cn(
                    'press min-h-11 flex-1 rounded-lg border border-input bg-card px-3 text-callout font-semibold text-foreground hover:bg-accent',
                    'disabled:opacity-50',
                  )}
                >
                  Descartar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
