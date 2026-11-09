import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Regresión de V3 · Deudas (DEU), casos de V2 (entrega-3/03-seleccion-regresion.md). Los que ya cubre otra suite
// (CP-DEU-021 y 024 en debt-form.spec.ts) no se repiten. Cada caso va por la pantalla o por la API según su variante.

type Api = Awaited<ReturnType<typeof apiSession>>
const argentinaYmd = (offsetDays = 0) => {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date()).split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + offsetDays)).toISOString().slice(0, 10)
}
const thisMonth = () => `${argentinaYmd().slice(0, 7)}-01`

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, other: await id('categories', 'Otros'), cash: await id('accounts', 'Efectivo'), visa: await id('accounts', 'Tarjeta de crédito') }
}
type Setup = Awaited<ReturnType<typeof setup>>

const debt = (api: Api, over: Record<string, unknown> = {}) =>
  api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '20000.00', p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: argentinaYmd(-1), p_notes: null, ...over,
  })

const expense = (s: Setup, over: Record<string, unknown> = {}) =>
  s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '120000.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: s.other, p_account_id: s.cash,
    p_installments_count: 1, p_occurred_on: argentinaYmd(-1), p_description: null, p_request_id: null, ...over,
  })

const sofia = { p_shared_persons: ['Sofía'], p_shared_amounts: ['60000.00'] }
const debts = async (api: Api, query = '') =>
  (await api.select('debts', `select=id,person,direction,status,transaction_id,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text${query}`)).body as {
    id: string
    person: string
    direction: string
    status: string
    transaction_id: string | null
    fx_rate_text: string | null
    amount_ars_text: string
  }[]
const count = async (api: Api, table: string) => ((await api.select(table, 'select=id')).body as unknown[]).length

// Pantalla de gasto compartido (US-34, US-82).
async function toShared(page: Page, amount: string, o: { installments?: number; usd?: string } = {}) {
  await page.goto('/register')
  if (o.usd) await page.getByTestId('transaction-form-currency-usd').click()
  if (o.usd) await page.getByTestId('transaction-form-fx-rate').fill(o.usd)
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await page.getByTestId(`transaction-form-account-chip-${o.installments ? 'tarjeta-de-credito' : 'efectivo'}`).click()
  if (o.installments) await page.getByTestId(`transaction-form-installments-chip-${o.installments}`).click()
  await page.getByTestId('transaction-form-shared-toggle').click()
}
const person = (page: Page, i = 1) => page.locator(`[data-testid="transaction-form-shared-person"][data-index="${i}"]`)
const amountOf = (page: Page, i = 1) => page.locator(`[data-testid="transaction-form-shared-amount"][data-index="${i}"]`)

test('CP-DEU-001 · el interruptor «Gasto compartido» se enciende y se apaga, y el gasto se guarda sin deuda', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-001')
  await toShared(page, '120000')
  await expect(person(page)).toBeVisible()
  await page.getByTestId('transaction-form-shared-toggle').click()
  await expect(person(page)).toHaveCount(0)
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  expect(await count(s.api, 'transactions')).toBe(1)
  expect(await debts(s.api)).toEqual([])
})

test('CP-DEU-002 · un gasto compartido de $120.000 en 12 cuotas guarda el gasto y la deuda vinculada de Sofía', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-002')
  await toShared(page, '120000', { installments: 12 })
  await person(page).fill('Sofía')
  await amountOf(page).fill('60000')
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  const [d] = await debts(s.api)
  expect(d).toMatchObject({ person: 'Sofía', direction: 'owed_to_me', status: 'pending', amount_ars_text: '60000.00' })
  expect(d.transaction_id).not.toBeNull()
  expect(await count(s.api, 'ledger_entries')).toBe(12)
})

