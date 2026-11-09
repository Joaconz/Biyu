import { createContext, useContext, type ReactNode } from 'react'
import { useThemePreference } from '@/hooks/useThemePreference'

type ThemeContextValue = ReturnType<typeof useThemePreference>

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** Una sola fuente del tema (ADR-052): Ajustes lo cambia y los toasts lo siguen. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemePreference()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme necesita <ThemeProvider>')
  return value
}

/** Solo el tema resuelto, para colores que se calculan en JS (gráficos). Sin proveedor, claro. */
export function useResolvedTheme(): 'light' | 'dark' {
  return useContext(ThemeContext)?.resolved ?? 'light'
}
