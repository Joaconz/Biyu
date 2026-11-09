import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// Regresión de V3 · Suscripciones (SUS), casos de V2 (entrega-3/03-seleccion-regresion.md). Los que ya cubre otra
// suite (CP-SUS-022, 032 y 048 en subscriptions-defects.spec.ts) no se repiten. Como en los casos, los de calendario
// necesitan que hoy sea el día 27 o antes: con día de cobro 28 el mes corriente todavía no se cobró.

type Api = Awaited<ReturnType<typeof apiSession>>
const ymd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
const today = () => Number(ymd().slice(8, 10))
const period = (offset: number) => {
  const [y, m] = ymd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-01`
}
const beforeTheCharge = () => test.skip(today() > 27, 'El caso necesita que hoy sea el día 27 o antes (día de cobro 28)')

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, category: await id('categories', 'Entretenimiento'), cash: await id('accounts', 'Efectivo') }
}
type Setup = Awaited<ReturnType<typeof setup>>

const create = (s: Setup, over: Record<string, unknown> = {}) =>
  s.api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: s.category, p_account_id: s.cash,
    p_billing_day: 28, p_start_period: period(-2), p_end_period: null, p_description: null, ...over,
  })
const subId = (res: { body: unknown }) => (res.body as { subscription_id: string }).subscription_id
const generated = (res: { body: unknown }) => (res.body as { generated: number }).generated
const occurrences = async (api: Api, id: string) =>
  (await api.select('transactions', `select=id,occurred_on,subscription_period,deleted_at,amount_text:amount::text&subscription_id=eq.${id}&order=occurred_on`)).body as {
    id: string
    occurred_on: string
    subscription_period: string
    deleted_at: string | null
    amount_text: string
  }[]
const sub = async (api: Api, id: string) =>
  ((await api.select('subscriptions', `select=status,paused_at,generate_from_period,amount_text:amount::text&id=eq.${id}`)).body as {
    status: string
    paused_at: string | null
    generate_from_period: string
    amount_text: string
  }[])[0]

async function fillForm(page: Page, o: { name: string; amount: string; day?: string; start?: string }) {
  await page.goto('/subscriptions/new')
  await page.getByTestId('subscription-form-name').fill(o.name)
  await page.getByTestId('subscription-form-amount').fill(o.amount)
  await page.getByTestId('subscription-form-category').selectOption({ label: 'Entretenimiento' })
  await page.getByTestId('subscription-form-account').selectOption({ label: 'Efectivo' })
  await page.getByTestId('subscription-form-billing-day').fill(o.day ?? '28')
  await page.getByTestId('subscription-form-start-period').fill((o.start ?? period(-2)).slice(0, 7))
}

test('CP-SUS-001 · dar de alta una suscripción desde hace 2 meses genera los gastos vencidos al guardar', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-001')
  await fillForm(page, { name: 'Netflix', amount: '5000' })
  await page.getByTestId('subscription-form-submit').click()
  await expect(page).toHaveURL(/\/subscriptions\/[0-9a-f-]{36}$/)
  const [row] = (await s.api.select('subscriptions', 'select=id')).body as { id: string }[]
  const rows = await occurrences(s.api, row.id)
  expect(rows.map((r) => r.subscription_period)).toEqual([period(-2), period(-1)])
  expect(new Set(rows.map((r) => r.amount_text))).toEqual(new Set(['5000.00']))
})

test('CP-SUS-006 y 007 · el nombre igual al de otra activa se rechaza por la pantalla y por la API sin distinguir mayúsculas ni espacios', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-006')
  expect((await create(s)).status).toBe(200)
  await fillForm(page, { name: ' netflix ', amount: '5000' })
  await page.getByTestId('subscription-form-submit').click()
  await expect(page.getByTestId('subscription-form-error').or(page.locator('#subscription-form-name-error'))).toContainText(/ya existe|Ya tenés/i)
  await expect(page).toHaveURL(/\/subscriptions\/new/)
  const api = await create(s, { p_name: ' netflix ' })
  expect(api.status).toBe(409)
  expect((await s.api.select('subscriptions', 'select=id')).body).toHaveLength(1)
})

test('CP-SUS-008 y 009 · un monto 0 se rechaza por la pantalla y por la API', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-008')
  await fillForm(page, { name: 'Spotify', amount: '0' })
  await page.getByTestId('subscription-form-submit').click()
  await expect(page.locator('#subscription-form-amount-error')).toContainText('mayor a cero')
  await expect(page).toHaveURL(/\/subscriptions\/new/)
  const api = await create(s, { p_name: 'Spotify', p_amount: '0.00' })
  expect(api.status).toBe(400)
  expect(api.body).toMatchObject({ code: '23514' })
  expect((await s.api.select('subscriptions', 'select=id')).body).toEqual([])
})

test('CP-SUS-017 y 018 · una categoría ajena y un INSERT directo se rechazan', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'sus-017a')
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'sus-017b')
  const foreign = await create(a, { p_category_id: b.category })
  expect(foreign.status).toBeGreaterThanOrEqual(400)
  expect((await a.api.select('subscriptions', 'select=id')).body).toEqual([])
  const direct = await a.api.patch('subscriptions', 'name=eq.x', { name: 'y' })
  expect(direct.body).toMatchObject({ code: '42501' })
  const insert = await request.post(`${process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321'}/rest/v1/subscriptions`, {
    headers: { apikey: process.env.SUPABASE_ANON_KEY ?? '', Authorization: `Bearer ${a.api.token}`, 'Content-Type': 'application/json' },
    data: { name: 'X', amount: 1, currency: 'ARS' },
  })
  expect([401, 403, 400]).toContain(insert.status())
})

