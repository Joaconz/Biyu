import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { apiSession, signUpAndSkipSetup, TEST_PASSWORD, uniqueEmail } from './support/app.ts'
import { e2eTarget } from './support/env.ts'

// Regresión de V3 · Acceso (ACC) y Navegación (NAV): CP-ACC-001 a 005, 008, 009, 011 y 012 del catálogo de V1,
// CP-NAV-010 y 012 a 025 del de V2 (entrega-3/03-seleccion-regresion.md). Se escriben sobre la UX final de V3
// (barra flotante, rebranding), así que cubren también que esas pantallas siguen haciendo lo de antes.
// Datos: las cuentas sembradas no incluyen «Visa BBVA»; el medio de pago es «Tarjeta de crédito».

type Api = Awaited<ReturnType<typeof apiSession>>
const AMOUNT = '12500'
const ON = '2026-10-06'
const CATEGORY = 'Comida y supermercado'
const ACCOUNT = 'Tarjeta de crédito'
const SAVED = `$12.500,00 · ${CATEGORY} · ${ACCOUNT}`
const NETWORK_MESSAGE = 'Revisá tu conexión y tocá Reintentar. Lo que cargaste sigue acá.'

async function signUpManually(page: Page, email: string) {
  await page.goto('/login')
  await page.getByTestId('login-form-switch').click()
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(TEST_PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(TEST_PASSWORD)
}

async function skipSetup(page: Page) {
  for (const step of ['reason', 'categories', 'accounts', 'expense']) await page.getByTestId(`setup-${step}-skip`).click()
  await expect(page).toHaveURL(/\/register$/)
}

const navLink = (page: Page, name: string) => page.getByRole('navigation', { name: 'Principal' }).getByRole('link', { name })

async function ids(api: Api) {
  const named = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { category: await named('categories', CATEGORY), account: await named('accounts', ACCOUNT) }
}

const body = (c: { category: string; account: string }, requestId: string | null) => ({
  p_type: 'expense', p_amount: '12500.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: c.category, p_account_id: c.account,
  p_installments_count: 1, p_occurred_on: ON, p_description: 'Almuerzo', p_request_id: requestId,
})

/** Pasos 1 a 3 de Registrar con el gasto de los casos NAV (monto, categoría, cuenta, fecha y nota). */
async function fillExpense(page: Page) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(AMOUNT)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-comida-y-supermercado').click()
  await page.getByTestId('transaction-form-account-chip-tarjeta-de-credito').click()
  await page.getByTestId('transaction-form-date-other').click()
  await page.getByTestId('transaction-form-date').fill(ON)
  await page.getByTestId('transaction-form-description').fill('Almuerzo')
}

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  return { email, api, ...(await ids(api)) }
}

const transactionsWith = async (api: Api, requestId: string) =>
  (await api.select('transactions', `select=id,request_id,user_id&request_id=eq.${requestId}`)).body as { id: string; request_id: string; user_id: string }[]
const pendingKey = (userId: string) => `biyu:pending-drafts:${userId}`

/** Sin red: el guardado falla y aparece «Reintentar» con los datos intactos. */
async function saveOffline(page: Page) {
  await page.context().setOffline(true)
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-save-error')).toHaveAttribute('data-kind', 'network')
}

// ---------------------------------------------------------------- ACC

test('CP-ACC-001 · sin sesión, la app redirige al login', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login\?next=%2Fregister$/)
  await expect(page.getByTestId('login-form')).toBeVisible()
  await expect(page.getByTestId('transaction-form')).toHaveCount(0)
})

test('CP-ACC-002 · una ruta privada abierta sin sesión conserva el destino', async ({ page }) => {
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login\?next=%2Fsettings$/)
})

test('CP-ACC-003 · crear una cuenta con email y contraseña válidos', async ({ page }) => {
  await signUpManually(page, uniqueEmail('acc-003'))
  await expect(page.getByTestId('signup-password-criteria')).toBeVisible()
  await expect(page.getByTestId('signup-form-password')).toHaveAttribute('type', 'password')
  await page.getByTestId('signup-form-submit').click()
  await expect(page).toHaveURL(/\/setup$/, { timeout: 15_000 })
  await skipSetup(page)
})

