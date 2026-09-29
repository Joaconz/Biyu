import { expect, type Page, test } from '@playwright/test'

// DEF-022 (US-68, ADR-025): completar el setup tiene que llevar a la app y dejarla usable; una
// cuenta que ya existía no puede quedar atrapada en /setup, y un error al leer o guardar el
// estado del setup nunca puede bloquear el acceso. Corre contra el deploy (SMOKE_URL), igual que
// smoke.spec.ts, así detecta también una migración que no se aplicó en la base hosteada.
const PASSWORD = 'Smoke-Test-2026'
const SETUP_REST = '**/rest/v1/user_setup**'

async function signUp(page: Page, tag: string) {
  const email = `setup+${tag}-${Date.now()}-${test.info().workerIndex}@biyu.test`
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  return email
}

async function skipWholeSetup(page: Page) {
  await page.getByTestId('setup-reason-skip').click()
  await page.getByTestId('setup-categories-skip').click()
  await page.getByTestId('setup-accounts-skip').click()
  await page.getByTestId('setup-expense-skip').click()
}

async function expectInsideApp(page: Page) {
  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form')).toBeVisible()
}

async function logIn(page: Page, email: string) {
  await page.goto('/login')
  await page.getByTestId('login-form-email').fill(email)
  await page.getByTestId('login-form-password').fill(PASSWORD)
  await page.getByTestId('login-form-submit').click()
}

test('una cuenta nueva ve el setup, lo saltea y queda adentro de la app aunque recargue', async ({ page }) => {
  await signUp(page, 'saltear')
  await expect(page).toHaveURL(/\/setup$/)
  await skipWholeSetup(page)
  await expectInsideApp(page)

  await page.reload()
  await expectInsideApp(page)
  await page.getByTestId('register-nav-dashboard').click()
  await expect(page).toHaveURL(/\/dashboard/)
})

test('completar el setup con el primer gasto lleva a la app', async ({ page }) => {
  await signUp(page, 'gasto')
  await expect(page).toHaveURL(/\/setup$/)
  await page.getByTestId('setup-reason-option-entender').click()
  await page.getByTestId('setup-reason-continue').click()
  await page.getByTestId('setup-categories-continue').click()
  await page.getByTestId('setup-accounts-continue').click()

  await page.getByTestId('transaction-form-amount').fill('1500')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-submit').click()

  await expectInsideApp(page)
})

test('después de completarlo, volver a iniciar sesión no muestra el setup', async ({ page, browser }) => {
  const email = await signUp(page, 'relogin')
  await skipWholeSetup(page)
  await expectInsideApp(page)

  const other = await browser.newContext()
  const again = await other.newPage()
  await logIn(again, email)
  await expectInsideApp(again)
  await other.close()
})

test('si guardar el setup falla, igual se entra a la app', async ({ page }) => {
  await signUp(page, 'falla-guardar')
  await expect(page).toHaveURL(/\/setup$/)
  await page.route(SETUP_REST, (route) =>
    route.request().method() === 'GET' ? route.continue() : route.fulfill({ status: 500, body: '{}' }),
  )
  await skipWholeSetup(page)
  await expectInsideApp(page)
})

test('si leer el estado del setup falla, se entra a la app', async ({ page }) => {
  await page.route(SETUP_REST, (route) =>
    route.request().method() === 'GET' ? route.fulfill({ status: 500, body: '{}' }) : route.continue(),
  )
  await signUp(page, 'falla-leer')
  await expectInsideApp(page)
})

test('una cuenta sin fila de setup (anterior a US-68) entra directo a la app', async ({ page }) => {
  // La fila la crea la base al registrarse (ADR-025); una cuenta vieja no la tiene. Se simula
  // respondiendo "sin fila", que es lo que devuelve la API para esas cuentas.
  await page.route(SETUP_REST, (route) =>
    route.request().method() === 'GET'
      ? route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      : route.continue(),
  )
  await signUp(page, 'cuenta-vieja')
  await expectInsideApp(page)
})
