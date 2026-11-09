import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup, uniqueEmail, TEST_PASSWORD } from './support/app.ts'

// Regresión de V3 · Configuración (CFG), Registro (REG), Resumen (DAS) y Resumen por categoría (CAT)
// (entrega-3/03-seleccion-regresion.md). CP-REG-012 y CP-REG-013 los cubren CP-CUO-009 (regression-cuo.spec.ts) y
// CP-DEU-015 (regression-deu.spec.ts), que recorren el mismo borrado.

type Api = Awaited<ReturnType<typeof apiSession>>
const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const thisMonth = () => ymd().slice(0, 7)
const thisPeriod = () => `${thisMonth()}-01`

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const named = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  const cat = (name: string) => named('categories', name)
  const acc = (name: string) => named('accounts', name)
  return { api, cat, acc }
}
type Setup = Awaited<ReturnType<typeof setup>>

const add = async (s: Setup, o: { category: string | null; account?: string; amount: string; on: string; type?: 'expense' | 'income' }) =>
  s.api.rpc('create_transaction', {
    p_type: o.type ?? 'expense', p_amount: o.amount, p_currency: 'ARS', p_fx_rate: null,
    p_category_id: o.category ? await s.cat(o.category) : null, p_account_id: await s.acc(o.account ?? 'Efectivo'),
    p_installments_count: 1, p_occurred_on: o.on, p_description: null, p_request_id: null,
  })
const count = async (api: Api, table: string) => ((await api.select(table, 'select=id')).body as unknown[]).length

test('CP-CFG-001 · crear una categoría con nombre y color', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-001')
  await page.goto('/settings')
  await page.getByTestId('settings-categories-name').fill('Mascotas')
  await page.getByTestId('settings-categories-color').getByRole('radio').nth(2).click()
  await page.getByTestId('settings-categories-submit').click()
  await expect(page.getByTestId('settings-categories-list')).toContainText('Mascotas')
  const rows = (await s.api.select('categories', 'select=name,color&name=eq.Mascotas')).body as { name: string; color: string }[]
  expect(rows).toHaveLength(1)
  expect(rows[0].color).toMatch(/^#/)
})

test('CP-CFG-004 · archivar una categoría con historia', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-004')
  await add(s, { category: 'Entretenimiento', amount: '8000.00', on: ymd() })
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('100')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-chip-entretenimiento')).toBeVisible()
  const archived = await s.api.patch('categories', `id=eq.${await s.cat('Entretenimiento')}`, { archived_at: new Date().toISOString() })
  expect(archived.body).toHaveLength(1)
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('100')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-chip-entretenimiento')).toHaveCount(0)
  await page.goto(`/transactions?period=${thisMonth()}`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-archived')).toBeVisible()
})

test('CP-CFG-006 · crear una cuenta de tarjeta de crédito', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-006')
  await page.goto('/settings')
  await page.getByTestId('settings-accounts-name').fill('Visa BBVA')
  await expect(page.getByTestId('settings-accounts-type')).toContainText('Tarjeta de crédito') // el tipo inicial
  await page.getByTestId('settings-accounts-submit').click()
  await expect(page.getByTestId('settings-accounts-list')).toContainText('Visa BBVA')
  const rows = (await s.api.select('accounts', 'select=type,currency&name=eq.Visa BBVA')).body as { type: string }[]
  expect(rows).toMatchObject([{ type: 'credit_card' }])
})

test('CP-CFG-008 · la siembra concurrente no duplica el catálogo', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-008')
  const [a, b] = await Promise.all([page.context().newPage(), page.context().newPage()])
  await Promise.all([a.goto('/register'), b.goto('/register')])
  await expect(a.getByTestId('transaction-form')).toBeVisible()
  await expect(b.getByTestId('transaction-form')).toBeVisible()
  expect([await count(s.api, 'categories'), await count(s.api, 'accounts')]).toEqual([8, 5])
})

test('CP-CFG-009 · cargar y actualizar el tipo de cambio de referencia del mes sin duplicar la fila', async ({ page, request }) => {
  const s = await setup(page, request, 'cfg-009')
  await page.goto('/settings')
  await page.getByTestId('settings-fx-rate').fill('1250')
  await page.getByTestId('settings-fx-submit').click()
  await expect(page.getByTestId('settings-fx-list')).toContainText('1.250,00')
  await page.getByTestId('settings-fx-rate').fill('1300')
  await page.getByTestId('settings-fx-submit').click()
  await expect(page.getByTestId('settings-fx-list')).toContainText('1.300,00')
  const rows = (await s.api.select('fx_rates', `select=ars_per_usd_text:ars_per_usd::text&period=eq.${thisPeriod()}`)).body as unknown[]
  expect(rows).toEqual([{ ars_per_usd_text: '1300.0000' }])
})