test('CP-ACC-004 · las contraseñas que no cumplen los criterios se rechazan, por la pantalla y por la API', async ({ page, request }) => {
  const weak = ['abc1234', 'abcdefgh', '12345678', 'abcd1234']
  for (const [i, password] of weak.entries()) {
    await signUpManually(page, uniqueEmail(`acc-004-${i}`))
    await page.getByTestId('signup-form-password').fill(password)
    await page.getByTestId('signup-form-confirm-password').fill(password)
    await page.getByTestId('signup-form-submit').click()
    await expect(page.getByTestId('signup-form-error')).toContainText('Falta que la contraseña cumpla')
    await expect(page).toHaveURL(/\/signup$/)
  }
  await signUpManually(page, uniqueEmail('acc-004-ok'))
  await page.getByTestId('signup-form-password').fill('Abcd123!')
  await page.getByTestId('signup-form-confirm-password').fill('Abcd123!')
  await page.getByTestId('signup-form-submit').click()
  await expect(page).toHaveURL(/\/setup$/, { timeout: 15_000 })

  const { supabaseUrl, anonKey } = e2eTarget()
  const res = await request.post(`${supabaseUrl}/auth/v1/signup`, { headers: { apikey: anonKey }, data: { email: uniqueEmail('acc-004-api'), password: 'abcd1234' } })
  expect(res.status(), 'FR-01: el servidor también valida la contraseña').toBeGreaterThanOrEqual(400)
  expect(res.status()).toBeLessThan(500)
})

test('CP-ACC-005 · no se puede crear una cuenta con un email ya registrado', async ({ page, request }) => {
  const email = uniqueEmail('acc-005')
  const { supabaseUrl, anonKey } = e2eTarget()
  const first = await request.post(`${supabaseUrl}/auth/v1/signup`, { headers: { apikey: anonKey }, data: { email, password: TEST_PASSWORD } })
  expect(first.status()).toBe(200)

  await signUpManually(page, email)
  await page.getByTestId('signup-form-submit').click()
  await expect(page.getByTestId('signup-form-error')).toHaveText('Ya existe una cuenta con ese email')
  await expect(page).toHaveURL(/\/signup$/)

  const again = await request.post(`${supabaseUrl}/auth/v1/signup`, { headers: { apikey: anonKey }, data: { email, password: TEST_PASSWORD } })
  expect(again.status()).toBe(422)
  expect(await again.json()).toMatchObject({ error_code: expect.stringMatching(/user_already_exists|email_exists/) })
})

test('CP-ACC-008 · una cuenta nueva tiene el catálogo inicial sembrado', async ({ page }) => {
  await signUpAndSkipSetup(page, 'acc-008')
  await page.goto('/settings')
  const accounts = page.getByTestId('settings-accounts-list')
  for (const name of ['Tarjeta de crédito', 'Tarjeta de débito', 'Efectivo', 'Cuenta bancaria', 'Billetera virtual']) {
    await expect(accounts).toContainText(name)
  }
  await page.getByTestId('settings-nav-categories').click()
  const categories = page.getByTestId('settings-categories-list')
  for (const name of ['Comida y supermercado', 'Transporte', 'Servicios', 'Entretenimiento', 'Salud', 'Educación', 'Indumentaria', 'Otros']) {
    await expect(categories).toContainText(name)
  }
})

test('CP-ACC-009 · cerrar sesión y no poder volver con «atrás»', async ({ page }) => {
  const { email } = await signUpAndSkipSetup(page, 'acc-009')
  for (const screen of ['/dashboard', '/register', '/transactions']) {
    await page.goto(screen)
    await page.goto('/settings')
    await page.getByTestId('settings-nav-logout').click()
    await expect(page).toHaveURL(/\/login/)
    await page.goBack()
    await expect(page).toHaveURL(/\/login/)
    await page.getByTestId('login-form-email').fill(email)
    await page.getByTestId('login-form-password').fill(TEST_PASSWORD)
    await page.getByTestId('login-form-submit').click()
    await expect(page).not.toHaveURL(/\/login/)
  }
})

