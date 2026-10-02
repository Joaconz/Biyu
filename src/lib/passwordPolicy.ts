// US-67: criterios de contraseña de la app. El cliente valida para UX (C6); Supabase Auth exige
// los mismos criterios con `minimum_password_length` y `password_requirements` de
// supabase/config.toml (DEF-005, tests/lib/passwordPolicy.test.ts).
export const SPECIAL_CHARS = '!@#$%^&*()_+-=[]{};:\'"\\|,.<>/?'

export interface PasswordCriterion {
  key: 'length' | 'uppercase' | 'lowercase' | 'number' | 'special'
  label: string
  test: (password: string) => boolean
}

export const PASSWORD_CRITERIA: readonly PasswordCriterion[] = [
  { key: 'length', label: 'Al menos 8 caracteres', test: (p) => p.length >= 8 },
  { key: 'uppercase', label: 'Al menos una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { key: 'lowercase', label: 'Al menos una minúscula', test: (p) => /[a-z]/.test(p) },
  { key: 'number', label: 'Al menos un número', test: (p) => /[0-9]/.test(p) },
  { key: 'special', label: 'Al menos un carácter especial (!@#$%^&*...)', test: (p) => [...p].some((c) => SPECIAL_CHARS.includes(c)) },
]

export function unmetPasswordCriteria(password: string): PasswordCriterion[] {
  return PASSWORD_CRITERIA.filter((c) => !c.test(password))
}
