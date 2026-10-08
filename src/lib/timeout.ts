/**
 * Rechaza si la promesa no termina en `ms`. No la cancela: lo que haga después igual pasa (en la
 * puesta al día, lo que creó queda creado y aparece en la próxima lectura, ADR-031 §4).
 */
export function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Sin respuesta en ${ms} ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

/**
 * Una señal que aborta el pedido a los `ms` (US-70): a diferencia de withTimeout, el pedido se cancela
 * de verdad. `clear` se llama al terminar para no dejar el timer vivo.
 */
export function abortAfter(ms: number): { signal: AbortSignal; clear: () => void } {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, clear: () => clearTimeout(timer) }
}
