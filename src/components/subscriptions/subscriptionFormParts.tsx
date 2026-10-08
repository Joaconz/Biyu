import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { FieldError } from '@/components/transaction-form/FieldError'
import { buttonVariants } from '@/components/ui/button'

export const SELECT_CLASS =
  'h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-primary disabled:opacity-50 aria-invalid:border-destructive'

/** Un campo de los formularios de suscripción: rótulo, control, ayuda, error y pie. */
export function Field({
  id,
  label,
  error,
  help,
  helpTestId,
  footer,
  children,
}: {
  id: string
  label: string
  error?: string
  help?: string
  /** `data-testid` del texto de ayuda, si hay que poder verificarlo. */
  helpTestId?: string
  /** Debajo del mensaje de error (CA-16). */
  footer?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid gap-2">
      <label htmlFor={`subscription-form-${id}`} className="text-footnote font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {help && (
        <p data-testid={helpTestId} className="text-footnote text-muted-foreground">
          {help}
        </p>
      )}
      <FieldError id={`subscription-form-${id}-error`} message={error} active />
      {footer}
    </div>
  )
}

/** Lista vacía de categorías o medios de pago, con el atajo a Ajustes. */
export function EmptyCatalog({ testId, message }: { testId: string; message: string }) {
  return (
    <div data-testid={testId} className="flex items-center justify-between gap-3 rounded-lg border border-input bg-card px-3 py-2.5">
      <span className="text-callout text-muted-foreground">{message}</span>
      <Link
        to="/settings"
        data-testid={`${testId}-settings`}
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
      >
        Ir a Ajustes
      </Link>
    </div>
  )
}
