import { expect, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-90 (#332): reactivar una cuenta archivada, como las categorías (DEF-026).

async function registerChips(page: import('@playwright/test').Page) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('500')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
}

test('US-90 CA-1 · una cuenta archivada se ve en «Archivadas», se reactiva y vuelve a Registrar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us90-ca1')
  await page.goto('/settings')
  await page.getByTestId('settings-accounts-archive-efectivo').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toHaveCount(0)
  await expect(page.getByTestId('settings-accounts-archived-list')).toContainText('Efectivo')

  await registerChips(page)
  await expect(page.getByTestId('transaction-form-account-chip-efectivo')).toHaveCount(0)

  await page.goto('/settings')
  await page.getByTestId('settings-accounts-unarchive-efectivo').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toBeVisible()
  await expect(page.getByTestId('settings-accounts-archived-list')).toHaveCount(0)

  await registerChips(page)
  await expect(page.getByTestId('transaction-form-account-chip-efectivo')).toBeVisible()
})

test('US-90 CA-2 · si ya hay una cuenta activa con ese nombre no se reactiva y lo avisa', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us90-ca2')
  await page.goto('/settings')
  await page.getByTestId('settings-accounts-archive-efectivo').click()
  await expect(page.getByTestId('settings-accounts-archived-list')).toBeVisible()

  await page.getByTestId('settings-accounts-name').fill('efectivo')
  await page.getByTestId('settings-accounts-submit').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toBeVisible() // la nueva, activa

  await page.getByTestId('settings-accounts-unarchive-efectivo').click()
  await expect(page.getByTestId('settings-accounts-error')).toHaveText('Ya hay una cuenta activa llamada «Efectivo»')
  await expect(page.getByTestId('settings-accounts-archived-list')).toContainText('Efectivo')
})

test('US-90 CA-3 · los movimientos viejos de la cuenta no cambian al archivarla y reactivarla', async ({ page, request }) => {
  const { email } = await signUpAndSkipSetup(page, 'us90-ca3')
  const api = await apiSession(request, email)
  const category = (await api.select('categories', 'select=id&name=eq.Otros')).body as { id: string }[]
  const account = (await api.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[]
  const created = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '1200.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: category[0].id,
    p_account_id: account[0].id, p_installments_count: 1, p_occurred_on: '2026-09-15', p_description: null, p_request_id: null,
  })
  expect(created.status).toBe(200)

  await page.goto('/settings')
  await page.getByTestId('settings-accounts-archive-efectivo').click()
  await page.getByTestId('settings-accounts-unarchive-efectivo').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toBeVisible()

  const rows = await api.select('transactions', `select=id,account_id,amount_text:amount::text&id=eq.${created.body}`)
  expect(rows.body).toEqual([{ id: created.body, account_id: account[0].id, amount_text: '1200.00' }])
})

test('US-90 CA-4 · por la API, un usuario no puede reactivar la cuenta archivada de otro (C7)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await signUpAndSkipSetup(pageA, 'us90-ca4-a')
  const b = await signUpAndSkipSetup(pageB, 'us90-ca4-b')
  const apiA = await apiSession(request, a.email)
  const apiB = await apiSession(request, b.email)
  const accountA = (await apiA.select('accounts', 'select=id&name=eq.Efectivo')).body as { id: string }[]
  expect((await apiA.patch('accounts', `id=eq.${accountA[0].id}`, { archived_at: '2026-10-01T00:00:00Z' })).status).toBe(200)

  const attempt = await apiB.patch('accounts', `id=eq.${accountA[0].id}`, { archived_at: null })
  expect(attempt.body).toEqual([]) // RLS: B no ve ni cambia filas de A
  const still = await apiA.select('accounts', `select=archived_at&id=eq.${accountA[0].id}`)
  expect((still.body as { archived_at: string | null }[])[0].archived_at).not.toBeNull()

  const anon = await apiB.patch('accounts', `id=eq.${accountA[0].id}`, { archived_at: null }, { asAnon: true })
  expect([401, 403]).toContain(anon.status)
})