test('CP-DEU-003 · un gasto compartido en dólares avisa en dólares y congela el tipo de cambio', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-003')
  await toShared(page, '100', { usd: '1250' })
  await person(page).fill('Sofía')
  await amountOf(page).fill('40')
  await expect(page.getByTestId('transaction-form-shared-summary')).toContainText('US$')
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  const [d] = await debts(s.api)
  expect(d).toMatchObject({ fx_rate_text: '1250.0000', amount_ars_text: '50000.00' })
})

test('CP-DEU-005, 006, 008, 010 · no se puede compartir sin monto, sin persona, con nombre de espacios ni con 0', async ({ page, request }) => {
  await setup(page, request, 'deu-005')
  await toShared(page, '120000')
  const submit = page.getByTestId('transaction-form-submit')
  await person(page).fill('Sofía') // falta cuánto te deben
  await expect(submit).toBeDisabled()
  await amountOf(page).fill('0')
  await amountOf(page).blur()
  await expect(page.getByTestId('transaction-form-shared-amount-error')).toHaveText('El monto debe ser mayor a cero')
  await expect(submit).toBeDisabled()
  await person(page).fill('')
  await amountOf(page).fill('1000') // falta con quién
  await person(page).blur()
  await expect(page.getByTestId('transaction-form-shared-person-error')).toBeVisible()
  await expect(submit).toBeDisabled()
  await person(page).fill('   ') // solo espacios
  await person(page).blur()
  await expect(page.getByTestId('transaction-form-shared-person-error')).toBeVisible()
  await expect(submit).toBeDisabled()
})

test('CP-DEU-007 · un ingreso no se puede compartir', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-007')
  await page.goto('/register')
  await page.getByTestId('transaction-form-type-income').click()
  await page.getByTestId('transaction-form-amount').fill('50000')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await expect(page.getByTestId('transaction-form-shared-toggle')).toHaveCount(0)
  const api = await expense(s, { p_type: 'income', p_amount: '50000.00', p_category_id: null, ...sofia })
  expect(api.status).toBe(400)
  expect(api.body).toMatchObject({ code: '23514', message: 'Un ingreso no se puede compartir' })
})

test('CP-DEU-011 y 012 · una deuda igual al gasto se acepta y un centavo más no se puede guardar', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-011')
  await toShared(page, '120000')
  await person(page).fill('Sofía')
  await amountOf(page).fill('120000')
  await expect(page.getByTestId('transaction-form-shared-summary')).toContainText('Tu parte: $0,00')
  await expect(page.getByTestId('transaction-form-submit')).toBeEnabled()
  await amountOf(page).fill('120000,01')
  await amountOf(page).blur()
  await expect(page.getByTestId('transaction-form-shared-amount-error')).toContainText('No puede superar el monto del gasto')
  await expect(page.getByTestId('transaction-form-submit')).toBeDisabled()
  expect((await expense(s, { p_shared_persons: ['Sofía'], p_shared_amounts: ['120000.00'] })).status).toBe(200)
})

test('CP-DEU-013 y 057 · por API, una deuda mayor que el gasto o deudas que suman más se rechazan y no se guarda nada', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-013')
  const over = await expense(s, { p_shared_persons: ['Sofía'], p_shared_amounts: ['120000.01'] })
  expect(over.status).toBe(400)
  expect(over.body).toMatchObject({ code: '23514', message: 'I7: la deuda no puede superar el monto del gasto' })
  const sum = await expense(s, { p_shared_persons: ['Sofía', 'Juan'], p_shared_amounts: ['60000.00', '60000.01'] })
  expect(sum.status).toBe(400)
  expect(sum.body).toMatchObject({ code: '23514', message: 'I7: la suma de las deudas no puede superar el monto del gasto' })
  expect([await count(s.api, 'transactions'), await count(s.api, 'ledger_entries'), await count(s.api, 'debts')]).toEqual([0, 0, 0])
})