test('CP-SUS-020 y 021 · la suscripción de otro usuario no se ve ni se lee', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'sus-020a')
  const id = subId(await create(a))
  const other = await browser.newContext()
  const pageB = await other.newPage()
  const b = await setup(pageB, request, 'sus-020b')
  expect((await b.api.select('subscriptions', `select=id&id=eq.${id}`)).body).toEqual([])
  await pageB.goto(`/subscriptions/${id}`)
  await expect(pageB.getByTestId('subscription-detail-not-found')).toBeVisible()
})

test('CP-SUS-024 · la puesta al día al entrar a la app genera los períodos vencidos y muestra el aviso', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-024')
  const res = await create(s, { p_name: 'Disney+', p_amount: '10.00', p_currency: 'USD' })
  expect(generated(res)).toBe(0) // sin tipos de cambio no hay nada que generar todavía
  for (const offset of [-2, -1]) expect((await s.api.rpc('upsert_fx_rate', { p_period: period(offset), p_ars_per_usd: '1200.00' })).status).toBe(200)
  await page.reload()
  await expect(page.getByTestId('app-catchup-generated')).toBeVisible()
  expect(await occurrences(s.api, subId(res))).toHaveLength(2)
})

test('CP-SUS-025 y 026 · la puesta al día es idempotente y una pausada no genera', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-025')
  const id = subId(await create(s))
  for (let i = 0; i < 2; i++) expect((await s.api.rpc('run_subscription_catchup', {})).status).toBe(200)
  expect(await occurrences(s.api, id)).toHaveLength(2)
  const other = subId(await create(s, { p_name: 'HBO', p_start_period: period(-1) }))
  expect((await s.api.rpc('pause_subscription', { p_subscription_id: other })).status).toBe(200)
  const before = (await occurrences(s.api, other)).length
  expect((await s.api.rpc('run_subscription_catchup', {})).status).toBe(200)
  expect(await occurrences(s.api, other)).toHaveLength(before)
})

test('CP-SUS-027, 028 y 029 · el día de cobro 31 se ajusta al fin de mes y el cobro de hoy sí y el de mañana no se genera', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-027')
  const id31 = subId(await create(s, { p_name: 'Fin de mes', p_billing_day: 31, p_start_period: '2026-01-01', p_end_period: '2026-04-01' }))
  expect((await occurrences(s.api, id31)).map((r) => r.occurred_on)).toEqual(['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30'])
  const day = today()
  if (day < 28) {
    const tomorrow = subId(await create(s, { p_name: 'Mañana', p_billing_day: day + 1, p_start_period: period(0) }))
    expect(await occurrences(s.api, tomorrow)).toHaveLength(0)
  }
  const now = subId(await create(s, { p_name: 'Hoy', p_billing_day: day, p_start_period: period(0) }))
  expect(await occurrences(s.api, now)).toHaveLength(1)
})

