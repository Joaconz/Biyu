import { useRef, useState } from 'react'
import { CircleCheckIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { settledNoticeText } from '@/domain/debts'
import { cn } from '@/lib/utils'

/**
 * Aviso "Deuda con Sofía saldada" con "Deshacer" (US-39). "Deshacer" se deshabilita mientras espera la
 * respuesta: dos toques rápidos hacen una sola llamada a reopen_debt (CA-4).
 */
export function SettledNotice({ person, onUndo }: { person: string; onUndo: () => Promise<void> }) {
  // El ref corta el segundo toque en el mismo instante; el estado solo pinta el botón deshabilitado.
  const undoingRef = useRef(false)
  const [undoing, setUndoing] = useState(false)

  async function undo() {
    if (undoingRef.current) return
    undoingRef.current = true
    setUndoing(true)
    try {
      await onUndo()
    } finally {
      undoingRef.current = false
      setUndoing(false)
    }
  }

  return (
    <div
      data-testid="debts-settled"
      className="flex w-[var(--width)] max-w-full items-center gap-2 rounded-(--radius) border border-border bg-card py-2 pr-2 pl-4 text-callout text-foreground"
    >
      <CircleCheckIcon aria-hidden="true" className="size-4 shrink-0 text-primary" />
      <span className="min-w-0 flex-1 break-words">{settledNoticeText(person)}</span>
      <button
        type="button"
        data-testid="debts-settled-undo"
        disabled={undoing}
        onClick={undo}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'shrink-0 font-semibold text-primary')}
      >
        Deshacer
      </button>
    </div>
  )
}
