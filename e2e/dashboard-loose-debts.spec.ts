import { expect, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'
import { includeInSpent, openSpentOptions } from './support/dashboard.ts'

// US-83 (#271), ADR-041, ADR-053: las deudas sueltas mueven el número del Resumen (el gasto neto) cuando el usuario
// las incluye. CA-1, CA-2, CA-3, CA-8, CA-9, CA-10 y CA-14. La línea es una fila del desglose del héroe: el signo
// (suma/resta) va en su columna y el monto sin signo. Prestar plata suma al gasto neto; que te presten, lo baja.

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

/** La fila «Deudas sueltas» del desglose: adentro del número, con su signo y su monto sin signo. */
async function expectLooseDebtLine(page: Page, sign: 'suma' | 'resta', amount: string) {
  await openSpentOptions(page)
  const line = page.getByTestId('dashboard-spent-loose-debts')
  await expect(line).toHaveAttribute('data-included', 'true')
  await expect(line).toContainText(sign)
  await expect(page.getByTestId('dashboard-spent-loose-debts-amount')).toHaveText(amount)
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('dashboard-spent-options-panel')).toHaveCount(0)
}

const debt = (api: Api, direction: 'owed_to_me' | 'i_owe', person: string, amount: string) =>
  api.rpc('create_debt', {
    p_direction: direction, p_person: person, p_amount: amount, p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: dayOfMonth(), p_notes: null,
  })

test('CA-1, CA-3 y CA-14 · «me deben» suma al gasto neto, saldarla lo deja en -$100.000 y la línea sigue', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca1')
  expect((await transaction(api, 'income', '100000', category, account)).status).toBe(200)
  const created = await debt(api, 'owed_to_me', 'Juan', '20000')
  expect(created.status).toBe(200)

  await page.goto('/dashboard')
  await includeInSpent(page, ['income', 'loose-debts'])
  // 0 gastado − 100.000 de ingresos + 20.000 que prestó.
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('-$80.000,00')
  await expectLooseDebtLine(page, 'suma', '$20.000,00')
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-expenses-amount')).toHaveText('$0,00')
  await expect(page.getByTestId('dashboard-total-income')).toHaveText('$100.000,00')
  await page.keyboard.press('Escape')

  expect((await api.rpc('settle_debt', { p_debt_id: created.body })).status).toBe(204)
  await page.reload()
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('-$100.000,00')
  await expectLooseDebtLine(page, 'suma', '$0,00')
})

test('CA-2 · «debo» baja el gasto neto', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca2')
  await transaction(api, 'income', '100000', category, account)
  await debt(api, 'i_owe', 'Marta', '50000')
  await page.goto('/dashboard')
  await includeInSpent(page, ['income', 'loose-debts'])
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('-$150.000,00')
  await expectLooseDebtLine(page, 'resta', '$50.000,00')
})

test('CA-8 · un gasto compartido no mueve las deudas sueltas ni muestra la línea', async ({ page, request }) => {
  const { api, category, account } = await seed(page, request, 'us83-ca8')
  await transaction(api, 'expense', '120000', category, account, { p_shared_persons: ['Sofía'], p_shared_amounts: ['60000'] })
  await page.goto('/dashboard')
  await includeInSpent(page, ['loose-debts'])
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$120.000,00')
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-loose-debts')).toHaveCount(0)
})

test('CA-9 · un mes con solo la deuda muestra el Resumen y no el estado vacío', async ({ page, request }) => {
  const { api } = await seed(page, request, 'us83-ca9')
  await debt(api, 'owed_to_me', 'Juan', '20000')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-empty')).toHaveCount(0)
  // Sin incluirlas el número es lo gastado y la deuda queda «fuera del número» (ADR-053).
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$0,00')
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-loose-debts')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-income')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await includeInSpent(page, ['loose-debts'])
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$20.000,00')
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-loose-debts')).toBeVisible()
})