test('CP-SUS-030 y 031 · pausar avisa del mes sin cobrar, queda «Pausada» con piso en el mes siguiente y genera lo vencido antes', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-030')
  const id = subId(await create(s, { p_start_period: period(-1) }))
  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-pause').click()
  await expect(page.getByTestId('pause-subscription-dialog')).toBeVisible()
  await expect(page.getByTestId('pause-subscription-dialog')).toContainText('Este mes tampoco se cobra')
  await page.getByTestId('pause-subscription-dialog').getByRole('button', { name: /^Pausar/ }).click()
  await expect(page.getByTestId('subscription-detail-status')).toContainText('Pausada')
  const row = await sub(s.api, id)
  expect(row.status).toBe('paused')
  expect(row.generate_from_period).toBe(period(1))
  expect(row.paused_at).not.toBeNull()
  // Por la API la pausa también pone al día lo vencido antes de pausar (CP-SUS-031).
  const late = subId(await create(s, { p_name: 'Tarde', p_start_period: period(-3) }))
  expect(await occurrences(s.api, late)).toHaveLength(3)
  expect((await s.api.rpc('pause_subscription', { p_subscription_id: late })).status).toBe(200)
  expect(await occurrences(s.api, late)).toHaveLength(3)
})

test('CP-SUS-033 · reanudar pasa a «Activa», limpia paused_at, conserva el piso y no genera el mes actual', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-033')
  const id = subId(await create(s, { p_start_period: period(-1) }))
  expect((await s.api.rpc('pause_subscription', { p_subscription_id: id })).status).toBe(200)
  const before = (await occurrences(s.api, id)).length
  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-resume').click()
  await expect(page.getByTestId('resume-subscription-dialog')).toBeVisible()
  await page.getByTestId('resume-subscription-dialog').getByRole('button', { name: /^Reanudar/ }).click()
  await expect(page.getByTestId('subscription-detail-status')).toContainText('Activa')
  const row = await sub(s.api, id)
  expect(row).toMatchObject({ status: 'active', paused_at: null, generate_from_period: period(1) })
  expect(await occurrences(s.api, id)).toHaveLength(before)
})

test('CP-SUS-034 · cancelar mantiene el historial y oculta las acciones', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-034')
  const id = subId(await create(s, { p_start_period: period(-3), p_billing_day: 1 }))
  const total = (await occurrences(s.api, id)).length
  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-cancel').click()
  await page.getByTestId('cancel-subscription-dialog').getByRole('button', { name: /^Cancelar suscripción|^Cancelar$/ }).last().click()
  await expect(page.getByTestId('subscription-detail-status')).toContainText('Cancelada')
  await expect(page.getByTestId('subscription-detail-pause')).toHaveCount(0)
  await expect(page.getByTestId('subscription-detail-cancel')).toHaveCount(0)
  await expect(page.getByTestId('subscription-detail-occurrence')).toHaveCount(total)
})

test('CP-SUS-035 y 037 · editar el monto no cambia lo generado, moneda y mes de inicio son de solo lectura y no se puede repetir un nombre', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-035')
  const id = subId(await create(s, { p_start_period: period(-4), p_billing_day: 1 }))
  expect((await create(s, { p_name: 'Spotify', p_start_period: period(0), p_billing_day: 28 })).status).toBe(200)
  await page.goto(`/subscriptions/${id}`)
  await page.getByTestId('subscription-detail-edit').click()
  await expect(page.getByTestId('subscription-form-currency-readonly')).toBeVisible()
  await expect(page.getByTestId('subscription-form-start-period-readonly')).toBeVisible()
  await page.getByTestId('subscription-form-name').fill('spotify')
  await page.getByTestId('subscription-form-submit').click()
  await expect(page).toHaveURL(/\/edit/)
  await page.getByTestId('subscription-form-name').fill('Netflix')
  await page.getByTestId('subscription-form-amount').fill('7000')
  await page.getByTestId('subscription-form-submit').click()
  await expect(page).not.toHaveURL(/\/edit/)
  expect((await sub(s.api, id)).amount_text).toBe('7000.00')
  expect(new Set((await occurrences(s.api, id)).map((r) => r.amount_text))).toEqual(new Set(['5000.00']))
})

