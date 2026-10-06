import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Foco de un diálogo modal (DEF-024, WCAG 2.4.3 y el patrón dialog de ARIA): al abrirse lleva el
 * foco a `initialFocus` (en una confirmación destructiva, Cancelar), Tab y Shift+Tab no salen del
 * diálogo y, al cerrarse, el foco vuelve al elemento que lo abrió.
 */
export function useModalFocus(
  isOpen: boolean,
  container: RefObject<HTMLElement | null>,
  initialFocus: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isOpen) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null
    initialFocus.current?.focus()

    function trapTab(e: KeyboardEvent) {
      const root = container.current
      if (e.key !== 'Tab' || !root) return
      const focusable = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const inside = root.contains(document.activeElement)
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', trapTab)
    return () => {
      document.removeEventListener('keydown', trapTab)
      // Si el que abrió el diálogo ya no está (se eliminó su fila), el foco queda donde caiga.
      if (opener?.isConnected) opener.focus()
    }
  }, [isOpen, container, initialFocus])
}
