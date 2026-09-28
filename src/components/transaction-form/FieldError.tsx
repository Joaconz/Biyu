import { cn } from '@/lib/utils'

interface FieldErrorProps {
  /** Se usa como id (para aria-describedby) y como data-testid. */
  id: string
  message?: string
  /** El usuario ya tocó el campo: el motivo se muestra como error y no como aviso. */
  active: boolean
}

/** Motivo por el que un campo no deja guardar. Siempre visible mientras exista (US-11). */
export function FieldError({ id, message, active }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} data-testid={id} className={cn('text-sm', active ? 'text-destructive' : 'text-muted-foreground')}>
      {message}
    </p>
  )
}
