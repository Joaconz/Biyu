import { PREVIEW_EMPTY_TEXT, PREVIEW_FX_UNAVAILABLE_TEXT, type CalendarPreview, type PreviewRow } from '@/domain/subscriptions'
import { cn } from '@/lib/utils'

/**
 * Calendario de la Nueva suscripción (US-75): qué se carga al guardar y cuáles son los próximos
 * cobros. Solo muestra lo que calcula `buildCalendarPreview`; no tiene lógica de negocio (C1).
 */
export function SubscriptionPreview({ preview }: { preview: CalendarPreview }) {
  return (
    <section data-testid="subscription-form-preview" className="mt-6 flex flex-col gap-3 rounded-xl border border-hairline bg-card p-4">
      <h2 className="text-headline font-semibold text-foreground">Calendario</h2>

      {preview.kind === 'empty' && (
        <p data-testid="subscription-form-preview-empty" className="text-callout text-muted-foreground">
          {PREVIEW_EMPTY_TEXT}
        </p>
      )}

      {preview.kind === 'fx-unavailable' && (
        <p data-testid="subscription-form-preview-unavailable" className="text-callout text-muted-foreground">
          {PREVIEW_FX_UNAVAILABLE_TEXT}
        </p>
      )}

      {preview.kind === 'ready' && (
        <>
          {/* Se actualiza mientras se escribe: el lector de pantalla anuncia el resumen. */}
          <p aria-live="polite" data-testid="subscription-form-preview-summary" className="text-callout text-foreground">
            {preview.summary}
          </p>

          {preview.due.length > 0 && (
            <PreviewSection title="Se cargan al guardar" testId="subscription-form-preview-due">
              <PreviewRows itemTestId="subscription-form-preview-due-item" rows={preview.due} />
            </PreviewSection>
          )}

          <PreviewSection title="Próximos cobros" testId="subscription-form-preview-upcoming">
            {preview.upcoming.length > 0 ? (
              <PreviewRows itemTestId="subscription-form-preview-upcoming-item" rows={preview.upcoming} />
            ) : (
              <p className="text-callout text-muted-foreground">{preview.noMoreText}</p>
            )}
          </PreviewSection>
        </>
      )}
    </section>
  )
}

/** El `data-testid` queda siempre en el contenedor, tenga filas o el texto de "No hay más cobros". */
function PreviewSection({ title, testId, children }: { title: string; testId: string; children: React.ReactNode }) {
  return (
    <div data-testid={testId} className="flex flex-col gap-1.5">
      <h3 className="text-footnote font-medium text-muted-foreground">{title}</h3>
      {children}
    </div>
  )
}

function PreviewRows({ itemTestId, rows }: { itemTestId: string; rows: PreviewRow[] }) {
  return (
    <ul className="flex flex-col divide-y divide-hairline">
      {rows.map((row) => (
        <li
          key={row.periodKey}
          data-testid={itemTestId}
          data-period={row.periodKey}
          data-blocked={row.blockedBy ? 'true' : undefined}
          className={cn('flex flex-col py-2 text-callout', row.blockedBy ? 'text-warning' : 'text-foreground')}
        >
          <span className="tabular">{row.text}</span>
          {row.blockedText && <span className="text-footnote">{row.blockedText}</span>}
        </li>
      ))}
    </ul>
  )
}
