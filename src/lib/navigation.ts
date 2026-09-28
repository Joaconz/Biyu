// Navegación global (ADR-023). Sin React ni Supabase: se testea en tests/lib/.

export type Screen = 'register' | 'dashboard' | 'transactions' | 'settings'

export const SCREEN_PATHS: Record<Screen, string> = {
  register: '/register',
  dashboard: '/dashboard',
  transactions: '/transactions',
  settings: '/settings',
}

export interface NavItem {
  screen: Screen
  label: string
}

/**
 * Destinos de la barra en V1. En V2 pasa a Registrar · Resumen · Deudas · Suscripciones, y
 * Movimientos queda como "Ver todos" dentro del Resumen (roadmap §V2, ADR-023).
 */
export const NAV_ITEMS_V1: readonly NavItem[] = [
  { screen: 'register', label: 'Registrar' },
  { screen: 'dashboard', label: 'Resumen' },
  { screen: 'transactions', label: 'Movimientos' },
]

export function screenFromPath(pathname: string): Screen | null {
  const entry = Object.entries(SCREEN_PATHS).find(([, path]) => pathname === path || pathname.startsWith(`${path}/`))
  return entry ? (entry[0] as Screen) : null
}

/** Conserva los testids por pantalla de la navegación anterior: `register-nav-dashboard`, etc. */
export function navTestId(screen: Screen, destination: Screen): string {
  return `${screen}-nav-${destination}`
}

const PERIOD_SCREENS: ReadonlySet<Screen> = new Set(['dashboard', 'transactions'])

/**
 * Entre Resumen y Movimientos el mes elegido viaja en la URL (C11). Desde otras pantallas no:
 * Ajustes también usa `?period` para el tipo de cambio, y no es el mismo mes "de lectura".
 */
export function navHref(destination: Screen, current: Screen | null, search: string): string {
  const path = SCREEN_PATHS[destination]
  if (!current || !PERIOD_SCREENS.has(current) || !PERIOD_SCREENS.has(destination)) return path
  const period = new URLSearchParams(search).get('period')
  return period ? `${path}?period=${encodeURIComponent(period)}` : path
}
