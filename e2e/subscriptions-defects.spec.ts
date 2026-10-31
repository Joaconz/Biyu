import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, fixToday, signUpAndSkipSetup } from './support/app.ts'

// Suscripciones: DEF-034 (#348), DEF-035 (#349) y DEF-036 (#350).

// Primer día del mes corriente en Argentina, el del servidor (ADR-021).
function currentPeriodStart() {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
  return `${ymd.slice(0, 7)}-01`
}

async function userWithIds(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const category = await api.select('categories', 'select=id&name=eq.Entretenimiento')
  const account = await api.select('accounts', 'select=id&name=eq.Efectivo')
  return {
    api,
    categoryId: (category.body as { id: string }[])[0].id,
    accountId: (account.body as { id: string }[])[0].id,
  }
}

const netflix = (categoryId: string, accountId: string) => ({
  p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: categoryId, p_account_id: accountId,
  p_billing_day: 10, p_start_period: currentPeriodStart(), p_end_period: null, p_description: null,
})

test('CP-SUS-032 · pausar la suscripción de otro usuario responde 404 «Suscripción no encontrada» (DEF-034)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await userWithIds(pageA, request, 'cp-sus-032-a')
  const b = await userWithIds(pageB, request, 'cp-sus-032-b')
  const created = await b.api.rpc('create_subscription', netflix(b.categoryId, b.accountId))
  expect(created.status).toBe(200)
  const subId = (created.body as { subscription_id: string }).subscription_id

  for (const fn of ['pause_subscription', 'cancel_subscription']) {
    const res = await a.api.rpc(fn, { p_subscription_id: subId })
    expect(res.status, fn).toBe(404)
    expect(res.body, fn).toMatchObject({ code: 'PT404', message: 'Suscripción no encontrada' })
  }
  // La de B no cambió.
  const after = await b.api.select('subscriptions', `select=status&id=eq.${subId}`)
  expect(after.body).toEqual([{ status: 'active' }])
})

test('CP-SUS-022 · sin sesión, create_subscription responde 401 con 42501 (DEF-035)', async ({ page, request }) => {
  const { api, categoryId, accountId } = await userWithIds(page, request, 'cp-sus-022')
  const res = await api.rpc('create_subscription', netflix(categoryId, accountId), { asAnon: true })
  expect(res.status).toBe(401)
  expect(res.body).toMatchObject({ code: '42501' })
})

test('CP-SUS-048 · la vista previa marca data-blocked en cada mes vencido según tenga tipo de cambio (DEF-036)', async ({ page, request }) => {
  const { api } = await userWithIds(page, request, 'cp-sus-048')
  // Hoy = 09/10/2026: vencen agosto (con TC) y septiembre (sin TC) con día de cobro 28.
  expect((await api.rpc('upsert_fx_rate', { p_period: '2026-08-01', p_ars_per_usd: '1200.00' })).status).toBe(200)
  await fixToday(page, '2026-10-09')

  await page.goto('/subscriptions/new')
  await page.getByTestId('subscription-form-currency-usd').click()
  await page.getByTestId('subscription-form-amount').fill('20')
  await page.getByTestId('subscription-form-billing-day').fill('28')
  await page.getByTestId('subscription-form-start-period').fill('2026-08')

  const due = page.getByTestId('subscription-form-preview-due-item')
  await expect(due.and(page.locator('[data-period="2026-08"]'))).toHaveAttribute('data-blocked', 'false')
  await expect(due.and(page.locator('[data-period="2026-09"]'))).toHaveAttribute('data-blocked', 'true')
  await expect(page.getByTestId('subscription-form-preview-summary')).toContainText('1 gasto')
})
