import { expect, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'
import { openSpentOptions } from './support/dashboard.ts'

// US-101 (#371), ADR-053: qué entra en el número del Resumen (el gasto neto) se elige desde la misma tarjeta verde.
// El número se recalcula al instante, la elección se guarda en user_preferences y Ajustes muestra lo mismo.

function firstOfMonth(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }))
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

/** Ingreso de $100.000, gasto compartido de $120.000 (Sofía debe $60.000) y Juan me debe $20.000 sin gasto. */
async function seed(page: Page, request: Parameters<typeof apiSession>[0], tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const category = ((await api.select('categories', 'select=id&name=eq.Otros')).body as { id: string }[])[0].id
  const account = ((await api.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[])[0].id
  const base = { p_currency: 'ARS', p_fx_rate: null, p_account_id: account, p_installments_count: 1, p_occurred_on: firstOfMonth(), p_description: null, p_request_id: null }
  expect((await api.rpc('create_transaction', { ...base, p_type: 'income', p_amount: '100000', p_category_id: null })).status).toBe(200)
  expect((await api.rpc('create_transaction', { ...base, p_type: 'expense', p_amount: '120000', p_category_id: category, p_shared_persons: ['Sofía'], p_shared_amounts: ['60000'] })).status).toBe(200)
  expect((await api.rpc('create_debt', { p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '20000', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: firstOfMonth(), p_notes: null })).status).toBe(200)
}

const saved = (page: Page) =>
  page.waitForResponse((r) => r.url().includes('/rest/v1/user_preferences') && r.request().method() === 'POST' && r.ok())

test('en el celular, la hoja del héroe cambia el número al instante y la elección queda guardada', async ({ page, request }) => {
  await seed(page, request, 'adr053-sheet')
  await page.goto('/dashboard')

  // Predeterminado: solo gastos. Los ingresos, las deudas sueltas y el reembolso están afuera.
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$120.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Solo gastos')

  // La pill abre los interruptores, con lo que cada opción mueve el número y el número en vivo. El desglose
  // está en la misma hoja.
  await openSpentOptions(page)
  await expect(page.getByTestId('dashboard-spent-expenses-amount')).toHaveText('$120.000,00')
  await expect(page.getByTestId('dashboard-spent-expenses')).toHaveAttribute('data-included', 'true')
  await expect(page.getByTestId('dashboard-income')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-total-income')).toHaveText('$100.000,00')
  await expect(page.getByTestId('dashboard-spent-loose-debts')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-spent-reimbursements')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-spent-reimbursements-amount')).toHaveText('$60.000,00')
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('$120.000,00')
  await expect(page.getByTestId('dashboard-spent-option-income-amount')).toHaveText('-$100.000,00 este mes')
  await expect(page.getByTestId('dashboard-spent-option-loose-debts-amount')).toHaveText('+$20.000,00 este mes')
  await expect(page.getByTestId('dashboard-spent-option-reimbursements-amount')).toHaveText('-$60.000,00 este mes')
  await expect(page.getByTestId('dashboard-spent-option-pending-subscriptions-amount')).toHaveText('Nada este mes')

  // Restar los ingresos baja el número sin esperar a la base: 120.000 − 100.000.
  const incomeSaved = saved(page)
  await page.getByTestId('dashboard-spent-option-income').click()
  await expect(page.getByTestId('dashboard-spent-option-income')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('$20.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos')
  await incomeSaved

  // Con el reembolso el número pasa a negativo: entró más de lo que salió.
  const reimbursementsSaved = saved(page)
  await page.getByTestId('dashboard-spent-option-reimbursements').click()
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('-$40.000,00')
  await reimbursementsSaved

  // Las deudas sueltas (Juan me debe $20.000) suman a lo que salió.
  const looseSaved = saved(page)
  await page.getByTestId('dashboard-spent-option-loose-debts').click()
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('-$20.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos + deudas sueltas − reembolsos')
  await looseSaved

  // «Solo gastos» apaga todas de un toque.
  const onlySaved = saved(page)
  await page.getByTestId('dashboard-spent-options-only-expenses').click()
  await expect(page.getByTestId('dashboard-spent-options-only-expenses')).toHaveAttribute('aria-pressed', 'true')
  for (const slug of ['income', 'loose-debts', 'reimbursements', 'pending-subscriptions']) {
    await expect(page.getByTestId(`dashboard-spent-option-${slug}`)).toHaveAttribute('aria-checked', 'false')
  }
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('$120.000,00')
  await onlySaved

  // Se deja solo «restar ingresos», se cierra y el héroe muestra el número neto.
  const finalSaved = saved(page)
  await page.getByTestId('dashboard-spent-option-income').click()
  await finalSaved
  await page.getByTestId('dashboard-spent-options-done').click()
  await expect(page.getByTestId('dashboard-spent-options-panel')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$20.000,00')
  await expect(page.getByTestId('dashboard-spent-formula')).toHaveText('Gastos − ingresos')

  // Guardado: sigue así al recargar y Ajustes muestra lo mismo.
  await page.reload()
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$20.000,00')
  await page.goto('/settings')
  await expect(page.getByTestId('settings-summary-income')).toHaveAttribute('aria-checked', 'true')
  for (const slug of ['loose-debts', 'reimbursements', 'pending-subscriptions']) {
    await expect(page.getByTestId(`settings-summary-${slug}`)).toHaveAttribute('aria-checked', 'false')
  }
})

test('el ícono de la esquina abre la misma hoja', async ({ page, request }) => {
  await seed(page, request, 'adr053-icon')
  await page.goto('/dashboard')
  await page.getByTestId('dashboard-spent-options-button').click()
  await expect(page.getByTestId('dashboard-spent-options-panel')).toBeVisible()
  await expect(page.getByTestId('dashboard-spent-options-preview')).toHaveText('$120.000,00')
})

test.describe('en la compu', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('el popover nace de la pill, Escape lo cierra y el foco vuelve al botón', async ({ page, request }) => {
    await seed(page, request, 'adr053-popover')
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$120.000,00')

    const trigger = page.getByTestId('dashboard-spent-options')
    await trigger.click()
    await expect(page.getByTestId('dashboard-spent-options-panel')).toBeVisible()
    const looseSaved = saved(page)
    await page.getByTestId('dashboard-spent-option-loose-debts').click()
    await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$140.000,00')
    await looseSaved

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('dashboard-spent-options-panel')).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})
