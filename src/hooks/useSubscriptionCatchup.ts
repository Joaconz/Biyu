import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { CATCHUP_TIMEOUT_MS, catchupGeneratedText } from '@/domain/subscriptions'
import { catchupStarted, claimCatchup, runSubscriptionCatchup } from '@/lib/subscriptionCatchup'
import { withTimeout } from '@/lib/timeout'

/**
 * - `idle`: no corre (todavía no hay sesión con setup completo, o ya corrió en esta carga).
 * - `running`: la carga espera, hasta 8 s, con "Poniendo al día tus suscripciones…".
 * - `done`: terminó bien.
 * - `failed` / `retrying`: la pantalla se muestra igual, con la franja de error (ADR-031 §4).
 */
export type CatchupStatus = 'idle' | 'running' | 'done' | 'failed' | 'retrying'

function notifyGenerated(generated: number) {
  const text = catchupGeneratedText(generated)
  if (text) toast.success(text, { testId: 'app-catchup-generated' })
}

/**
 * Corre la puesta al día al cargar, cuando `enabled` (sesión resuelta y setup completo). Se llama
 * desde AppLayout, que se monta cuando RequireAuth ya resolvió la sesión: los 8 s de US-53 CA-11
 * se cuentan desde ahí, así la consulta del setup no los estira.
 */
export function useSubscriptionCatchup(userId: string | null, enabled: boolean) {
  const shouldStart = enabled && userId !== null && !catchupStarted(userId)
  const [status, setStatus] = useState<CatchupStatus>('idle')
  // Sube cuando un reintento carga gastos: la pantalla, montada desde antes, se vuelve a leer para
  // que los totales dejen de estar incompletos junto con la franja.
  const [dataVersion, setDataVersion] = useState(0)
  const [sessionResolvedAt] = useState(() => performance.now())

  const attempt = useCallback(async (timeoutMs: number, refreshOnSuccess: boolean) => {
    try {
      const { generated } = await withTimeout(runSubscriptionCatchup(), timeoutMs)
      setStatus('done')
      if (refreshOnSuccess && generated > 0) setDataVersion((v) => v + 1)
      notifyGenerated(generated)
    } catch {
      setStatus('failed')
    }
  }, [])

  useEffect(() => {
    // claimCatchup vuelve a mirar: StrictMode repite el efecto con los mismos valores.
    if (!shouldStart || userId === null || !claimCatchup(userId)) return
    setStatus('running')
    const elapsed = performance.now() - sessionResolvedAt
    void attempt(Math.max(CATCHUP_TIMEOUT_MS - elapsed, 0), false)
  }, [shouldStart, userId, attempt, sessionResolvedAt])

  const retry = useCallback(() => {
    setStatus('retrying')
    void attempt(CATCHUP_TIMEOUT_MS, true)
  }, [attempt])

  /**
   * Después de guardar un tipo de cambio (ADR-031 §1): no bloquea la pantalla. Si sale bien y había
   * una franja de error, la saca; si falla, deja el estado como estaba.
   */
  const runInBackground = useCallback(async () => {
    try {
      const { generated } = await runSubscriptionCatchup()
      setStatus((prev) => (prev === 'failed' ? 'done' : prev))
      notifyGenerated(generated)
    } catch {
      // Sin aviso: la próxima carga lo vuelve a intentar.
    }
  }, [])

  // Antes de que el efecto arranque, la pantalla ya tiene que esperar: sin esto se vería el contenido
  // un instante antes del "Poniendo al día…".
  return { status: shouldStart ? 'running' : status, dataVersion, retry, runInBackground }
}

export const SubscriptionCatchupContext = createContext<{ runInBackground: () => Promise<void> }>({
  runInBackground: async () => {},
})

/** Para pantallas dentro de AppLayout: Ajustes la llama al guardar un tipo de cambio. */
export function useCatchupInBackground() {
  return useContext(SubscriptionCatchupContext).runInBackground
}