test('CP-DEU-015 y 016 · eliminar el gasto oculta la deuda y restaurarlo la devuelve con su estado', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-015')
  const tx = (await expense(s, sofia)).body as string
  const [d] = await debts(s.api)
  await s.api.rpc('settle_debt', { p_debt_id: d.id })
  await page.goto('/debts?status=all')
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await s.api.rpc('delete_transaction', { p_transaction_id: tx })
  await page.reload()
  await expect(page.getByTestId('debts-item')).toHaveCount(0)
  expect(await debts(s.api)).toHaveLength(1) // la fila sigue en la base, intacta
  await s.api.rpc('restore_transaction', { p_transaction_id: tx })
  await page.reload()
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await expect(page.getByTestId('debts-item-status')).toContainText(/Saldada/i)
})

test('CP-DEU-017 y 018 · una deuda suelta «Me deben» y otra «Debo» se guardan con su dirección', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-017')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-person').fill('Juan')
  await page.getByTestId('debt-form-amount').fill('20000')
  await page.getByTestId('debt-form-submit').click()
  await expect(page.getByTestId('debts-list')).toBeVisible()
  const [first] = await debts(s.api)
  expect(first).toMatchObject({ person: 'Juan', direction: 'owed_to_me', status: 'pending', transaction_id: null })
  await debt(s.api, { p_direction: 'i_owe', p_person: 'Marta' })
  await page.goto('/debts')
  await expect(page.getByTestId('debts-item-direction').filter({ hasText: 'Le debés' })).toHaveCount(1)
})

test('CP-DEU-019 y 038 · una deuda en US$ guarda el tipo de cambio de referencia y no cambia si la referencia cambia', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-019')
  await s.api.rpc('upsert_fx_rate', { p_period: thisMonth(), p_ars_per_usd: '1250.00' })
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-currency-usd').click()
  await expect(page.getByTestId('debt-form-fx-rate')).toHaveValue(/1\.?250/)
  await page.getByTestId('debt-form-person').fill('Juan')
  await page.getByTestId('debt-form-amount').fill('40')
  await page.getByTestId('debt-form-submit').click()
  await expect(page.getByTestId('debts-list')).toBeVisible()
  expect((await debts(s.api))[0]).toMatchObject({ fx_rate_text: '1250.0000', amount_ars_text: '50000.00' })
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('50.000,00')
  await s.api.rpc('upsert_fx_rate', { p_period: thisMonth(), p_ars_per_usd: '1400.00' })
  await page.reload()
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('50.000,00')
})

test('CP-DEU-022 · un monto igual a 0 muestra «El monto debe ser mayor a cero»', async ({ page, request }) => {
  await setup(page, request, 'deu-022')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-person').fill('Juan')
  await page.getByTestId('debt-form-amount').fill('0')
  await page.getByTestId('debt-form-person').focus()
  await expect(page.getByTestId('debt-form-amount-error')).toHaveText('El monto debe ser mayor a cero')
  await expect(page.getByTestId('debt-form-submit')).toBeDisabled()
})

test('CP-DEU-025 · con US$ un tipo de cambio de 0 muestra «El tipo de cambio debe ser mayor a cero» (DEF-037)', async ({ page, request }) => {
  await setup(page, request, 'deu-025')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-currency-usd').click()
  await page.getByTestId('debt-form-person').fill('Juan')
  await page.getByTestId('debt-form-amount').fill('10')
  await page.getByTestId('debt-form-fx-rate').fill('0')
  await page.getByTestId('debt-form-person').focus()
  await expect(page.getByTestId('debt-form-fx-rate-error')).toHaveText('El tipo de cambio debe ser mayor a cero')
})

test('CP-DEU-026 · una fecha posterior a hoy muestra «La fecha no puede ser futura» y deshabilita «Guardar deuda»', async ({ page, request }) => {
  await setup(page, request, 'deu-026')
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-person').fill('Juan')
  await page.getByTestId('debt-form-amount').fill('1000')
  await page.getByTestId('debt-form-date').fill(argentinaYmd(1))
  await page.getByTestId('debt-form-person').focus()
  await expect(page.getByTestId('debt-form-date-error')).toHaveText('La fecha no puede ser futura')
  await expect(page.getByTestId('debt-form-submit')).toBeDisabled()
})

