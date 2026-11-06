import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Regresión de V3 · Monedas (MON). CP-MON-001, 002, 004, 005 y 007 del catálogo de V1
// (entrega-3/03-seleccion-regresion.md).

const argentinaYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const thisMonth = () => `${argentinaYmd().slice(0, 7)}-01`

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, other: await id('categories', 'Otros'), transport: await id('categories', 'Transporte'), cash: await id('accounts', 'Efectivo') }
}
type Setup = Awaited<ReturnType<typeof setup>>

const setReference = (s: Setup, rate: string) => s.api.rpc('upsert_fx_rate', { p_period: thisMonth(), p_ars_per_usd: rate })

const create = (s: Setup, o: { currency: 'ARS' | 'USD'; amount: string; fx: string | null; category?: string }) =>
  s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: o.amount, p_currency: o.currency, p_fx_rate: o.fx, p_category_id: o.category ?? s.other,
    p_account_id: s.cash, p_installments_count: 1, p_occurred_on: argentinaYmd(), p_description: null, p_request_id: null,
  })

const rows = async (s: Setup) =>
  (await s.api.select('transactions', 'select=currency,amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:ledger_entries(amount_ars::text)&order=created_at')).body as {
    currency: string
    amount_text: string
    fx_rate_text: string | null
    amount_ars_text: { amount_ars: string }[]
  }[]

async function registerUsd(page: Page, amount: string, rate?: string) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-currency-usd').click()
  if (rate) await page.getByTestId('transaction-form-fx-rate').fill(rate)
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
}

test('CP-MON-001 · un gasto en US$ con el tipo de cambio sugerido se guarda a 1250 y $125.000', async ({ page, request }) => {
  const s = await setup(page, request, 'mon-001')
  await setReference(s, '1250.00')
  await page.goto('/register')
  await page.getByTestId('transaction-form-currency-usd').click()
  await expect(page.getByTestId('transaction-form-fx-rate')).toHaveValue(/1\.?250/)
  await registerUsd(page, '100')
  const [tx] = await rows(s)
  expect(tx).toMatchObject({ currency: 'USD', amount_text: '100.00', fx_rate_text: '1250.0000' })
  expect(tx.amount_ars_text[0].amount_ars).toBe('125000.00')
})

test('CP-MON-002 · tabla de decisión de moneda y tipo de cambio', async ({ page, request }) => {
  const s = await setup(page, request, 'mon-002')
  // Fila 5: US$ sin referencia y sin tipo de cambio. La pantalla lo avisa y no deja avanzar; la API lo rechaza (I5).
  await page.goto('/register')
  await page.getByTestId('transaction-form-currency-usd').click()
  await page.getByTestId('transaction-form-amount').fill('100')
  await expect(page.getByText('No tenés un tipo de cambio configurado para este mes.')).toBeVisible()
  await expect(page.getByTestId('transaction-form-fx-settings')).toBeVisible()
  await expect(page.getByTestId('transaction-form-next')).toBeDisabled()
  const row5 = await create(s, { currency: 'USD', amount: '100.00', fx: null })
  expect(row5.status).toBe(400)
  expect(row5.body).toMatchObject({ code: '23514' })
  // Fila 2: ARS con tipo de cambio. La pantalla no ofrece el campo; la API lo rechaza (I5).
  await page.getByTestId('transaction-form-currency-ars').click()
  await expect(page.getByTestId('transaction-form-fx-rate')).toHaveCount(0)
  const row2 = await create(s, { currency: 'ARS', amount: '100.00', fx: '1250.00' })
  expect(row2.status).toBe(400)
  expect(row2.body).toMatchObject({ code: '23514' })
  // Fila 6: US$ sin referencia con tipo de cambio escrito: se guarda.
  expect((await create(s, { currency: 'USD', amount: '100.00', fx: '1300.00' })).status).toBe(200)
  // Filas 1, 3 y 4: ARS sin tipo de cambio; US$ con referencia sin y con override.
  await setReference(s, '1250.00')
  expect((await create(s, { currency: 'ARS', amount: '100.00', fx: null })).status).toBe(200)
  expect((await create(s, { currency: 'USD', amount: '100.00', fx: '1250.00' })).status).toBe(200)
  expect((await create(s, { currency: 'USD', amount: '100.00', fx: '1300.00' })).status).toBe(200)
  expect(await rows(s)).toHaveLength(4)
})

test('CP-MON-004 · cambiar la referencia no altera lo ya guardado', async ({ page, request }) => {
  const s = await setup(page, request, 'mon-004')
  await setReference(s, '1250.00')
  await registerUsd(page, '100')
  await setReference(s, '1400.00')
  const [tx] = await rows(s)
  expect(tx.fx_rate_text).toBe('1250.0000')
  expect(tx.amount_ars_text[0].amount_ars).toBe('125000.00')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('125.000,00')
})

test('CP-MON-005 · el total del mes en pesos incluye lo gastado en dólares', async ({ page, request }) => {
  const s = await setup(page, request, 'mon-005')
  await setReference(s, '1250.00')
  expect((await create(s, { currency: 'ARS', amount: '50000.00', fx: null })).status).toBe(200)
  expect((await create(s, { currency: 'USD', amount: '100.00', fx: '1250.00', category: s.transport })).status).toBe(200)
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('175.000,00')
})

test('CP-MON-007 · otro usuario no lee ni modifica el tipo de cambio ajeno', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'mon-007a')
  await setReference(a, '1250.00')
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'mon-007b')
  expect((await b.api.select('fx_rates', `select=ars_per_usd&user_id=eq.${a.api.userId}`)).body).toEqual([])
  const patch = await b.api.patch('fx_rates', `user_id=eq.${a.api.userId}`, { ars_per_usd: 1 })
  // La base niega el UPDATE directo (42501) o no toca ninguna fila: lo que importa es que el tipo de cambio de A no cambia.
  expect(Array.isArray(patch.body) ? patch.body : []).toEqual([])
  expect(patch.status).toBeGreaterThanOrEqual(200)
  const mine = (await a.api.select('fx_rates', 'select=ars_per_usd_text:ars_per_usd::text')).body as { ars_per_usd_text: string }[]
  expect(mine).toEqual([{ ars_per_usd_text: '1250.0000' }])
})
