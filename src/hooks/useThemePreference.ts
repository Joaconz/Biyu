import { useCallback, useEffect, useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import {
  THEME_COLOR,
  THEME_STORAGE_KEY,
  parseThemePreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme'

const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStored(): ThemePreference {
  try {
    return parseThemePreference(window.localStorage.getItem(THEME_STORAGE_KEY))
  } catch {
    // Navegación privada o almacenamiento bloqueado: se sigue al sistema.
    return 'system'
  }
}

/** Aplica el tema al documento: la clase `.dark`, `color-scheme` y el color de la barra del navegador. */
export function applyTheme(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
  for (const meta of document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')) {
    meta.content = THEME_COLOR[theme]
  }
}

/**
 * Preferencia de tema (ADR-052). El script de index.html ya aplicó lo guardado antes del primer pintado;
 * acá se mantiene sincronizado con el sistema (en «Automático») y con lo que elija el usuario.
 */
export function useThemePreference() {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStored)
  const systemPrefersDark = useMediaQuery(DARK_QUERY)
  const resolved = resolveTheme(preference, systemPrefersDark)

  useEffect(() => {
    applyTheme(resolved)
  }, [resolved])

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Sin almacenamiento la elección dura lo que la pestaña.
    }
  }, [])

  return { preference, resolved, setPreference }
}
