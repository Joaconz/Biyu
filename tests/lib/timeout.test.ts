import { afterEach, describe, expect, it, vi } from 'vitest'
import { CATCHUP_TIMEOUT_MS } from '@/domain/subscriptions'
import { withTimeout } from '@/lib/timeout'

describe('tope de la puesta al día (ADR-031 §2, US-53 CA-11)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('son 8 segundos', () => {
    expect(CATCHUP_TIMEOUT_MS).toBe(8000)
  })

  it('si la respuesta llega antes, la devuelve', async () => {
    await expect(withTimeout(Promise.resolve({ generated: 2 }), CATCHUP_TIMEOUT_MS)).resolves.toEqual({ generated: 2 })
  })

  it('si no responde, rechaza a los 8 segundos y no antes', async () => {
    vi.useFakeTimers()
    const settled = vi.fn()
    const pending = withTimeout(new Promise(() => {}), CATCHUP_TIMEOUT_MS).catch(settled)
    await vi.advanceTimersByTimeAsync(CATCHUP_TIMEOUT_MS - 1)
    expect(settled).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    await pending
    expect(settled).toHaveBeenCalledOnce()
  })

  it('un error de la Edge Function se propaga', async () => {
    await expect(withTimeout(Promise.reject(new Error('caída')), CATCHUP_TIMEOUT_MS)).rejects.toThrow('caída')
  })
})
