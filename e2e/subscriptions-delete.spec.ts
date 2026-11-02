import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-88 (#330), ADR-044 §4: eliminar una suscripción, en cualquier estado.

type Api = Awaited<ReturnType<typeof apiSession>>
const argentinaYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
function month(offset: number) {
  const [y, m] = argentinaYmd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, category: await id('categories', 'Entretenimiento'), account: await id('accounts', 'Efectivo') }
}

// Netflix desde hace 3 meses con día de cobro 1: genera 3 gastos cerrados (H−3, H−2, H−1) y el de H si ya pasó el día 1.
async function netflix(api: Api, s: { category: string; account: string }, name = 'Netflix') {
  const res = await api.rpc('create_subscription', {
    p_name: name, p_amount: '5000.00', p_currency: 'ARS', p_category_id: s.category, p_account_id: s.account,
    p_billing_day: 1, p_start_period: `${month(-3)}-01`, p_end_period: null, p_description: null,
  })
  expect(res.status).toBe(200)
  return res.body as { subscription_id: string; generated: number }
}

const occurrences = async (api: Api, subscriptionId?: string) =>
  (await api.select('transactions', `select=id,subscription_id,subscription_period,deleted_at,amount_text:amount::text&order=occurred_on${subscriptionId ? `&subscription_id=eq.${subscriptionId}` : ''}`)).body as {
    id: string; subscription_id: string | null; subscription_period: string | null; deleted_at: string | null; amount_text: string
  }[]

test('US-88 CA-1 a CA-3 · eliminar una suscripción activa: la confirmación dice qué pasa y los gastos quedan como movimientos sueltos', async ({ page, request }) => {
  const s = await setup(page, request, 'us88-ca1')
  const { subscription_id: id, generated } = await netflix(s.api, s)
  expect(generated).toBeGreaterThanOrEqual(3)
  const before = await occurrences(s.api, id)
  expect(before).toHaveLength(generated)
  const totalBefore = before.reduce((sum, t) => sum + Number(t.amount_text), 0)

  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-delete').click()
  const dialog = page.getByTestId('delete-subscription-dialog')
  await expect(dialog.getByRole('heading')).toHaveText('¿Eliminar Netflix?')
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('$5.000,00')
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('Activa')
  await expect(page.getByTestId('delete-subscription-dialog-kept')).toContainText(`Los ${generated} gastos que ya cargó quedan como movimientos sueltos`)
  await expect(dialog).toContainText('Deja de cargar gastos. Esto no se puede deshacer.')

  // Volver no elimina.
  await page.getByTestId('delete-subscription-dialog-cancel').click()
  await expect(dialog).toHaveCount(0)
  expect((await s.api.select('subscriptions', `select=id&id=eq.${id}`)).body).toHaveLength(1)

  await page.getByTestId('subscription-detail-delete').click()
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page.getByTestId('subscription-toast')).toHaveText(/Suscripción Netflix eliminada/)
  await expect(page).toHaveURL(/\/subscriptions$/)
  await expect(page.getByTestId('subscriptions-empty')).toBeVisible()

  // CA-1 y CA-2: la suscripción no existe y no se vuelve a generar nada.
  expect((await s.api.select('subscriptions', `select=id&id=eq.${id}`)).body).toHaveLength(0)
  await page.reload()
  await expect(page.getByTestId('subscriptions-empty')).toBeVisible()
  // CA-3: los gastos siguen, sueltos, con los mismos montos.
  const after = await occurrences(s.api)
  expect(after).toHaveLength(generated)
  expect(after.every((t) => t.subscription_id === null && t.subscription_period === null)).toBe(true)
  expect(after.reduce((sum, t) => sum + Number(t.amount_text), 0)).toBe(totalBefore)
  await page.goto(`/transactions?period=${month(-1)}`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-subscription')).toHaveCount(0) // ya no es de una suscripción
  await expect(page.getByTestId('transactions-item-delete')).toBeVisible() // y se trata como cualquier movimiento
})