test('CP-SUS-040, 041 y 042 · eliminar una ocurrencia, su marca en Movimientos y lo que suma en el Resumen', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-040')
  const id = subId(await create(s))
  const rows = await occurrences(s.api, id)
  await page.goto(`/transactions?period=${period(-1).slice(0, 7)}`)
  await expect(page.getByTestId('transactions-item-subscription')).toBeVisible()
  await page.getByTestId('transactions-item-delete').click()
  await expect(page.getByTestId('delete-transaction-subscription-note')).toBeVisible()
  await page.getByRole('dialog').getByRole('button', { name: /Eliminar/ }).last().click()
  await expect.poll(async () => (await occurrences(s.api, id)).filter((r) => r.deleted_at).length).toBe(1)
  expect((await s.api.rpc('run_subscription_catchup', {})).status).toBe(200)
  expect(await occurrences(s.api, id)).toHaveLength(rows.length) // no se vuelve a crear (I11)
  await page.goto(`/subscriptions/${id}`)
  await expect(page.getByTestId('subscription-detail-occurrence-deleted')).toHaveCount(1)
  await page.goto(`/dashboard?period=${period(-2).slice(0, 7)}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toContainText('5.000,00') // la ocurrencia que quedó
})

test('CP-SUS-043 · en US$ sin tipo de cambio en un mes solo se genera el que lo tiene y se avisa «Falta tipo de cambio»', async ({ page, request }) => {
  beforeTheCharge()
  const s = await setup(page, request, 'sus-043')
  expect((await s.api.rpc('upsert_fx_rate', { p_period: period(-2), p_ars_per_usd: '1200.00' })).status).toBe(200)
  const res = await create(s, { p_name: 'ChatGPT Plus', p_amount: '20.00', p_currency: 'USD' })
  expect(generated(res)).toBe(1)
  await page.goto(`/subscriptions/${subId(res)}`)
  await expect(page.getByTestId('subscription-detail-blocked')).toContainText('Falta el tipo de cambio')
  await page.getByTestId('subscription-detail-blocked-fx').click()
  await expect(page).toHaveURL(new RegExp(`/settings\\?period=${period(-1).slice(0, 7)}`))
})

test('CP-SUS-044 y 045 · el total mensual comprometido suma pesos y dólares al tipo de cambio del mes', async ({ page, request }) => {
  const s = await setup(page, request, 'sus-044')
  expect((await create(s, { p_name: 'A', p_amount: '5000.00', p_start_period: period(0), p_billing_day: 28 })).status).toBe(200)
  expect((await create(s, { p_name: 'B', p_amount: '2500.00', p_start_period: period(0), p_billing_day: 28 })).status).toBe(200)
  await page.goto('/subscriptions')
  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('7.500,00')
  await expect(page.getByTestId('subscriptions-committed-count')).toContainText('2 suscripciones activas')
  expect((await s.api.rpc('upsert_fx_rate', { p_period: period(0), p_ars_per_usd: '1250.00' })).status).toBe(200)
  expect((await create(s, { p_name: 'C', p_amount: '10.00', p_currency: 'USD', p_start_period: period(0), p_billing_day: 28 })).status).toBe(200)
  await page.reload()
  await expect(page.getByTestId('subscriptions-committed-total')).toContainText('20.000,00')
})

test('CP-SUS-047 · la vista previa muestra los meses que se cargan al guardar', async ({ page, request }) => {
  beforeTheCharge()
  await setup(page, request, 'sus-047')
  await fillForm(page, { name: 'Netflix', amount: '5000' })
  await expect(page.getByTestId('subscription-form-preview')).toBeVisible()
  await expect(page.getByTestId('subscription-form-preview-due-item')).toHaveCount(2)
})
