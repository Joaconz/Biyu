import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// ADR-045 (PR #370), ADR-053: lo que las suscripciones activas todavía van a cobrar. Los casos miran el Resumen de
// H+1, que no tiene movimientos, para que el resultado no dependa del día en que se corre: ahí lo por cobrar es la
// tarjeta `dashboard-pending-subscriptions` y en un mes futuro cuentan todas las activas que ya empezaron.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())

function monthStart(offset: number) {
  const [y, m] = ymd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}
const nextPeriod = () => monthStart(1).slice(0, 7)

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, id }
}
type S = Awaited<ReturnType<typeof setup>>

async function sub(s: S, o: { name: string; amount: string; currency?: 'ARS' | 'USD'; category?: string }) {
  const res = await s.api.rpc('create_subscription', {
    p_name: o.name, p_amount: o.amount, p_currency: o.currency ?? 'ARS', p_category_id: await s.id('categories', o.category ?? 'Servicios'),
    p_account_id: await s.id('accounts', 'Efectivo'), p_billing_day: 1, p_start_period: monthStart(0), p_end_period: null, p_description: null,
  })
  expect(res.status).toBe(200)
  return (res.body as { subscription_id: string }).subscription_id
}

test('CP-SUS-062 · una suscripción activa que todavía no cobró aparece como por cobrar con su total y su cuenta de cobros', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-062')
  await sub(s, { name: 'Netflix', amount: '5000.00', category: 'Entretenimiento' })

  await page.goto(`/dashboard?period=${nextPeriod()}`)
  await expect(page.getByTestId('dashboard-pending-subscriptions-total')).toHaveText('$5.000,00')
  await expect(page.getByTestId('dashboard-pending-subscriptions-count')).toHaveText('1 cobro que todavía no se cargó')

  // Lo por cobrar no generó ningún movimiento.
  await page.goto(`/transactions?period=${nextPeriod()}`)
  await expect(page.getByTestId('transactions-title')).toBeVisible()
  await expect(page.getByTestId('transactions-item')).toHaveCount(0)

  await page.goto(`/dashboard?period=${nextPeriod()}`)
  await page.getByTestId('dashboard-pending-subscriptions-link').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
})

test('CP-SUS-063 · las pausadas y las canceladas no cuentan como por cobrar', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-063')
  const netflix = await sub(s, { name: 'Netflix', amount: '1000.00', category: 'Entretenimiento' })
  const spotify = await sub(s, { name: 'Spotify', amount: '2000.00', category: 'Entretenimiento' })
  const gym = await sub(s, { name: 'Gimnasio', amount: '4000.00', category: 'Salud' })
  expect((await s.api.rpc('pause_subscription', { p_subscription_id: netflix })).status).toBe(200)
  expect((await s.api.rpc('cancel_subscription', { p_subscription_id: spotify })).status).toBe(200)

  await page.goto(`/dashboard?period=${nextPeriod()}`)
  await expect(page.getByTestId('dashboard-pending-subscriptions-total')).toHaveText('$4.000,00')
  await expect(page.getByTestId('dashboard-pending-subscriptions-count')).toHaveText('1 cobro que todavía no se cargó')

  expect((await s.api.rpc('pause_subscription', { p_subscription_id: gym })).status).toBe(200)
  await page.reload()
  await expect(page.getByTestId('dashboard-empty')).toBeVisible()
  await expect(page.getByTestId('dashboard-pending-subscriptions')).toHaveCount(0)
})

test('CP-SUS-064 · una suscripción en US$ sin tipo de cambio del mes se informa aparte y no entra al total', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-064')
  await sub(s, { name: 'ChatGPT', amount: '10.00', currency: 'USD' })
  await sub(s, { name: 'Gimnasio', amount: '3000.00', category: 'Salud' })

  await page.goto(`/dashboard?period=${nextPeriod()}`)
  await expect(page.getByTestId('dashboard-pending-subscriptions-total')).toHaveText('$3.000,00')
  await expect(page.getByTestId('dashboard-pending-subscriptions-usd-pending')).toContainText('USD 10,00')
  await expect(page.getByTestId('dashboard-pending-subscriptions-usd-pending')).toContainText('sin tipo de cambio')
})

test('CP-SUS-065 · si no se pueden leer las suscripciones, el Resumen se ve igual y sin la tarjeta', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-065')
  await sub(s, { name: 'Netflix', amount: '5000.00', category: 'Entretenimiento' })
  expect((await s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '1500.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: await s.id('categories', 'Otros'),
    p_account_id: await s.id('accounts', 'Efectivo'), p_installments_count: 1, p_occurred_on: ymd(), p_description: null, p_request_id: null,
  })).status).toBe(200)

  await page.route(/\/rest\/v1\/subscriptions\?/, (route) => route.abort('failed'))
  await page.goto(`/dashboard?period=${ymd().slice(0, 7)}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toBeVisible({ timeout: 25_000 })
  await expect(page.getByTestId('dashboard-error')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-pending-subscriptions')).toHaveCount(0)
})
