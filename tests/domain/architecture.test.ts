import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// M2 del brief: el dominio no depende de infraestructura ni de UI (C1).
describe('arquitectura: src/domain es puro', () => {
  const dir = join(import.meta.dirname, '../../src/domain')
  const forbidden = /from\s+['"](@supabase\/|react|react-dom|react-router|@\/lib\/|@\/hooks\/|@\/components\/|@\/pages\/)/
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts'))) {
    it(`${file} no importa infraestructura`, () => {
      expect(readFileSync(join(dir, file), 'utf8')).not.toMatch(forbidden)
    })
  }
  it('solo money.ts importa decimal.js', () => {
    for (const file of readdirSync(dir).filter((f) => f !== 'money.ts')) {
      expect(readFileSync(join(dir, file), 'utf8')).not.toMatch(/from\s+['"]decimal\.js['"]/)
    }
  })
})
