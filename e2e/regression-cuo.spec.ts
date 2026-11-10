import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Regresión de V3 · Cuotas (CUO). CP-CUO-001 a 006, 009, 011, 012 y 013 del catálogo de V1
// (entrega-3/03-seleccion-regresion.md). Cada caso se corre por la pantalla o por la API según su variante.

const argentinaYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
function period(offset: number) {
  const [y, m] = argentinaYmd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { email, api, other: await id('categories', 'Otros'), cash: await id('accounts', 'Efectivo'), visa: await id('accounts', 'Tarjeta de crédito') }
}
type Setup = Awaited<ReturnType<typeof setup>>

const buy = (s: Setup, o: { type?: 'expense' | 'income'; amount: string; installments?: number; account?: string; on?: string }) =>
  s.api.rpc('create_transaction', {
    p_type: o.type ?? 'expense', p_amount: o.amount, p_currency: 'ARS', p_fx_rate: null, p_category_id: s.other,
    p_account_id: o.account ?? s.visa, p_installments_count: o.installments ?? 1, p_occurred_on: o.on ?? period(0), p_description: null, p_request_id: null,
  })

const entries = async (s: Setup, tx: string) =>
  (await s.api.select('ledger_entries', `select=period,installment_number,amount_text:amount::text&transaction_id=eq.${tx}&order=installment_number`)).body as {
    period: string
    installment_number: number
    amount_text: string
  }[]

async function toDetails(page: Page, amount: string) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
}

test('CP-CUO-001 · una compra en 12 cuotas genera 12 imputaciones consecutivas', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-001')
  await toDetails(page, '120000')
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await page.getByTestId('transaction-form-installments-chip-12').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  const tx = ((await s.api.select('transactions', 'select=id,installments_count')).body as { id: string; installments_count: number }[])[0]
  expect(tx.installments_count).toBe(12)
  const rows = await entries(s, tx.id)
  expect(rows).toHaveLength(12)
  expect(rows.map((r) => r.installment_number)).toEqual(Array.from({ length: 12 }, (_, i) => i + 1))
  expect(rows.map((r) => r.period)).toEqual(Array.from({ length: 12 }, (_, i) => period(i)))
})

test('CP-CUO-002 · la previsualización muestra el impacto mensual antes de guardar', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-002')
  await toDetails(page, '120000')
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await expect(page.getByTestId('transaction-form-installments-preview')).toHaveCount(0)
  await page.getByTestId('transaction-form-installments-chip-12').click()
  await expect(page.getByTestId('transaction-form-installments-preview')).toBeVisible()
  await expect(page.getByTestId('transaction-form-installments-preview-summary')).toContainText('12 cuotas de $10.000,00')
  expect((await s.api.select('transactions', 'select=id')).body).toEqual([]) // todavía no se guardó nada
})

test('CP-CUO-003 · cambiar a una cuenta que no es crédito resetea las cuotas; la API rechaza la combinación', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-003')
  await toDetails(page, '60000')
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await page.getByTestId('transaction-form-installments-chip-6').click()
  await expect(page.getByTestId('transaction-form-installments-chip-6')).toHaveAttribute('aria-pressed', 'true')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await expect(page.getByTestId('transaction-form-installments-chip-6')).toHaveCount(0)
  await expect(page.getByTestId('transaction-form-installments-reset')).toBeVisible()
  const api = await buy(s, { amount: '60000.00', installments: 6, account: s.cash })
  expect(api.status).toBe(400)
  expect(api.body).toMatchObject({ code: '23514', message: 'I6: las cuotas solo aplican a gastos con cuenta credit_card' })
})

test('CP-CUO-004 · 12 cuotas iguales: cada una de $10.000,00 y la suma es el total', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-004')
  const res = await buy(s, { amount: '120000.00', installments: 12 })
  expect(res.status).toBe(200)
  const rows = await entries(s, res.body as string)
  expect(rows).toHaveLength(12)
  expect(new Set(rows.map((r) => r.amount_text))).toEqual(new Set(['10000.00']))
})

test('CP-CUO-005 · el resto lo absorbe la última cuota', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-005')
  const res = await buy(s, { amount: '100000.00', installments: 3 })
  expect(res.status).toBe(200)
  expect((await entries(s, res.body as string)).map((r) => r.amount_text)).toEqual(['33333.33', '33333.33', '33333.34'])
})

test('CP-CUO-006 · cantidad de cuotas: 0, 1, 2, 12 y 13', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-006')
  for (const n of [0, 13]) {
    const res = await buy(s, { amount: '1200.00', installments: n })
    expect(res.status, `${n} cuotas`).toBe(400)
    expect(res.body).toMatchObject({ code: '23514' })
  }
  for (const n of [1, 2, 12]) {
    const res = await buy(s, { amount: '1200.00', installments: n })
    expect(res.status, `${n} cuotas`).toBe(200)
    expect(await entries(s, res.body as string)).toHaveLength(n)
  }
  await toDetails(page, '1200')
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await expect(page.getByTestId('transaction-form-installments-chip-12')).toBeVisible()
  await expect(page.getByTestId('transaction-form-installments-chip-13')).toHaveCount(0)
})

test('CP-CUO-009 · borrar una compra en cuotas saca todas sus cuotas de Movimientos', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-009')
  const res = await buy(s, { amount: '120000.00', installments: 12 })
  expect(res.status).toBe(200)
  const id = res.body as string
  await page.goto(`/transactions?period=${period(0).slice(0, 7)}`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-edit')).toHaveCount(1) // una sola fila: se edita (y se borra) la compra entera
  await s.api.rpc('delete_transaction', { p_transaction_id: id })
  await page.reload()
  await expect(page.getByTestId('transactions-item')).toHaveCount(0)
  for (const offset of [1, 5, 11]) {
    await page.goto(`/transactions?period=${period(offset).slice(0, 7)}`)
    await expect(page.getByTestId('transactions-item')).toHaveCount(0)
  }
})

test('CP-CUO-011 · otro usuario no ve las cuotas de una compra ajena', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'cuo-011a')
  const res = await buy(a, { amount: '30000.00', installments: 3 })
  const tx = res.body as string
  expect(await entries(a, tx)).toHaveLength(3)
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'cuo-011b')
  expect((await b.api.select('ledger_entries', `select=id&transaction_id=eq.${tx}`)).body).toEqual([])
})

test('CP-CUO-012 · un ingreso no admite cuotas aunque la cuenta sea crédito', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-012')
  const res = await buy(s, { type: 'income', amount: '50000.00', installments: 3 })
  expect(res.status).toBe(400)
  expect(res.body).toMatchObject({ code: '23514' })
  await page.goto('/register')
  await page.getByTestId('transaction-form-type-income').click()
  await page.getByTestId('transaction-form-amount').fill('50000')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await expect(page.getByTestId('transaction-form-installments-chip-3')).toHaveCount(0)
})

test('CP-CUO-013 · un fallo a mitad de create_transaction no deja datos parciales', async ({ page, request }) => {
  const s = await setup(page, request, 'cuo-013')
  const count = async (table: string) => ((await s.api.select(table, 'select=id')).body as unknown[]).length
  const before = [await count('transactions'), await count('ledger_entries')]
  const res = await buy(s, { amount: '0.02', installments: 3 })
  expect(res.status).toBe(400)
  expect([await count('transactions'), await count('ledger_entries')]).toEqual(before) // C4: todo se revierte
})
