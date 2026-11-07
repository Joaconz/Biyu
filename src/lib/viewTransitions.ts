// Transiciones entre pantallas (ADR-049). La clasificación es pura y se testea en tests/lib/.
import type { createBrowserRouter } from 'react-router'
import { SCREEN_PATHS, activeNavScreen, screenFromPath } from './navigation'

type DataRouter = ReturnType<typeof createBrowserRouter>

/**
 * `none`: misma ruta (cambiar de mes, un filtro): no se anima, es una acción repetida.
 * `tab`: otra pestaña, fundido. `forward`/`back`: se entra a un detalle o se vuelve de él.
 */
export type TransitionKind = 'none' | 'tab' | 'forward' | 'back'

/** Profundidad de una ruta dentro de su pestaña: 0 la pestaña, 1 un detalle, 2 el detalle de un detalle. */
function depth(pathname: string): number {
  if (pathname === '/import' || pathname === SCREEN_PATHS.transactions) return 1
  return Math.max(0, pathname.split('/').filter(Boolean).length - 1)
}

export function classifyTransition(fromPath: string, toPath: string): TransitionKind {
  if (fromPath === toPath) return 'none'
  const from = activeNavScreen(screenFromPath(fromPath))
  const to = activeNavScreen(screenFromPath(toPath))
  if (from === null || to === null || from !== to) return 'tab'
  const delta = depth(toPath) - depth(fromPath)
  return delta > 0 ? 'forward' : delta < 0 ? 'back' : 'tab'
}

/**
 * Cada navegación del router (Link, NavLink, navigate) pasa por acá: así las 50 y pico llamadas
 * no llevan `viewTransition` una por una. La dirección va en `data-nav` del <html> para el CSS.
 * Sin View Transitions API (Firefox viejo) o con la ruta igual, navega como siempre.
 */
export function installViewTransitions(router: DataRouter): DataRouter {
  const original = router.navigate.bind(router)
  const navigate = (to: Parameters<DataRouter['navigate']>[0], opts?: Parameters<DataRouter['navigate']>[1]) => {
    if (typeof to === 'number' || typeof document === 'undefined' || !('startViewTransition' in document)) {
      return original(to, opts)
    }
    const target = typeof to === 'string' ? to : to?.pathname
    // Sin pathname (solo ?search) o con ruta relativa a la actual: es la misma ruta.
    const toPath = target && target.startsWith('/') ? target.split(/[?#]/)[0] : router.state.location.pathname
    const kind = classifyTransition(router.state.location.pathname, toPath)
    if (kind === 'none') return original(to, opts)
    document.documentElement.dataset.nav = kind
    // La dirección vale para esta navegación: un "atrás" del navegador que llegue después anima con el fundido de base.
    window.setTimeout(() => delete document.documentElement.dataset.nav, 600)
    // Link pasa `viewTransition: undefined` explícito: un spread al final lo pisaría.
    return original(to, { ...opts, viewTransition: opts?.viewTransition ?? true })
  }
  router.navigate = navigate as DataRouter['navigate']
  return router
}
