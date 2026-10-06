import { describe, expect, it } from 'vitest'
import { postAuthDestination } from '@/lib/navigation'

// DEF-008 (#149): al iniciar sesión, RedirectIfAuthed mandaba siempre a /register e ignoraba
// ?next. AuthForm y RedirectIfAuthed ahora deciden el destino con esta misma función. El
// recorrido completo se cubre en e2e/access.spec.ts.
describe('postAuthDestination (DEF-008)', () => {
  it('vuelve al destino original, con su query', () => {
    expect(postAuthDestination('/dashboard?period=2026-06')).toBe('/dashboard?period=2026-06')
    expect(postAuthDestination('/settings')).toBe('/settings')
  })

  it.each([null, '', 'dashboard', 'https://evil.example', '//evil.example', String.raw`/\evil.example`])(
    'sin destino interno válido (%j) va a /register',
    (next) => expect(postAuthDestination(next)).toBe('/register'),
  )

  it('no vuelve a /login ni a /signup', () => {
    expect(postAuthDestination('/login?next=%2Fsettings')).toBe('/register')
    expect(postAuthDestination('/signup')).toBe('/register')
  })
})
