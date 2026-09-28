import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { addMonths, currentPeriod, formatPeriod, parsePeriod, type Period } from '@/domain/period'
import { today } from '@/lib/clock'

/** El período seleccionado vive en `?period=YYYY-MM` (C11). Inválido o ausente → el actual. */
export function usePeriodParam() {
  const [params, setParams] = useSearchParams()
  const raw = params.get('period')
  const parsed = parsePeriod(raw)
  const fallback = currentPeriod(today())
  const fallbackKey = formatPeriod(fallback)
  const period: Period = parsed ?? fallback

  useEffect(() => {
    if (!parsePeriod(raw)) {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('period', fallbackKey)
          return next
        },
        { replace: true },
      )
    }
  }, [raw, fallbackKey, setParams])

  const setPeriod = useCallback(
    (next: Period) =>
      setParams((prev) => {
        const p = new URLSearchParams(prev)
        p.set('period', formatPeriod(next))
        return p
      }),
    [setParams],
  )

  return { period, setPeriod, shift: (delta: number) => setPeriod(addMonths(period, delta)) }
}