test('CP-ACC-011 · aislamiento entre usuarios en todas las tablas (par de autorización)', async ({ page, request, browser }) => {
  const a = await setup(page, request, 'acc-011-a')
  expect((await a.api.rpc('create_transaction', body(a, null))).status).toBe(200)
  expect((await a.api.rpc('create_debt', { p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '1000.00', p_currency: 'ARS', p_fx_rate: null, p_incurred_on: ON, p_notes: null })).status).toBe(200)
  const sub = await a.api.rpc('create_subscription', {
    p_name: 'Netflix', p_amount: '5000.00', p_currency: 'ARS', p_category_id: a.category, p_account_id: a.account,
    p_billing_day: 10, p_start_period: '2026-10-01', p_end_period: null, p_description: null,
  })
  expect(sub.status).toBe(200)

  const other = await browser.newContext()
  const pageB = await other.newPage()
  const b = await setup(pageB, request, 'acc-011-b')
  const tables = ['categories', 'accounts', 'fx_rates', 'transactions', 'ledger_entries', 'debts', 'subscriptions']
  for (const table of tables) {
    const own = await a.api.select(table, `select=user_id&user_id=eq.${a.api.userId}`)
    if (table !== 'fx_rates') expect((own.body as unknown[]).length, `A ve sus filas de ${table}`).toBeGreaterThan(0)
    const crossed = await b.api.select(table, `select=user_id&user_id=eq.${a.api.userId}`)
    expect(crossed.body, `B no ve filas de A en ${table}`).toEqual([])
    const anon = await b.api.select(table, 'select=user_id', { asAnon: true })
    expect(anon.body, `anon en ${table}`).toMatchObject({ code: '42501' })
  }
  await other.close()
})

test('CP-ACC-012 · contraseña y confirmación distintas bloquean el alta', async ({ page }) => {
  await signUpManually(page, uniqueEmail('acc-012'))
  await page.getByTestId('signup-form-confirm-password').fill('Clave123?')
  await page.getByTestId('signup-form-submit').click()
  await expect(page.getByTestId('signup-form-error')).toHaveText('Las contraseñas no son iguales')
  await expect(page).toHaveURL(/\/signup$/)
})

// ---------------------------------------------------------------- NAV

test('CP-NAV-010 · tocar Registrar en Registrar conserva el paso 3 y el borrador', async ({ page, request }) => {
  await setup(page, request, 'nav-010')
  await fillExpense(page)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await navLink(page, 'Registrar').click()
  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await expect(page.getByTestId('transaction-form-description')).toHaveValue('Almuerzo')
  await expect(page.getByTestId('transaction-form-date')).toHaveValue(ON)
  await expect(page.getByTestId('transaction-form-summary-amount')).toContainText('12.500,00')
})

test('CP-NAV-011 y 025 · guardar muestra la confirmación completa y un doble toque envía una sola RPC', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-011')
  let posts = 0
  await page.route('**/rpc/create_transaction', async (route) => {
    posts += 1
    await new Promise((resolve) => setTimeout(resolve, 800))
    await route.continue()
  })
  await fillExpense(page)
  const submit = page.getByTestId('transaction-form-submit')
  await submit.click()
  await expect(submit).toBeDisabled()
  await expect(submit).toContainText('Guardando')
  await expect(page.getByTestId('transaction-form')).toHaveAttribute('aria-busy', 'true')
  await submit.click({ force: true })
  await expect(page.getByTestId('transaction-form-saved')).toContainText(SAVED)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
  expect(posts).toBe(1)
  expect((await s.api.select('transactions', 'select=id')).body).toHaveLength(1)
})

test('CP-NAV-012 y 013 · un fallo offline conserva los datos y Reintentar guarda una sola vez', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-012')
  await fillExpense(page)
  await saveOffline(page)
  const alert = page.getByTestId('transaction-form-save-error')
  await expect(alert).toContainText('No se pudo guardar')
  await expect(alert).toContainText(NETWORK_MESSAGE)
  await expect(page.getByTestId('transaction-form-submit')).toContainText('Reintentar')
  await expect(page.getByTestId('transaction-form-description')).toHaveValue('Almuerzo')
  await expect(page.getByTestId('transaction-form-date')).toHaveValue(ON)
  expect((await s.api.select('transactions', 'select=id')).body).toEqual([])

  await page.context().setOffline(false)
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toContainText(SAVED)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
  await page.goto('/transactions?period=2026-10')
  expect((await s.api.select('transactions', 'select=id')).body).toHaveLength(1)
})

