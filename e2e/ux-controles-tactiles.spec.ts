import { expect, test, type APIRequestContext, type Locator, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-96 (#357, CP-NAV-038 a 041): todo control tocable mide al menos 44 px de alto a 390 px (el proyecto
// local ya corre a ese ancho) y hay al menos 8 px entre controles vecinos. Se mide con `boundingBox`.

const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  const tx = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '12500.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: await id('categories', 'Comida y supermercado'),
    p_account_id: await id('accounts', 'Efectivo'), p_installments_count: 1, p_occurred_on: ymd(), p_description: null, p_request_id: null,
  })
  expect(tx.status).toBe(200)
  const debt = await api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '10000.00', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: ymd(), p_notes: null,
  })
  expect(debt.status).toBe(200)
}

async function box(locator: Locator) {
  await expect(locator.first()).toBeVisible()
  const b = await locator.first().boundingBox()
  expect(b, 'el control tiene caja').not.toBeNull()
  return b!
}

async function expectTall(locator: Locator, name: string) {
  const b = await box(locator)
  expect(Math.round(b.height), `${name}: alto`).toBeGreaterThanOrEqual(44)
}

test('CP-NAV-038 · «Ver todos» del Resumen y «Activos»/«Eliminados» miden al menos 44 px', async ({ page, request }) => {
  await setup(page, request, 'nav-038')
  await page.goto('/dashboard')
  await expectTall(page.getByTestId('dashboard-transactions-view-all'), '«Ver todos»')
  await page.goto('/transactions')
  await expectTall(page.getByTestId('transactions-filter-active'), '«Activos»')
  await expectTall(page.getByTestId('transactions-filter-deleted'), '«Eliminados»')
})

test('CP-NAV-039 · en Deudas, los filtros, «Nueva deuda» y «Marcar saldada» miden al menos 44 px', async ({ page, request }) => {
  await setup(page, request, 'nav-039')
  await page.goto('/debts')
  for (const id of ['debts-filter-pending', 'debts-filter-settled', 'debts-filter-all', 'debts-new', 'debts-item-settle', 'debts-item-edit']) {
    await expectTall(page.getByTestId(id), id)
  }
})

test('CP-NAV-040 · en Ajustes, el selector de tema y los interruptores miden al menos 44 px de alto', async ({ page, request }) => {
  await setup(page, request, 'nav-040')
  await page.goto('/settings')
  for (const v of ['light', 'dark', 'system']) await expectTall(page.getByTestId(`settings-theme-${v}`), `tema ${v}`)
  const switches = page.getByRole('switch')
  expect(await switches.count()).toBeGreaterThan(0)
  for (let i = 0; i < (await switches.count()); i++) await expectTall(switches.nth(i), `interruptor ${i + 1}`)
})

test('CP-NAV-041 · los controles contiguos están separados al menos 8 px y no hay scroll horizontal', async ({ page, request }) => {
  await setup(page, request, 'nav-041')
  await page.goto('/debts')
  const edit = await box(page.getByTestId('debts-item-edit'))
  const settle = await box(page.getByTestId('debts-item-settle'))
  const gap = edit.x >= settle.x + settle.width ? edit.x - (settle.x + settle.width) : settle.x - (edit.x + edit.width)
  expect(gap, 'separación entre «Marcar saldada» y «Editar»').toBeGreaterThanOrEqual(8)
  for (const path of ['/dashboard', '/debts', '/transactions', '/settings']) {
    await page.goto(path)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    expect(overflow, `${path} sin scroll horizontal`).toBe(false)
  }
})
