/// <reference lib="dom" />
// (addInitScript y page.evaluate corren en el navegador: necesitan los tipos del DOM)
import { expect, test } from '@playwright/test'

// DEF-008 (#149): sin sesión, abrir una ruta privada lleva a /login?next=…; al iniciar sesión
// RedirectIfAuthed mandaba siempre a /register e ignoraba next. Corre contra el deploy
// (SMOKE_URL), igual que smoke.spec.ts. La regla del destino también está en
// tests/lib/postAuthDestination.test.ts; esto cubre el orden real entre AuthForm y el guard.
const PASSWORD = 'Smoke-Test-2026'

// DEF-023 (#193): después de signUp, AuthForm esperaba la siembra y recién ahí navegaba a
// /register, pisando la redirección a /setup que AppLayout ya había hecho. Si las dos
// navegaciones caían con milisegundos de diferencia, la página quedaba en blanco. Ese momento no
// se puede forzar, pero la navegación tardía sí: con la siembra demorada, nada tiene que volver
// a /register después de llegar a /setup.
test('crear la cuenta lleva a la configuración inicial aunque la siembra tarde (DEF-023)', async ({ page }) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __navigations: string[] }
    w.__navigations = []
    for (const method of ['pushState', 'replaceState'] as const) {
      const original = history[method].bind(history)
      history[method] = (data: unknown, unused: string, url?: string | URL | null) => {
        if (url) w.__navigations.push(new URL(String(url), location.href).pathname)
        return original(data, unused, url)
      }
    }
  })
  await page.route(/\/rest\/v1\/(categories|accounts)/, async (route) => {
    if (route.request().method() === 'POST') await new Promise((resolve) => setTimeout(resolve, 2500))
    await route.continue()
  })
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(`access+lenta-${Date.now()}-${test.info().workerIndex}@biyu.test`)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()

  await expect(page.getByTestId('setup-reason-skip')).toBeVisible()
  // Después de que la siembra lenta termina, sigue en el setup y nada volvió a /register.
  await page.waitForTimeout(4000)
  await expect(page).toHaveURL(/\/setup$/)
  await expect(page.getByTestId('setup-reason-skip')).toBeVisible()
  const navigations = await page.evaluate(() => (window as unknown as { __navigations: string[] }).__navigations)
  expect(navigations.slice(navigations.indexOf('/setup'))).not.toContain('/register')
})

test('al iniciar sesión vuelve al destino original con su período (DEF-008)', async ({ page, browser }) => {
  const email = `access+next-${Date.now()}-${test.info().workerIndex}@biyu.test`
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  // US-68: la cuenta nueva pasa por el setup; se saltea para que no se interponga al volver.
  await page.getByTestId('setup-reason-skip').click()
  await page.getByTestId('setup-categories-skip').click()
  await page.getByTestId('setup-accounts-skip').click()
  await page.getByTestId('setup-expense-skip').click()
  await expect(page).toHaveURL(/\/register$/)

  // Otro contexto: sin sesión.
  const other = await browser.newContext()
  const guest = await other.newPage()
  await guest.goto('/dashboard?period=2026-06')
  await expect(guest).toHaveURL(/\/login\?next=%2Fdashboard%3Fperiod%3D2026-06$/)

  await guest.getByTestId('login-form-email').fill(email)
  await guest.getByTestId('login-form-password').fill(PASSWORD)
  await guest.getByTestId('login-form-submit').click()

  await expect(guest).toHaveURL(/\/dashboard\?period=2026-06$/)
  await other.close()
})
