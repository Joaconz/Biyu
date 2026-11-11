import { expect, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'
import { openSpentOptions } from './support/dashboard.ts'

// US-101 (#371), ADR-047, ADR-053: qué entra en el número del Resumen (el gasto neto), elegido en Ajustes.

function firstOfMonth(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

test('CP-CFG-040 · el predeterminado es solo gastos y cada interruptor cambia solo el número del Resumen', async ({ page, request }) => {
  const { email } = await signUpAndSkipSetup(page, 'us101-balance')
  const api = await apiSession(request, email)
  const category = ((await api.select('categories', 'select=id&name=eq.Otros')).body as { id: string }[])[0].id
  const account = ((await api.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[])[0].id
  const base = { p_currency: 'ARS', p_fx_rate: null, p_account_id: account, p_installments_count: 1, p_occurred_on: firstOfMonth(), p_description: null, p_request_id: null }
  expect((await api.rpc('create_transaction', { ...base, p_type: 'income', p_amount: '100000', p_category_id: null })).status).toBe(200)
  expect((await api.rpc('create_transaction', { ...base, p_type: 'expense', p_amount: '120000', p_category_id: category, p_shared_persons: ['Sofía'], p_shared_amounts: ['60000'] })).status).toBe(200)
  expect((await api.rpc('create_debt', { p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '20000', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: firstOfMonth(), p_notes: null })).status).toBe(200)

  // Predeterminado: ninguna opción, el número es lo gastado.
  await page.goto('/settings')
  for (const slug of ['income', 'loose-debts', 'reimbursements', 'pending-subscriptions']) {
    await expect(page.getByTestId(`settings-summary-${slug}`)).toHaveAttribute('aria-checked', 'false')
  }
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$120.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Solo gastos')

  // Restar los ingresos: 120.000 − 100.000.
  await page.goto('/settings')
  await page.getByTestId('settings-summary-income').click()
  await expect(page.getByTestId('settings-summary-income')).toHaveAttribute('aria-checked', 'true')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$20.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos')

  // Incluir el reembolso resta los $60.000 que te deben por el gasto compartido y deja el número en negativo.
  await page.goto('/settings')
  await page.getByTestId('settings-summary-reimbursements').click()
  await expect(page.getByTestId('settings-summary-reimbursements')).toHaveAttribute('aria-checked', 'true')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('-$40.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos − reembolsos')
  // Lo gastado no cambia con las opciones: sigue en su línea del desglose (ADR-053).
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-expenses-amount')).toHaveText('$120.000,00')
  await page.keyboard.press('Escape')

  // Prender y apagar las deudas sueltas: la línea queda «fuera del número» y la preferencia sigue al recargar.
  await page.goto('/settings')
  await page.getByTestId('settings-summary-loose-debts').click()
  await expect(page.getByTestId('settings-summary-loose-debts')).toHaveAttribute('aria-checked', 'true')
  await page.getByTestId('settings-summary-loose-debts').click()
  await expect(page.getByTestId('settings-summary-loose-debts')).toHaveAttribute('aria-checked', 'false')
  await page.reload()
  await expect(page.getByTestId('settings-summary-loose-debts')).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByTestId('settings-summary-income')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('settings-summary-reimbursements')).toHaveAttribute('aria-checked', 'true')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('-$40.000,00')
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-loose-debts')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos − reembolsos')
})
