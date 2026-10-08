import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useModalFocus } from '@/hooks/useModalFocus'

/**
 * "¿Salir sin saber si se importó?" (§8). "Quedarme" cierra y deja la pantalla como estaba; "Salir
 * igual" hace lo que se tocó. El foco arranca en "Quedarme", la opción que no pierde nada (DEF-024).
 */
export function LeaveDialog({ isOpen, onStay, onLeave }: { isOpen: boolean; onStay: () => void; onLeave: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const stay = useRef<HTMLButtonElement>(null)
  useModalFocus(isOpen, panel, stay)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onStay()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onStay])

  if (!isOpen) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-leave-dialog-title"
      aria-describedby="import-leave-dialog-text"
      data-testid="import-leave-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onStay()
      }}
    >
      <div ref={panel} className="w-full max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 text-card-foreground">
        <h2 id="import-leave-dialog-title" className="text-lg font-semibold tracking-tight">
          ¿Salir sin saber si se importó?
        </h2>
        <p id="import-leave-dialog-text" className="text-sm text-muted-foreground">
          Puede que la importación se haya guardado. Si salís, revisá Movimientos antes de volver a importar este archivo.
        </p>
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button ref={stay} type="button" variant="outline" size="sm" onClick={onStay} data-testid="import-leave-stay">
            Quedarme
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={onLeave} data-testid="import-leave-confirm">
            Salir igual
          </Button>
        </div>
      </div>
    </div>
  )
}