test('CP-DEU-027, 029, 031, 033 · directo contra create_debt se rechazan persona vacía, monto 0, US$ sin tipo de cambio y fecha futura', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-027')
  const cases: [Record<string, unknown>, RegExp][] = [
    [{ p_person: '' }, /Ingresá el nombre de la persona/],
    [{ p_amount: '0' }, /mayor a cero/],
    [{ p_currency: 'USD', p_fx_rate: null }, /I5: fx_rate es obligatorio/],
    [{ p_incurred_on: argentinaYmd(1) }, /fecha no puede ser posterior a hoy/],
  ]
  for (const [over, message] of cases) {
    const res = await debt(s.api, over)
    expect(res.status, JSON.stringify(over)).toBe(400)
    expect(res.body).toMatchObject({ code: '23514' })
    expect((res.body as { message: string }).message).toMatch(message)
  }
  expect(await debts(s.api)).toEqual([])
})

test('CP-DEU-034, 035, 045 · sin sesión no se crea ni se lee, y el POST directo a /debts responde 42501', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-034')
  await debt(s.api)
  const anon = await s.api.rpc('create_debt', { p_direction: 'owed_to_me', p_person: 'X', p_amount: '1.00', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: argentinaYmd(-1), p_notes: null }, { asAnon: true })
  expect(anon.body).toMatchObject({ code: '42501' })
  const read = await s.api.select('debts', 'select=id', { asAnon: true })
  expect(read.status === 200 ? read.body : []).toEqual([])
  const direct = await s.api.patch('debts', 'person=eq.Juan', { person: 'Otro' })
  expect(direct.body).toMatchObject({ code: '42501' })
  expect(await debts(s.api)).toHaveLength(1)
})

test('CP-DEU-036, 037 y 039 · totales, neto «En contra» y filtro de estado en la URL', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-036')
  await debt(s.api, { p_amount: '20000.00' })
  await debt(s.api, { p_direction: 'i_owe', p_person: 'Marta', p_amount: '25000.00' })
  const paid = (await debt(s.api, { p_person: 'Pedro', p_amount: '9000.00' })).body as string
  await s.api.rpc('settle_debt', { p_debt_id: paid })
  await page.goto('/debts')
  await expect(page.getByTestId('debts-filter-pending')).toBeChecked()
  await expect(page.getByTestId('debts-item')).toHaveCount(2)
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('20.000,00')
  await expect(page.getByTestId('debts-total-i-owe')).toContainText('25.000,00')
  await expect(page.getByTestId('debts-net')).toHaveText(/En contra \$5\.000,00/)
  await page.getByTestId('debts-filter-settled').click()
  await expect(page).toHaveURL(/status=settled/)
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await page.getByTestId('debts-filter-all').click()
  await expect(page).toHaveURL(/status=all/)
  await expect(page.getByTestId('debts-item')).toHaveCount(3)
})

test('CP-DEU-043, 044, 049, 050, 051 · autorización y estados: otro usuario no ve ni salda, saldar dos veces y modificar directo se rechazan', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'deu-043a')
  const id = (await debt(a.api)).body as string
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'deu-043b')
  expect(await debts(b.api)).toEqual([])
  const settleB = await b.api.rpc('settle_debt', { p_debt_id: id })
  expect([400, 404]).toContain(settleB.status)
  expect((await debts(a.api))[0].status).toBe('pending')
  expect((await a.api.rpc('settle_debt', { p_debt_id: id })).status).toBe(204)
  const twice = await a.api.rpc('settle_debt', { p_debt_id: id })
  expect(twice.status).toBe(400)
  expect(twice.body).toMatchObject({ code: '23514', message: 'La deuda ya está saldada' })
  const patch = await a.api.patch('debts', `id=eq.${id}`, { person: 'Otro' })
  expect(patch.body).toMatchObject({ code: '42501' })
})

