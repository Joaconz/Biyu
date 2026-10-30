import { expect, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Los helpers de e2e/support (#334) hacen lo que dicen PR-01 y PR-04. Si este falla, falla toda la
// automatización: conviene mirarlo primero.
test('PR-01 y PR-04: alta con setup salteado y lectura por la API con el token del usuario', async ({ page, request }) => {
  const { email } = await signUpAndSkipSetup(page, 'harness')
  const api = await apiSession(request, email)

  const categories = await api.select('categories', 'select=id,name')
  expect(categories.status).toBe(200)
  expect((categories.body as unknown[]).length).toBeGreaterThan(0)

  // Par de autorización (C7): sin sesión no se lee nada.
  const anon = await api.select('categories', 'select=id', { asAnon: true })
  expect([401, 403]).toContain(anon.status)
})
