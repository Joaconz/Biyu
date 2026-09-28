import { useEffect } from 'react'

/**
 * Detecta el teclado virtual por la altura de `visualViewport` (iOS no achica el layout y Android sí,
 * con `interactive-widget=resizes-content`; en ambos baja el viewport visual). Marca
 * `data-keyboard="open"` en <html> y publica `--kb-inset`: la barra se oculta y "Guardar" se apoya
 * sobre el teclado. No alcanza con `:focus`: en iOS el autofoco no siempre abre el teclado.
 */
export function useVisualViewportInset() {
  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    const root = document.documentElement
    let maxHeight = viewport.height
    let lastWidth = viewport.width

    const update = () => {
      // Al girar el teléfono cambia el ancho: se vuelve a medir la altura sin teclado.
      if (Math.abs(viewport.width - lastWidth) > 1) {
        maxHeight = viewport.height
        lastWidth = viewport.width
      }
      maxHeight = Math.max(maxHeight, viewport.height)
      const open = viewport.height < maxHeight * 0.75
      const inset = open ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0
      root.dataset.keyboard = open ? 'open' : 'closed'
      root.style.setProperty('--kb-inset', `${Math.round(inset)}px`)
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      delete root.dataset.keyboard
      root.style.removeProperty('--kb-inset')
    }
  }, [])
}