test('CP-DEU-046, 047, 052 · saldar, deshacer y volver a pendiente', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-046')
  await debt(s.api)
  await page.goto('/debts')
  await page.getByTestId('debts-item-settle').click()
  await expect(page.getByTestId('debts-settled')).toBeVisible()
  await expect(page.getByTestId('debts-item')).toHaveCount(0)
  expect((await debts(s.api))[0].status).toBe('settled')
  await page.getByTestId('debts-settled-undo').click()
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  expect((await debts(s.api))[0].status).toBe('pending')
  await page.getByTestId('debts-item-settle').click()
  await page.goto('/debts?status=settled')
  await page.getByTestId('debts-item-reopen').click()
  await expect(page.getByTestId('debts-reopened')).toBeVisible()
  expect((await debts(s.api))[0].status).toBe('pending')
})

test('CP-DEU-054 · filtro por dirección: Todas, Te deben y Debés', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-054')
  await debt(s.api)
  await debt(s.api, { p_direction: 'i_owe', p_person: 'Marta' })
  await page.goto('/debts')
  await expect(page.getByTestId('debts-item')).toHaveCount(2)
  await page.getByTestId('debts-direction-filter-owed-to-me').click()
  await expect(page).toHaveURL(/direction=owed_to_me/)
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await page.getByTestId('debts-direction-filter-i-owe').click()
  await expect(page).toHaveURL(/direction=i_owe/)
  await expect(page.getByTestId('debts-item-person')).toHaveText('Marta')
  await page.getByTestId('debts-direction-filter-all').click()
  await expect(page.getByTestId('debts-item')).toHaveCount(2)
})

test('CP-DEU-055 y 056 · compartir con varias personas: agregar, quitar y hasta 10', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-055')
  await toShared(page, '120000')
  await person(page, 1).fill('Sofía')
  await amountOf(page, 1).fill('10000')
  await page.getByTestId('transaction-form-shared-add').click()
  await person(page, 2).fill('Juan')
  await amountOf(page, 2).fill('10000')
  await page.getByTestId('transaction-form-shared-add').click()
  await page.getByTestId('transaction-form-shared-remove').nth(2).click()
  await expect(page.getByTestId('transaction-form-shared-row')).toHaveCount(2)
  for (let i = 3; i <= 10; i++) {
    await page.getByTestId('transaction-form-shared-add').click()
    await person(page, i).fill(`Persona ${i}`)
    await amountOf(page, i).fill('1000')
  }
  await expect(page.getByTestId('transaction-form-shared-add')).toBeDisabled()
  await expect(page.getByTestId('transaction-form-shared-limit')).toBeVisible()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toBeVisible()
  expect(await debts(s.api)).toHaveLength(10)
})

test('CP-DEU-058 a 061 · Resumen: gasto bruto y neto de reembolsos, que no cambia al saldar ni por una deuda suelta ni por el tipo de cambio', async ({ page, request }) => {
  const s = await setup(page, request, 'deu-058')
  await s.api.rpc('upsert_fx_rate', { p_period: thisMonth(), p_ars_per_usd: '1250.00' })
  expect((await expense(s, { p_occurred_on: argentinaYmd(), ...sofia })).status).toBe(200)
  const text = async (id: string) => (await page.getByTestId(id).innerText()).replace(/\s+/g, ' ')
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('120.000,00')
  const net = await text('dashboard-net-reimbursements')
  expect(net).toContain('60.000,00')
  const [d] = await debts(s.api)
  await s.api.rpc('settle_debt', { p_debt_id: d.id })
  await debt(s.api, { p_amount: '30000.00', p_incurred_on: argentinaYmd() })
  await page.reload()
  expect(await text('dashboard-net-reimbursements')).toBe(net)
  await s.api.rpc('upsert_fx_rate', { p_period: thisMonth(), p_ars_per_usd: '1400.00' })
  await page.reload()
  expect(await text('dashboard-net-reimbursements')).toBe(net)
})
