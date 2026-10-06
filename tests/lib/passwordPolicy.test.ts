import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PASSWORD_CRITERIA, SPECIAL_CHARS } from '@/lib/passwordPolicy'

// DEF-005 (#146): Supabase Auth aceptaba contraseñas que no cumplen US-67 (6 caracteres, sin
// requisitos), así que saltear el cliente alcanzaba. La validación del servidor sale de
// supabase/config.toml; este test la ata a la política del cliente para que no se separen.
// El proyecto hosteado no lee este archivo: ver docs/09-guia-de-inicio.md.
const config = readFileSync(join(import.meta.dirname, '../../supabase/config.toml'), 'utf8')
const setting = (key: string) => new RegExp(String.raw`^${key}\s*=\s*(.+)$`, 'm').exec(config)?.[1].trim()

// Los símbolos que Supabase Auth (GoTrue) cuenta para `lower_upper_letters_digits_symbols`.
const GOTRUE_SYMBOLS = String.raw`!@#$%^&*()_+-=[]{};'\:"|<>?,./` + '`~'

describe('política de contraseñas en el servidor (DEF-005)', () => {
  it('exige el mismo largo mínimo que el cliente', () => {
    const minLength = PASSWORD_CRITERIA.find((c) => c.key === 'length')!
    const serverMin = Number(setting('minimum_password_length'))
    expect(minLength.test('a'.repeat(serverMin))).toBe(true)
    expect(minLength.test('a'.repeat(serverMin - 1))).toBe(false)
  })

  it('exige mayúscula, minúscula, número y carácter especial', () => {
    expect(setting('password_requirements')).toBe('"lower_upper_letters_digits_symbols"')
  })

  it('todo carácter especial que acepta el cliente también lo acepta el servidor', () => {
    expect([...SPECIAL_CHARS].filter((c) => !GOTRUE_SYMBOLS.includes(c))).toEqual([])
  })
})
