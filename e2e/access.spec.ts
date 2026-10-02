import { expect, test } from '@playwright/test'

// DEF-008 (#149): sin sesión, abrir una ruta privada lleva a /login?next=…; al iniciar sesión
// RedirectIfAuthed mandaba siempre a /register e ignoraba next. Corre contra el deploy
// (SMOKE_URL), igual que smoke.spec.ts. La regla del destino también está en
// tests/lib/postAuthDestination.test.ts; esto cubre el orden real entre AuthForm y el guard.
const PASSWORD = 'Smoke-Test-2026'

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