test('CP-CFG-011 · después de crear la cuenta aparece la configuración inicial', async ({ page }) => {
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(uniqueEmail('cfg-011'))
  await page.getByTestId('signup-form-password').fill(TEST_PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(TEST_PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  await expect(page.getByTestId('setup-reason-skip')).toBeVisible({ timeout: 20_000 })
  await expect(page.getByText('¿Para qué vas a usar Biyu?')).toBeVisible()
})

test('CP-REG-001 · el registro es la pantalla de inicio, en el paso del monto', async ({ page, request }) => {
  await setup(page, request, 'reg-001')
  await page.goto('/')
  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
})

test('CP-REG-010 · monto vacío, cero o negativo no se guarda; 0,01 sí; la API rechaza 0 y -500', async ({ page, request }) => {
  const s = await setup(page, request, 'reg-010')
  await page.goto('/register')
  const next = page.getByTestId('transaction-form-next')
  await expect(next).toBeDisabled()
  for (const bad of ['0', '-500']) {
    await page.getByTestId('transaction-form-amount').fill(bad)
    await expect(next).toBeDisabled()
  }
  expect(await count(s.api, 'transactions')).toBe(0)
  await page.getByTestId('transaction-form-amount').fill('0,01')
  await next.click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  for (const amount of ['0', '-500']) {
    const res = await s.api.rpc('create_transaction', {
      p_type: 'expense', p_amount: amount, p_currency: 'ARS', p_fx_rate: null, p_category_id: await s.cat('Otros'),
      p_account_id: await s.acc('Efectivo'), p_installments_count: 1, p_occurred_on: ymd(), p_description: null, p_request_id: null,
    })
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject({ code: '23514', message: 'I4: el monto debe ser mayor a cero' })
  }
  expect(await count(s.api, 'transactions')).toBe(1)
})

test('CP-REG-014 y 015 · otro usuario no lee ni borra una transacción ajena, y no se escribe salteando la RPC', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'reg-014a')
  const tx = (await add(a, { category: 'Otros', amount: '1000.00', on: ymd() })).body as string
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'reg-014b')
  expect((await b.api.select('transactions', `select=id&id=eq.${tx}`)).body).toEqual([])
  const del = await b.api.rpc('delete_transaction', { p_transaction_id: tx })
  expect(del.status).toBeGreaterThanOrEqual(400)
  expect((await a.api.select('transactions', `select=deleted_at&id=eq.${tx}`)).body).toEqual([{ deleted_at: null }])
  const direct = await a.api.patch('transactions', `id=eq.${tx}`, { amount: 1 })
  expect(direct.body).toMatchObject({ code: '42501' })
})

test('CP-DAS-001 y 002 · el Resumen abre en el mes actual y el mes elegido vive en la URL', async ({ page, request }) => {
  const s = await setup(page, request, 'das-001')
  await add(s, { category: 'Otros', amount: '5000.00', on: ymd() })
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('5.000,00')
  await page.goto('/dashboard?period=2026-09')
  await expect(page).toHaveURL(/period=2026-09/)
  await page.getByRole('button', { name: /Mes siguiente/ }).click()
  await page.getByRole('button', { name: /Mes siguiente/ }).click()
  await expect(page).toHaveURL(/period=2026-11/)
  await page.reload()
  await expect(page).toHaveURL(/period=2026-11/)
})

test('CP-DAS-011 · el Resumen de un usuario nunca muestra datos de otro', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'das-011a')
  await add(a, { category: 'Otros', amount: '1000.00', on: ymd() })
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'das-011b')
  expect((await b.api.select('ledger_entries', `select=id&user_id=eq.${a.api.userId}&period=eq.${thisPeriod()}`)).body).toEqual([])
  const all = (await b.api.select('ledger_entries', 'select=user_id')).body as { user_id: string }[]
  expect(all.every((r) => r.user_id === b.api.userId)).toBe(true)
})

async function septemberData(s: Setup) {
  await add(s, { category: 'Comida y supermercado', amount: '60000.00', on: '2026-09-05' })
  await add(s, { category: 'Transporte', amount: '30000.00', on: '2026-09-10' })
  await add(s, { category: 'Servicios', amount: '10000.00', on: '2026-09-02' })
}

test('CP-CAT-001 y 002 · la torta tiene una porción por categoría con monto y porcentaje, sin ingresos ni eliminados', async ({ page, request }) => {
  const s = await setup(page, request, 'cat-001')
  await septemberData(s)
  const deleted = (await add(s, { category: 'Comida y supermercado', amount: '9999.00', on: '2026-09-15' })).body as string
  await s.api.rpc('delete_transaction', { p_transaction_id: deleted })
  await add(s, { category: null, amount: '500000.00', on: '2026-09-01', type: 'income' })
  await page.goto('/dashboard?period=2026-09')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('100.000,00')
  const list = page.getByTestId('dashboard-categories-list')
  const text = (await list.innerText()).replace(/\s+/g, ' ')
  expect(text.indexOf('Comida y supermercado')).toBeLessThan(text.indexOf('Transporte'))
  expect(text.indexOf('Transporte')).toBeLessThan(text.indexOf('Servicios'))
  for (const part of ['60.000,00', '60,0 %', '30.000,00', '30,0 %', '10.000,00', '10,0 %']) expect(text).toContain(part)
  expect(text).not.toContain('9.999')
  await expect(page.getByTestId('dashboard-category-chart')).toBeVisible()
})

test('CP-CAT-004 · tocar una categoría del Resumen abre su detalle del mes', async ({ page, request }) => {
  const s = await setup(page, request, 'cat-004')
  await add(s, { category: 'Comida y supermercado', amount: '25000.00', on: '2026-09-14' })
  await add(s, { category: 'Comida y supermercado', account: 'Tarjeta de débito', amount: '15000.00', on: '2026-09-28' })
  await add(s, { category: 'Comida y supermercado', amount: '20000.00', on: '2026-08-10' })
  await add(s, { category: 'Transporte', amount: '10000.00', on: '2026-09-10' })
  await page.goto('/dashboard?period=2026-09')
  await page.getByTestId('dashboard-categories-list').getByText('Comida y supermercado').first().click()
  await expect(page).toHaveURL(/period=2026-09/)
  await expect(page.getByTestId('category-detail-evolution')).toBeVisible() // ya cargó el detalle, no el Resumen
  const body = (await page.locator('main').innerText()).replace(/\s+/g, ' ')
  expect(body).toContain('Comida y supermercado')
  expect(body).toContain('40.000,00')
  expect(body).toContain('80,0 %')
  expect(body).toContain('Cuotas de meses anteriores')
  expect(body.indexOf('15.000,00')).toBeLessThan(body.indexOf('25.000,00')) // la más nueva primero
})
