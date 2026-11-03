import { expect, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-83 (#271), ADR-041: las deudas sueltas mueven el balance del mes. CA-1, CA-2, CA-3, CA-8, CA-9, CA-10 y CA-14.

type Api = Awaited<ReturnType<typeof apiSession>>

function dayOfMonth(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

async function seed(page: Page, request: Parameters<typeof apiSession>[0], tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const category = (await api.select('categories', 'select=id&name=eq.Otros')).body as { id: string }[]
  const account = (await api.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[]
  return { api, category: category[0].id, account: account[0].id }
}

const transaction = (api: Api, type: 'income' | 'expense', amount: string, category: string, account: string, extra: Record<string, unknown> = {}) =>
  api.rpc('create_transaction', {
    p_type: type, p_amount: amount, p_currency: 'ARS', p_fx_rate: null,
    p_category_id: type === 'expense' ? category : null, p_account_id: account,
    p_installments_count: 1, p_occurred_on: dayOfMonth(), p_description: null, p_request_id: null, ...extra,
  })

const debt = (api: Api, direction: 'owed_to_me' | 'i_owe', person: string, amount: string) =>
  api.rpc('create_debt', {
    p_direction: direction, p_person: person, p_amount: amount, p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: dayOfMonth(), p_notes: null,
  })

test('CA-1, CA-3 y CA-14 · «me deben» resta del balance, saldarla lo deja en $100.000 y la línea sigue', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca1')
  expect((await transaction(api, 'income', '100000', category, account)).status).toBe(200)
  const created = await debt(api, 'owed_to_me', 'Juan', '20000')
  expect(created.status).toBe(200)

  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('$80.000,00')
  await expect(page.getByTestId('dashboard-balance-badge')).toHaveText('Superávit')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveText('Incluye deudas sueltas: -$20.000,00')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$0,00')
  await expect(page.getByTestId('dashboard-total-income')).toHaveText('$100.000,00')

  expect((await api.rpc('settle_debt', { p_debt_id: created.body })).status).toBe(204)
  await page.reload()
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('$100.000,00')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveText('Incluye deudas sueltas: $0,00')
})

test('CA-2 · «debo» suma al balance', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca2')
  await transaction(api, 'income', '100000', category, account)
  await debt(api, 'i_owe', 'Marta', '50000')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('$150.000,00')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveText('Incluye deudas sueltas: $50.000,00')
})

test('CA-8 · un gasto compartido no mueve el balance ni muestra la línea', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca8')
  await transaction(api, 'expense', '120000', category, account, { p_shared_persons: ['Sofía'], p_shared_amounts: ['60000'] })
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$120.000,00')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveCount(0)
})

test('CA-9 · un mes con solo la deuda muestra el Resumen y no el estado vacío', async ({ page, request }) => {
  const { api } = await seed(page, request, 'us83-ca9')
  await debt(api, 'owed_to_me', 'Juan', '20000')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-empty')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$0,00')
  await expect(page.getByTestId('dashboard-total-income')).toHaveText('$0,00')
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$20.000,00')
  await expect(page.getByTestId('dashboard-balance-badge')).toHaveText('Déficit')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toBeVisible()
})
