// Navegación global (ADR-023). Sin React ni Supabase: se testea en tests/lib/.

export type Screen = 'register' | 'dashboard' | 'transactions' | 'debts' | 'subscriptions' | 'settings'

export const SCREEN_PATHS: Record<Screen, string> = {
  register: '/register',
  dashboard: '/dashboard',
  transactions: '/transactions',
  debts: '/debts',
  subscriptions: '/subscriptions',
  settings: '/settings',
}

export interface NavItem {
  screen: Screen
  label: string
}

/**
 * Destinos de la barra en V2 (US-69, ADR-023). Movimientos sale de la barra y cuelga del Resumen
 * ("Ver todos"); Ajustes va aparte (engranaje en el celular, pie de la barra lateral).
 */
export const NAV_ITEMS: readonly NavItem[] = [
  { screen: 'register', label: 'Registrar' },
  { screen: 'dashboard', label: 'Resumen' },
  { screen: 'debts', label: 'Deudas' },
  { screen: 'subscriptions', label: 'Suscripciones' },
]

/** Qué ítem marca la barra en cada pantalla (US-69 · CA-3): Movimientos cuelga del Resumen. */
export function activeNavScreen(screen: Screen | null): Screen | null {
  return screen === 'transactions' ? 'dashboard' : screen
}

/**
 * Tocar el ítem de la ruta exacta en la que ya se está no hace nada (US-69): no recarga, no vuelve
 * al paso 1 del registro ni cambia el `?period`. Desde una subruta o desde Movimientos sí navega.
 */
export function isCurrentNavTarget(destination: Screen, pathname: string): boolean {
  return pathname === SCREEN_PATHS[destination]
}

/** Pantallas sin pestaña propia que cuelgan de otra: Importar desde Excel es otra forma de registrar (US-74). */
const CHILD_SCREENS: Record<string, Screen> = { '/import': 'register' }

export function screenFromPath(pathname: string): Screen | null {
  if (CHILD_SCREENS[pathname]) return CHILD_SCREENS[pathname]
  const entry = Object.entries(SCREEN_PATHS).find(([, path]) => pathname === path || pathname.startsWith(`${path}/`))
  return entry ? (entry[0] as Screen) : null
}

/** Conserva los testids por pantalla de la navegación anterior: `register-nav-dashboard`, etc. */
export function navTestId(screen: Screen, destination: Screen): string {
  return `${screen}-nav-${destination}`
}

const AUTH_PATHS = ['/login', '/signup']

/**
 * A dónde ir después de iniciar sesión o registrarse: el `?next` que dejó RequireAuth, si es una
 * ruta interna. "//host" y "/\host" los resuelve el navegador como otro sitio, así que no
 * cuentan como internas. DEF-008: AuthForm y RedirectIfAuthed usan esta misma regla.
 */
export function postAuthDestination(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//') || next.startsWith('/\\')) return '/register'
  const pathname = next.split(/[?#]/, 1)[0]
  return AUTH_PATHS.includes(pathname) ? '/register' : next
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
