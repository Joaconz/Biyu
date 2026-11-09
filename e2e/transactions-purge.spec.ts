import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-85 (#328), ADR-044 §1-§2: eliminar definitivamente un movimiento, en dos pasos.

type Api = Awaited<ReturnType<typeof apiSession>>
const argentinaYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
function month(offset: number) {
  const [y, m] = argentinaYmd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
const H = month(0)

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return {
    api,
    food: await id('categories', 'Comida y supermercado'),
    cash: await id('accounts', 'Efectivo'),
    visa: await id('accounts', 'Tarjeta de crédito'),
  }
}

async function expense(
  api: Api,
  o: { amount: string; category: string; account: string; installments?: number; shared?: { person: string; amount: string } },
) {
  const res = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: o.amount, p_currency: 'ARS', p_fx_rate: null, p_category_id: o.category, p_account_id: o.account,
    p_installments_count: o.installments ?? 1, p_occurred_on: `${H}-01`, p_description: null,
    p_shared_persons: o.shared ? [o.shared.person] : null, p_shared_amounts: o.shared ? [o.shared.amount] : null, p_request_id: null,
  })
  expect(res.status).toBe(200)
  return res.body as string
}

const count = async (api: Api, table: string, filter: string) => ((await api.select(table, `select=id&${filter}`)).body as unknown[]).length

test('US-85 CA-1 · una fila activa no ofrece «Eliminar definitivamente» y la RPC la rechaza', async ({ page, request }) => {
  const s = await setup(page, request, 'us85-ca1')
  const id = await expense(s.api, { amount: '700.00', category: s.food, account: s.cash })
  await page.goto(`/transactions?period=${H}`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-purge')).toHaveCount(0)
  const res = await s.api.rpc('purge_transaction', { p_transaction_id: id })
  expect(res.status).toBe(400)
  expect(res.body).toMatchObject({ code: '23514', message: 'Un movimiento activo no se puede eliminar definitivamente' })
  expect(await count(s.api, 'transactions', `id=eq.${id}`)).toBe(1)
})

test('US-85 CA-2, CA-3 y CA-5 · en dos pasos: Eliminar y después Eliminar definitivamente, con sus cuotas', async ({ page, request }) => {
  const s = await setup(page, request, 'us85-ca2')
  const id = await expense(s.api, { amount: '30000.00', category: s.food, account: s.visa, installments: 3 })

  await page.goto(`/transactions?period=${H}`)
  await page.getByTestId('transactions-item-edit').click()
  await page.getByTestId('edit-transaction-delete').click()
  await page.getByTestId('delete-transaction-confirm').click()
  await expect(page.getByTestId('transactions-empty')).toBeVisible()

  await page.getByTestId('transactions-filter-deleted').click()
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  const purge = page.getByTestId('transactions-item-purge')
  await expect(purge).toHaveAttribute('aria-label', /^Eliminar definitivamente /)
  const box = await purge.boundingBox()
  expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44)

  // CA-5: cancelar no borra nada.
  await purge.click()
  const dialog = page.getByTestId('purge-transaction-dialog')
  await expect(dialog.getByRole('heading')).toHaveText('¿Eliminar definitivamente?')
  await expect(page.getByTestId('purge-transaction-summary')).toContainText('$30.000,00')
  await expect(page.getByTestId('purge-transaction-summary')).toContainText('3 cuotas')
  await expect(page.getByTestId('purge-transaction-warning')).toHaveText('Se borra para siempre. No se puede restaurar.')
  await expect(page.getByTestId('purge-transaction-consequence')).toHaveText('Se borran también sus 3 cuotas.')
  await page.getByTestId('purge-transaction-cancel').click()
  await expect(dialog).toHaveCount(0)
  expect(await count(s.api, 'transactions', `id=eq.${id}`)).toBe(1)

  await purge.click()
  await page.getByTestId('purge-transaction-confirm').click()
  await expect(page.getByTestId('transactions-purged')).toHaveText(/Movimiento eliminado definitivamente/)
  await expect(page.getByTestId('transactions-empty')).toBeVisible()

  // CA-2 y CA-3: ni la transacción ni sus imputaciones; no se puede restaurar.
  expect(await count(s.api, 'transactions', `id=eq.${id}`)).toBe(0)
  expect(await count(s.api, 'ledger_entries', `transaction_id=eq.${id}`)).toBe(0)
  const restore = await s.api.rpc('restore_transaction', { p_transaction_id: id })
  expect(restore.body).toMatchObject({ code: '23503' })
  await page.reload()
  await expect(page.getByTestId('transactions-empty')).toBeVisible()
})

test('US-85 CA-3 · un gasto compartido se borra con su deuda vinculada', async ({ page, request }) => {
  const s = await setup(page, request, 'us85-deuda')
  const id = await expense(s.api, { amount: '40000.00', category: s.food, account: s.cash, shared: { person: 'Sofía', amount: '15000.00' } })
  expect(await count(s.api, 'debts', `transaction_id=eq.${id}`)).toBe(1)
  await s.api.rpc('delete_transaction', { p_transaction_id: id })

  await page.goto(`/transactions?period=${H}&view=deleted`)
  await page.getByTestId('transactions-item-purge').click()
  await expect(page.getByTestId('purge-transaction-consequence')).toHaveText('Se borra también la deuda con Sofía.')
  await page.getByTestId('purge-transaction-confirm').click()
  await expect(page.getByTestId('transactions-purged')).toBeVisible()
  expect(await count(s.api, 'debts', 'person=eq.Sofía')).toBe(0)
  expect(await count(s.api, 'transactions', `id=eq.${id}`)).toBe(0)
})

test('ADR-044 §2 · el movimiento de una suscripción eliminado no ofrece borrado definitivo y la RPC lo rechaza', async ({ page, request }) => {
  const s = await setup(page, request, 'us85-susc')
  const created = await s.api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: s.food, p_account_id: s.cash,
    p_billing_day: 1, p_start_period: `${month(-1)}-01`, p_end_period: null, p_description: null,
  })
  expect(created.status).toBe(200)
  const occurrences = (await s.api.select('transactions', 'select=id,subscription_period&subscription_id=not.is.null&order=subscription_period')).body as { id: string }[]
  const occ = occurrences[0].id
  await s.api.rpc('delete_transaction', { p_transaction_id: occ })

  await page.goto(`/transactions?period=${month(-1)}&view=deleted`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-restore')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-purge')).toHaveCount(0)

  const res = await s.api.rpc('purge_transaction', { p_transaction_id: occ })
  expect(res.body).toMatchObject({ code: '23514', message: 'Un movimiento de una suscripción no se puede eliminar definitivamente' })
  expect(await count(s.api, 'transactions', `id=eq.${occ}`)).toBe(1)
})

test('US-85 CA-4 · otro usuario y anon no pueden borrar para siempre el movimiento ajeno (C7)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await setup(pageA, request, 'us85-ca4-a')
  const b = await setup(pageB, request, 'us85-ca4-b')
  const id = await expense(a.api, { amount: '500.00', category: a.food, account: a.cash })
  await a.api.rpc('delete_transaction', { p_transaction_id: id })

  const attempt = await b.api.rpc('purge_transaction', { p_transaction_id: id })
  expect(attempt.body).toMatchObject({ code: '23503', message: 'la transacción no existe o no te pertenece' })
  const anon = await b.api.rpc('purge_transaction', { p_transaction_id: id }, { asAnon: true })
  expect(anon.status).toBe(401)
  expect(anon.body).toMatchObject({ code: '42501' })
  expect(await count(a.api, 'transactions', `id=eq.${id}`)).toBe(1)
})