test('US-88 CA-4 · una cancelada y una pausada también se eliminan; el nombre queda libre', async ({ page, request }) => {
  const s = await setup(page, request, 'us88-ca4')
  const a = await netflix(s.api, s, 'Cancelada')
  const b = await netflix(s.api, s, 'Pausada')
  expect((await s.api.rpc('cancel_subscription', { p_subscription_id: a.subscription_id })).status).toBe(200)
  expect((await s.api.rpc('pause_subscription', { p_subscription_id: b.subscription_id })).status).toBe(200)

  // La cancelada solo ofrece «Eliminar».
  await page.goto(`/subscriptions/${a.subscription_id}`)
  await expect(page.getByTestId('subscription-detail-actions')).toBeVisible()
  await expect(page.getByTestId('subscription-detail-cancel')).toHaveCount(0)
  await expect(page.getByTestId('subscription-detail-edit')).toHaveCount(0)
  await expect(page.getByTestId('subscription-detail-delete')).toBeVisible()
  await page.getByTestId('subscription-detail-delete').click()
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('Cancelada el')
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)

  await page.goto(`/subscriptions/${b.subscription_id}`)
  await expect(page.getByTestId('subscription-detail-resume')).toBeVisible()
  await page.getByTestId('subscription-detail-delete').click()
  await expect(page.getByTestId('delete-subscription-dialog-summary')).toContainText('Pausada desde')
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
  expect((await s.api.select('subscriptions', 'select=id')).body).toHaveLength(0)

  // El nombre queda libre.
  const again = await s.api.rpc('create_subscription', {
    p_name: 'Cancelada', p_amount: '100.00', p_currency: 'ARS', p_category_id: s.category, p_account_id: s.account,
    p_billing_day: 1, p_start_period: `${month(0)}-01`, p_end_period: null, p_description: null,
  })
  expect(again.status).toBe(200)
})

test('US-88 · si falla eliminar, el diálogo queda abierto con el motivo y reintentar elimina', async ({ page, request }) => {
  const s = await setup(page, request, 'us88-error')
  const { subscription_id: id } = await netflix(s.api, s)
  let calls = 0
  await page.route('**/rest/v1/rpc/delete_subscription', (route) => (calls++ === 0 ? route.abort() : route.continue()))
  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-delete').click()
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page.getByTestId('delete-subscription-dialog-error')).toContainText('No se pudo eliminar')
  await expect(page.getByTestId('delete-subscription-dialog-confirm')).toBeEnabled()
  await page.getByTestId('delete-subscription-dialog-confirm').click()
  await expect(page).toHaveURL(/\/subscriptions$/)
  expect((await s.api.select('subscriptions', `select=id&id=eq.${id}`)).body).toHaveLength(0)
})

test('US-88 CA-5 · por la API, una inexistente o ajena responde 404 «no encontrada» y anon, 401 (C7)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await setup(pageA, request, 'us88-ca5-a')
  const b = await setup(pageB, request, 'us88-ca5-b')
  const { subscription_id: id } = await netflix(a.api, a)

  const other = await b.api.rpc('delete_subscription', { p_subscription_id: id })
  expect(other.status).toBe(404)
  expect(other.body).toMatchObject({ code: 'PT404', message: 'Suscripción no encontrada' })
  const missing = await b.api.rpc('delete_subscription', { p_subscription_id: '00000000-0000-0000-0000-000000000000' })
  expect(missing.status).toBe(404)
  const anon = await b.api.rpc('delete_subscription', { p_subscription_id: id }, { asAnon: true })
  expect(anon.status).toBe(401)
  expect(anon.body).toMatchObject({ code: '42501' })
  expect((await b.api.patch('subscriptions', `id=eq.${id}`, { name: 'x' })).status).toBe(403) // sin update directo
  expect((await a.api.select('subscriptions', `select=id&id=eq.${id}`)).body).toHaveLength(1)

  await pageB.goto(`/subscriptions/${id}`)
  await expect(pageB.getByTestId('subscription-detail-not-found')).toBeVisible()
})

test('US-88 · el gasto de una suscripción ya eliminada deja de ser el de una suscripción: se puede eliminar definitivamente', async ({ page, request }) => {
  const s = await setup(page, request, 'us88-suelto')
  const { subscription_id: id } = await netflix(s.api, s)
  const [first] = await occurrences(s.api, id)
  expect((await s.api.rpc('delete_transaction', { p_transaction_id: first.id })).status).toBe(204)
  expect((await s.api.rpc('delete_subscription', { p_subscription_id: id })).status).toBe(204)
  const after = (await occurrences(s.api)).find((t) => t.id === first.id)!
  expect(after.subscription_id).toBeNull()
  expect(after.deleted_at).not.toBeNull()
  // Sigue dado de baja y se puede restaurar como cualquier movimiento.
  expect((await s.api.rpc('restore_transaction', { p_transaction_id: first.id })).status).toBe(204)
})
