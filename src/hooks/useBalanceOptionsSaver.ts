import { useRef, useState } from 'react'
import { toast } from 'sonner'
import type { BalanceOptions } from '@/domain/balance'
import { saveBalanceOptions } from '@/lib/preferences'

/**
 * Cambiar qué entra en el balance (US-101, ADR-051), igual desde la tarjeta del Resumen y desde Ajustes.
 *
 * El cambio se ve al instante (`edited`) y se guarda atrás, en orden: varios toques seguidos se escriben uno
 * detrás del otro y la fila termina igual a lo último que se ve. Si falla el último guardado, vuelve a lo
 * último que sí se guardó y avisa. Solo cambia cómo se suma al leer: no reescribe ningún movimiento (C5).
 */
export function useBalanceOptionsSaver() {
  const [edited, setEdited] = useState<BalanceOptions | null>(null)
  const [error, setError] = useState<string | null>(null)
  const queue = useRef<Promise<void>>(Promise.resolve())
  const persisted = useRef<BalanceOptions | null>(null)
  const latest = useRef(0)

  /** `previous` son las opciones que se veían antes del cambio: a eso se vuelve si nunca se guardó nada. */
  function save(next: BalanceOptions, previous: BalanceOptions) {
    if (persisted.current === null) persisted.current = previous
    const seq = ++latest.current
    setEdited(next)
    setError(null)
    queue.current = queue.current.then(() =>
      saveBalanceOptions(next).then(
        () => {
          persisted.current = next
        },
        (e: { message?: string }) => {
          if (seq !== latest.current) return
          setEdited(persisted.current)
          setError(e.message ?? 'No se pudo guardar')
          toast.error('No se pudo guardar qué entra en el balance')
        },
      ),
    )
  }

  return { edited, error, save }
}