test('CP-NAV-014 · a los 15 segundos de espera aparece el error reintentable', async ({ page, request }) => {
  test.setTimeout(90_000)
  await setup(page, request, 'nav-014')
  await fillExpense(page)
  await page.route('**/rpc/create_transaction', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 20_000))
    await route.abort('timedout').catch(() => undefined)
  })
  const started = Date.now()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form')).toHaveAttribute('aria-busy', 'true')
  const alert = page.getByTestId('transaction-form-save-error')
  await expect(alert).toBeVisible({ timeout: 25_000 })
  const seconds = (Date.now() - started) / 1000
  expect(seconds).toBeGreaterThanOrEqual(14)
  expect(seconds).toBeLessThanOrEqual(16.5)
  await expect(alert).toHaveAttribute('data-kind', 'network')
  await expect(alert).toContainText(NETWORK_MESSAGE)
  await expect(page.getByTestId('transaction-form-submit')).toContainText('Reintentar')
})

test('CP-NAV-015 · un reintento con commit previo no duplica', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-015')
  const key = '39000000-0000-4000-8000-000000000039'
  expect((await s.api.rpc('create_transaction', body(s, key))).status).toBe(200)
  await page.addInitScript((fixed) => {
    Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => fixed })
  }, key)
  await fillExpense(page)
  await saveOffline(page)
  await page.context().setOffline(false)
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-saved')).toContainText(SAVED)
  expect(await transactionsWith(s.api, key)).toHaveLength(1)
  expect((await s.api.select('transactions', 'select=id')).body).toHaveLength(1)
})

test('CP-NAV-016 · la misma clave secuencial devuelve el mismo id', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-016')
  const key = '40000000-0000-4000-8000-000000000040'
  const first = await s.api.rpc('create_transaction', body(s, key))
  const second = await s.api.rpc('create_transaction', body(s, key))
  expect([first.status, second.status]).toEqual([200, 200])
  expect(second.body).toBe(first.body)
  const rows = await s.api.select('transactions', `select=id,amount_text:amount::text,request_id,deleted_at&request_id=eq.${key}`)
  expect(rows.body).toEqual([{ id: first.body, amount_text: '12500.00', request_id: key, deleted_at: null }])
  const ledger = await s.api.select('ledger_entries', `select=installment_number,amount_text:amount::text&transaction_id=eq.${first.body}`)
  expect(ledger.body).toEqual([{ installment_number: 1, amount_text: '12500.00' }])
})

test('CP-NAV-017 · dos llamadas simultáneas con la misma clave crean una fila', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-017')
  const key = '41000000-0000-4000-8000-000000000041'
  const [one, two] = await Promise.all([s.api.rpc('create_transaction', body(s, key)), s.api.rpc('create_transaction', body(s, key))])
  expect([one.status, two.status]).toEqual([200, 200])
  expect(one.body).toBe(two.body)
  expect(JSON.stringify([one.body, two.body])).not.toContain('23505')
  expect(await transactionsWith(s.api, key)).toHaveLength(1)
  const ledger = await s.api.select('ledger_entries', `select=installment_number,amount_text:amount::text&transaction_id=eq.${one.body}`)
  expect(ledger.body).toEqual([{ installment_number: 1, amount_text: '12500.00' }])
})

test('CP-NAV-018 · la misma clave de dos usuarios no colisiona', async ({ page, request, browser }) => {
  const key = '43000000-0000-4000-8000-000000000043'
  const a = await setup(page, request, 'nav-018-a')
  const other = await browser.newContext()
  const b = await setup(await other.newPage(), request, 'nav-018-b')
  const ra = await a.api.rpc('create_transaction', body(a, key))
  const rb = await b.api.rpc('create_transaction', body(b, key))
  expect([ra.status, rb.status]).toEqual([200, 200])
  expect(ra.body).not.toBe(rb.body)
  expect(await transactionsWith(a.api, key)).toEqual([{ id: ra.body, request_id: key, user_id: a.api.userId }])
  expect(await transactionsWith(b.api, key)).toEqual([{ id: rb.body, request_id: key, user_id: b.api.userId }])
  await other.close()
})

test('CP-NAV-019 · archivar la categoría entre la revisión y el guardado produce un rechazo sin pendiente', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-019')
  await fillExpense(page)
  const archived = await s.api.patch('categories', `id=eq.${s.category}`, { archived_at: new Date().toISOString() })
  expect(archived.status).toBe(200)
  await page.getByTestId('transaction-form-submit').click()
  const alert = page.getByTestId('transaction-form-save-error')
  await expect(alert).toHaveAttribute('data-kind', 'rejected')
  await expect(alert).toContainText('No se pudo guardar')
  await expect(alert).toContainText('la categoría no existe, no es tuya o está archivada')
  await expect(page.getByTestId('transaction-form-submit')).toContainText('Guardar gasto')
  const stored = await page.evaluate((key) => localStorage.getItem(key), pendingKey(s.api.userId))
  expect(stored === null || !stored.includes('"12500"')).toBe(true)
  expect((await s.api.select('transactions', 'select=id')).body).toEqual([])
})

