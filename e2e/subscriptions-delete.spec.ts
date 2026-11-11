import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-88 (#330), ADR-044 §4: eliminar definitivamente una suscripción. La RPC y su par de autorización
// están en supabase/tests/database/delete_subscription.test.sql.

function currentPeriodStart() {
  const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
  return `${ymd.slice(0, 7)}-01`
}

async function userWithSubscription(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const category = await api.select('categories', 'select=id&name=eq.Entretenimiento')
  const account = await api.select('accounts', 'select=id&name=eq.Efectivo')
  const created = await api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS',
    p_category_id: (category.body as { id: string }[])[0].id, p_account_id: (account.body as { id: string }[])[0].id,
    p_billing_day: 1, p_start_period: currentPeriodStart(), p_end_period: null, p_description: null,
  })
  expect(created.status).toBe(200)
  return { api, subId: (created.body as { subscription_id: string }).subscription_id }
}

test('US-88: eliminar una suscripción activa deja sus gastos como movimientos sueltos; volver no borra', async ({ page, request }) => {
  const { api, subId } = await userWithSubscription(page, request, 'us-88')
  await page.goto(`/subscriptions/${subId}`)

  // Volver no borra nada (CA-4).
  await page.getByTestId('subscription-detail-delete').click()
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('Netflix')
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('Gastos generados')
  await expect(page.getByTestId('delete-subscription-dialog')).toContainText('Deja de generar gastos.')
  await expect(page.getByTestId('delete-subscription-dialog')).toContainText('queda como un movimiento suelto')
  await page.getByTestId('delete-subscription-dialog-cancel').click()
  await expect(page.getByTestId('delete-subscription-dialog')).toHaveCount(0)
  expect((await api.select('subscriptions', `select=id&id=eq.${subId}`)).body).toHaveLength(1)

  // Confirmar vuelve al listado, sin la suscripción (CA-1), con el gasto suelto.
  await page.getByTestId('subscription-detail-delete').click()
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
  expect((await api.select('subscriptions', `select=id&id=eq.${subId}`)).body).toHaveLength(0)
  const loose = await api.select('transactions', 'select=subscription_id,subscription_period,deleted_at&deleted_at=is.null')
  expect(loose.body).toEqual([{ subscription_id: null, subscription_period: null, deleted_at: null }])
})

test('US-88: una cancelada solo ofrece «Eliminar definitivamente» y se puede borrar', async ({ page, request }) => {
  const { api, subId } = await userWithSubscription(page, request, 'us-88-cancelada')
  expect((await api.rpc('cancel_subscription', { p_subscription_id: subId })).status).toBe(200)
  await page.goto(`/subscriptions/${subId}`)
  await expect(page.getByTestId('subscription-detail-cancel')).toHaveCount(0)
  await expect(page.getByTestId('subscription-detail-edit')).toHaveCount(0)
  await page.getByTestId('subscription-detail-delete').click()
  await expect(page.getByTestId('delete-subscription-dialog')).not.toContainText('Deja de generar gastos.')
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
})

test('US-88: la suscripción de otro usuario responde 404 y no se borra', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await userWithSubscription(pageA, request, 'us-88-a')
  const b = await userWithSubscription(pageB, request, 'us-88-b')
  const res = await a.api.rpc('delete_subscription', { p_subscription_id: b.subId })
  expect(res.status).toBe(404)
  expect(res.body).toMatchObject({ code: 'PT404', message: 'Suscripción no encontrada' })
  expect((await b.api.select('subscriptions', `select=id&id=eq.${b.subId}`)).body).toHaveLength(1)
  const anon = await a.api.rpc('delete_subscription', { p_subscription_id: b.subId }, { asAnon: true })
  expect(anon.status).toBe(401)
})

test('CP-SUS-052 · una pausada se borra y el diálogo avisa que deja de generar', async ({ page, request }) => {
  const { api, subId } = await userWithSubscription(page, request, 'cp-sus-052')
  expect((await api.rpc('pause_subscription', { p_subscription_id: subId })).status).toBe(200)
  await page.goto(`/subscriptions/${subId}`)
  await page.getByTestId('subscription-detail-delete').click()
  await expect(page.getByTestId('delete-subscription-dialog')).toContainText('Deja de generar gastos.')
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
  expect((await api.select('subscriptions', `select=id&id=eq.${subId}`)).body).toHaveLength(0)
})
