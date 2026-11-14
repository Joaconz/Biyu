import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-95 (#356): Suscripciones usa los mismos textos y controles que Registrar y Deudas. CP-SUS-160 a 162.

const currentMonthStart = () =>
  `${new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()).slice(0, 7)}-01`

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, id }
}

async function createSubscription(s: Awaited<ReturnType<typeof setup>>, name: string, amount: string, currency: 'ARS' | 'USD') {
  const res = await s.api.rpc('create_subscription', {
    p_name: name, p_amount: amount, p_currency: currency, p_category_id: await s.id('categories', 'Entretenimiento'),
    p_account_id: await s.id('accounts', 'Efectivo'), p_billing_day: 10, p_start_period: currentMonthStart(), p_end_period: null, p_description: null,
  })
  expect(res.status).toBe(200)
  return (res.body as { subscription_id: string }).subscription_id
}

test('CP-SUS-160 · el alta muestra «US$», «Cuenta» y chips en lugar de selects', async ({ page, request }) => {
  await setup(page, request, 'cp-sus-160')
  await page.goto('/subscriptions/new')
  await expect(page.getByTestId('subscription-form-currency-usd')).toHaveText('US$')
  await expect(page.locator('#subscription-form-account-label')).toHaveText('Cuenta')
  await expect(page.locator('select')).toHaveCount(0)
  await page.getByTestId('subscription-form-submit').click()
  await expect(page.getByTestId('subscription-form-account-error')).toHaveText('Elegí una cuenta')
  await page.getByTestId('subscription-form-category-chip-entretenimiento').click()
  await page.getByTestId('subscription-form-account-chip-efectivo').click()
  await expect(page.getByTestId('subscription-form-category-chip-entretenimiento')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('subscription-form-account-chip-efectivo')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('subscription-form-account-error')).toHaveCount(0)
})

test('CP-SUS-161 · la edición de una suscripción en dólares muestra «US$» y los chips elegidos', async ({ page, request }) => {
  const s = await setup(page, request, 'cp-sus-161')
  const subId = await createSubscription(s, 'Figma', '15.00', 'USD')
  await page.goto(`/subscriptions/${subId}/edit`)
  await expect(page.getByTestId('subscription-form-currency-readonly')).toHaveText('US$')
  await expect(page.getByTestId('subscription-form-category-chip-entretenimiento')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('subscription-form-account-chip-efectivo')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('select')).toHaveCount(0)
})

test('CP-SUS-162 · la lista ofrece «Nueva suscripción» y el detalle dice «Cuenta»', async ({ page, request }) => {
  const s = await setup(page, request, 'cp-sus-162')
  const subId = await createSubscription(s, 'Netflix', '5000.00', 'ARS')
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-new')).toHaveText('Nueva suscripción')
  await page.goto(`/subscriptions/${subId}`)
  await expect(page.getByText('Medio de pago')).toHaveCount(0)
  await expect(page.getByText('Cuenta', { exact: true })).toBeVisible()
})
