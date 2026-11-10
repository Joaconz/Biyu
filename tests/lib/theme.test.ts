import { describe, expect, it } from 'vitest'
import { parseThemePreference, resolveTheme } from '@/lib/theme'

describe('parseThemePreference', () => {
  it('acepta las tres opciones guardadas', () => {
    expect(parseThemePreference('light')).toBe('light')
    expect(parseThemePreference('dark')).toBe('dark')
    expect(parseThemePreference('system')).toBe('system')
  })

  it('sin nada guardado o con un valor desconocido, sigue al sistema', () => {
    expect(parseThemePreference(null)).toBe('system')
    expect(parseThemePreference(undefined)).toBe('system')
    expect(parseThemePreference('sepia')).toBe('system')
  })
})

describe('resolveTheme', () => {
  it('en «Automático» sigue a prefers-color-scheme', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })

  it('una elección explícita le gana al sistema', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })
})
