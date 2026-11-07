import { expect, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-101 (#371), ADR-051: qué entra en el balance se elige desde la misma tarjeta de Balance del Resumen.
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

test('en el celular, la hoja de la tarjeta cambia el balance al instante y la elección queda guardada', async ({ page, request }) => {
  await seed(page, request, 'adr051-sheet')
  await page.goto('/dashboard')

  // Predeterminados: deudas sueltas adentro, el reembolso afuera con lo que sumaría. 100.000 − 120.000 − 20.000.
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$40.000,00')
  await expect(page.getByTestId('dashboard-total-income')).toHaveText('$100.000,00')
  await expect(page.getByTestId('dashboard-balance-expenses-amount')).toHaveText('$120.000,00')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveAttribute('data-included', 'true')
  await expect(page.getByTestId('dashboard-balance-reimbursements')).toHaveAttribute('data-included', 'false')
  await expect(page.getByTestId('dashboard-balance-reimbursements-amount')).toHaveText('$60.000,00')

  // La fórmula abre los interruptores, con el monto de cada opción y el balance en vivo.
  await page.getByTestId('dashboard-balance-options').click()
  await expect(page.getByTestId('dashboard-balance-options-panel')).toBeVisible()
  await expect(page.getByTestId('dashboard-balance-options-preview')).toHaveText('-$40.000,00')
  await expect(page.getByTestId('dashboard-balance-option-reimbursements-amount')).toHaveText('+$60.000,00 este mes')
  await expect(page.getByTestId('dashboard-balance-option-pending-subscriptions-amount')).toHaveText('Nada este mes')

  // Incluir el reembolso suma los $60.000 sin esperar a la base.
  const reimbursementsSaved = saved(page)
  await page.getByTestId('dashboard-balance-option-reimbursements').click()
  await expect(page.getByTestId('dashboard-balance-option-reimbursements')).toHaveAttribute('aria-checked', 'true')
  await expect(page.getByTestId('dashboard-balance-options-preview')).toHaveText('$20.000,00')
  await expect(page.getByTestId('dashboard-balance-formula')).toHaveText('Ingresos − gastos + deudas sueltas + reembolsos')
  await reimbursementsSaved

  // «Solo movimientos» apaga las tres de un toque: ingresos − gastos.
  const onlySaved = saved(page)
  await page.getByTestId('dashboard-balance-options-only-movements').click()
  await expect(page.getByTestId('dashboard-balance-options-only-movements')).toHaveAttribute('aria-pressed', 'true')
  for (const slug of ['loose-debts', 'reimbursements', 'pending-subscriptions']) {
    await expect(page.getByTestId(`dashboard-balance-option-${slug}`)).toHaveAttribute('aria-checked', 'false')
  }
  await expect(page.getByTestId('dashboard-balance-options-preview')).toHaveText('-$20.000,00')
  await onlySaved
  await page.getByTestId('dashboard-balance-options-done').click()
  await expect(page.getByTestId('dashboard-balance-options-panel')).toHaveCount(0)
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$20.000,00')
  await expect(page.getByTestId('dashboard-balance-formula')).toHaveText('Solo movimientos: ingresos − gastos')
  await expect(page.getByTestId('dashboard-balance-loose-debts')).toHaveAttribute('data-included', 'false')
  // Gastado no cambia con las opciones (ADR-047 §2).
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$120.000,00')

  // Guardado: sigue así al recargar y Ajustes muestra lo mismo.
  await page.reload()
  await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$20.000,00')
  await page.goto('/settings')
  for (const slug of ['loose-debts', 'reimbursements', 'pending-subscriptions']) {
    await expect(page.getByTestId(`settings-summary-${slug}`)).toHaveAttribute('aria-checked', 'false')
  }
})

test.describe('en la compu', () => {
  test.use({ viewport: { width: 1280, height: 900 } })

  test('el popover nace de la fórmula, Escape lo cierra y el foco vuelve al botón', async ({ page, request }) => {
    await seed(page, request, 'adr051-popover')
    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$40.000,00')

    const trigger = page.getByTestId('dashboard-balance-options')
    await trigger.click()
    await expect(page.getByTestId('dashboard-balance-options-panel')).toBeVisible()
    const looseSaved = saved(page)
    await page.getByTestId('dashboard-balance-option-loose-debts').click()
    await expect(page.getByTestId('dashboard-total-balance')).toHaveText('-$20.000,00')
    await looseSaved

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('dashboard-balance-options-panel')).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})