test('CP-NAV-020 · la API rechaza una categoría archivada con el código de integridad', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-020')
  const key = '48000000-0000-4000-8000-000000000048'
  expect((await s.api.patch('categories', `id=eq.${s.category}`, { archived_at: new Date().toISOString() })).status).toBe(200)
  const res = await s.api.rpc('create_transaction', body(s, key))
  expect(res.status).toBe(409)
  expect(res.body).toMatchObject({ code: '23503', message: 'la categoría no existe, no es tuya o está archivada' })
  expect((await s.api.select('transactions', `select=id,request_id&request_id=eq.${key}`)).body).toEqual([])
  expect((await s.api.select('ledger_entries', 'select=id,transaction_id')).body).toEqual([])
})

test('CP-NAV-021 y 023 · volver a Registrar muestra el pendiente y descartar lo elimina aunque se recargue', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-021')
  await fillExpense(page)
  await saveOffline(page)
  await page.context().setOffline(false)
  await navLink(page, 'Resumen').click()
  await expect(page).toHaveURL(/\/dashboard/)
  await navLink(page, 'Registrar').click()
  await expect(page).toHaveURL(/\/register/)
  const notice = page.getByTestId('register-pending-drafts')
  await expect(notice).toContainText('Tenés 1 movimiento sin guardar')
  await expect(notice).toContainText(`Gasto · $12.500,00 · ${CATEGORY} · 06/10/2026`)
  await expect(page.getByTestId('register-pending-draft-restore')).toHaveText('Recuperar')
  await expect(page.getByTestId('register-pending-draft-discard')).toHaveText('Descartar')

  await page.getByTestId('register-pending-draft-discard').click()
  await expect(page.getByTestId('register-pending-drafts')).toHaveCount(0)
  await page.reload()
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  await expect(page.getByTestId('register-pending-drafts')).toHaveCount(0)
  const stored = await page.evaluate((key) => localStorage.getItem(key), pendingKey(s.api.userId))
  expect(stored === null || stored === '[]').toBe(true)
  expect((await s.api.select('transactions', 'select=id')).body).toEqual([])
})

test('CP-NAV-022 · Recuperar detecta una transacción activa que ya se había guardado', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-022')
  const key = '53000000-0000-4000-8000-000000000053'
  expect((await s.api.rpc('create_transaction', body(s, key))).status).toBe(200)
  await page.addInitScript((fixed) => {
    Object.defineProperty(crypto, 'randomUUID', { configurable: true, value: () => fixed })
  }, key)
  await fillExpense(page)
  await saveOffline(page)
  await page.context().setOffline(false)
  await navLink(page, 'Resumen').click()
  await navLink(page, 'Registrar').click()
  await expect(page.getByTestId('register-pending-draft')).toHaveCount(1)
  await page.getByTestId('register-pending-draft-restore').click()
  await expect(page.getByText('Ese movimiento ya estaba guardado')).toBeVisible()
  await expect(page.getByText(SAVED)).toBeVisible()
  await expect(page.getByTestId('register-pending-draft')).toHaveCount(0)
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
  expect((await s.api.select('transactions', 'select=id')).body).toHaveLength(1)
})

test('CP-NAV-024 · cerrar sesión borra todos los pendientes del usuario', async ({ page, request }) => {
  const s = await setup(page, request, 'nav-024')
  await fillExpense(page)
  await saveOffline(page)
  await page.context().setOffline(false)
  await navLink(page, 'Resumen').click()
  await navLink(page, 'Registrar').click()
  await expect(page.getByTestId('register-pending-drafts')).toBeVisible()
  await page.goto('/settings')
  await page.getByTestId('settings-nav-logout').click()
  await expect(page).toHaveURL(/\/login/)
  expect(await page.evaluate((key) => localStorage.getItem(key), pendingKey(s.api.userId))).toBeNull()
  await page.getByTestId('login-form-email').fill(s.email)
  await page.getByTestId('login-form-password').fill(TEST_PASSWORD)
  await page.getByTestId('login-form-submit').click()
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  await expect(page.getByTestId('register-pending-drafts')).toHaveCount(0)
})
