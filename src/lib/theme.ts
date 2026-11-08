// Tema claro / oscuro (ADR-052). Puro: sin React ni DOM, se testea en tests/lib/theme.test.ts.

/** Lo que elige el usuario en Ajustes. `system` sigue a `prefers-color-scheme`. */
export type ThemePreference = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

/** Clave de localStorage: la preferencia es una comodidad del dispositivo, no un dato del usuario. */
export const THEME_STORAGE_KEY = 'biyu-theme'

/** Color de la barra del navegador por tema: el `--background` de cada uno (index.html lo repite). */
export const THEME_COLOR: Record<ResolvedTheme, string> = { light: '#f3ecdc', dark: '#051f20' }

export const THEME_OPTIONS: ReadonlyArray<{ value: ThemePreference; label: string }> = [
  { value: 'system', label: 'Automático' },
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
]

/** Lee lo guardado; cualquier valor desconocido (o nada) vuelve a `system`. */
export function parseThemePreference(stored: string | null | undefined): ThemePreference {
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system'
}

export function resolveTheme(preference: ThemePreference, systemPrefersDark: boolean): ResolvedTheme {
  if (preference === 'system') return systemPrefersDark ? 'dark' : 'light'
  return preference
}
