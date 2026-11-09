import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-84 (#284), ADR-043: editar un movimiento. H = mes de hoy en Argentina; H−1 = mes anterior.
// Las fechas son relativas a hoy: los criterios no dependen del día en que se corre (el reloj del servidor
// es el real, ADR-021). Los casos de dominio con `today` fijo están en tests/domain/transaction-edit.test.ts.

type Api = Awaited<ReturnType<typeof apiSession>>

const argentinaYmd = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date())
/** Mes H+offset como `AAAA-MM`. */
function month(offset: number) {
  const [y, m] = argentinaYmd().split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + offset, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}
const day = (offset: number, d = 10) => `${month(offset)}-${String(d).padStart(2, '0')}`
const H = month(0)
const H1 = month(-1)
const H2 = month(-2)

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return {
    email,
    api,
    food: await id('categories', 'Comida y supermercado'),
    other: await id('categories', 'Otros'),
    cash: await id('accounts', 'Efectivo'),
    visa: await id('accounts', 'Tarjeta de crédito'),
    debit: await id('accounts', 'Tarjeta de débito'),
  }
}

async function addTx(
  api: Api,
  o: { type?: 'expense' | 'income'; amount: string; currency?: 'ARS' | 'USD'; fx?: string; category: string | null; account: string; installments?: number; on: string },
) {
  const res = await api.rpc('create_transaction', {
    p_type: o.type ?? 'expense', p_amount: o.amount, p_currency: o.currency ?? 'ARS', p_fx_rate: o.fx ?? null,
    p_category_id: o.category, p_account_id: o.account, p_installments_count: o.installments ?? 1, p_occurred_on: o.on,
    p_description: null, p_request_id: null,
  })
  expect(res.status).toBe(200)
  return res.body as string
}

const ledger = async (api: Api, id: string) =>
  (await api.select('ledger_entries', `select=period,installment_number,amount_text:amount::text,amount_ars_text:amount_ars::text&transaction_id=eq.${id}&order=installment_number`))
    .body as { period: string; installment_number: number; amount_text: string; amount_ars_text: string }[]

const editUrl = (id: string, period = H) => `/transactions/${id}/edit?period=${period}`
const save = async (page: Page) => page.getByTestId('edit-transaction-submit').click()

test('CA-1 y CA-26 · cada fila activa tiene «Editar», una eliminada no, y se vuelve al mismo período', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca1')
  const id = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.visa, installments: 3, on: day(-1) })

  await page.goto(`/transactions?period=${H}`)
  const rows = page.getByTestId('transactions-item')
  await expect(rows).toHaveCount(1) // la cuota de H
  await expect(rows.getByTestId('transactions-item-installment')).toHaveText('2/3')
  const edit = page.getByTestId('transactions-item-edit')
  await expect(edit).toHaveAttribute('aria-label', /^Editar /) // ADR-052: la fila entera, con el nombre del movimiento
  const box = await edit.boundingBox()
  expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44) // CA-30

  await edit.click()
  await expect(page).toHaveURL(new RegExp(`/transactions/${id}/edit\\?period=${H}$`))
  await expect(page.getByTestId('edit-transaction-amount')).toHaveValue('30.000,00') // el total, no la cuota
  await expect(page.getByTestId('edit-transaction-date')).toHaveValue(day(-1))
  await expect(page.getByTestId('edit-transaction-installments-chip-3')).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('transactions-nav-dashboard')).toHaveAttribute('aria-current', 'page') // CA-26: la barra marca Resumen

  await page.getByTestId('edit-transaction-cancel').click() // sin cambios: vuelve directo
  await expect(page).toHaveURL(new RegExp(`/transactions\\?period=${H}$`))

  await s.api.rpc('delete_transaction', { p_transaction_id: id })
  await page.goto(`/transactions?period=${H}&view=deleted`)
  await expect(page.getByTestId('transactions-item')).toHaveCount(1)
  await expect(page.getByTestId('transactions-item-edit')).toHaveCount(0)
})

test('CA-2 · tipo, moneda y tipo de cambio se ven como texto y la RPC no recibe esos parámetros', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca2')
  const id = await addTx(s.api, { amount: '100.00', currency: 'USD', fx: '1450.00', category: s.food, account: s.cash, on: day(0, 1) })
  await page.goto(editUrl(id))
  await expect(page.getByTestId('edit-transaction-type-readonly')).toHaveText('Gasto')
  await expect(page.getByTestId('edit-transaction-currency-readonly')).toHaveText('US$')
  await expect(page.getByTestId('edit-transaction-fx-readonly')).toHaveText('TC 1.450,00')
  await expect(page.getByTestId('edit-transaction-readonly-note')).toContainText('no se pueden cambiar')
  await expect(page.locator('input[name="currency"], [data-testid^="edit-transaction-currency-"]:not([data-testid$="readonly"])')).toHaveCount(0)

  const withCurrency = await s.api.rpc('update_transaction', {
    p_transaction_id: id, p_amount: '120.00', p_currency: 'ARS', p_category_id: s.food, p_account_id: s.cash,
    p_installments_count: 1, p_occurred_on: day(0, 1),
  })
  expect(withCurrency.status).toBe(404)
  expect(withCurrency.body).toMatchObject({ code: 'PGRST202' })
})

test('CA-3 · cambiar el monto de un gasto de este mes se guarda sin diálogo y el Resumen lo muestra', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca3')
  const id = await addTx(s.api, { amount: '10000.00', category: s.food, account: s.cash, on: day(0, 1) })
  await page.goto(editUrl(id))
  await expect(page.getByTestId('edit-transaction-submit')).toBeDisabled() // CA-22: sin cambios

  await page.getByTestId('edit-transaction-amount').fill('12.500,00')
  await expect(page.getByTestId('edit-transaction-submit')).toBeEnabled()
  await save(page)

  await expect(page.getByTestId('edit-transaction-closed-dialog')).toHaveCount(0)
  await expect(page.getByTestId('transactions-edited')).toHaveText(/Cambios guardados/)
  await expect(page).toHaveURL(new RegExp(`/transactions\\?period=${H}$`))
  await expect(page.getByTestId('transactions-list')).toContainText('$12.500,00')

  await page.goto(`/dashboard?period=${H}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$12.500,00')
  const entries = await ledger(s.api, id)
  expect(entries).toEqual([expect.objectContaining({ installment_number: 1, amount_text: '12500.00' })])
})

test('CA-4 · el resto de las cuotas se reparte con C3 y la vista previa lo muestra antes de guardar', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca4')
  const id = await addTx(s.api, { amount: '100000.00', category: s.food, account: s.visa, installments: 3, on: day(0, 1) })
  await page.goto(editUrl(id))
  await page.getByTestId('edit-transaction-amount').fill('100001')
  await expect(page.getByTestId('edit-transaction-installments-preview-summary')).toContainText('3 cuotas de $33.333,66')
  await expect(page.getByTestId('edit-transaction-installments-preview-last')).toContainText('$33.333,68')
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()

  const entries = await ledger(s.api, id)
  expect(entries.map((e) => e.amount_text)).toEqual(['33333.66', '33333.66', '33333.68'])
})

test('CA-5 · de 6 cuotas a 3: exactamente 3 imputaciones numeradas de 1 a 3', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca5')
  const id = await addTx(s.api, { amount: '120000.00', category: s.food, account: s.visa, installments: 6, on: day(0, 1) })
  await page.goto(editUrl(id))
  await page.getByTestId('edit-transaction-installments-chip-3').click()
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  const entries = await ledger(s.api, id)
  expect(entries.map((e) => [e.installment_number, e.period.slice(0, 7), e.amount_text])).toEqual([
    [1, H, '40000.00'], [2, month(1), '40000.00'], [3, month(2), '40000.00'],
  ])
})

test('CA-6 y CA-7 · una fecha a un mes cerrado y un monto en un mes cerrado abren el aviso; «Cancelar» no guarda', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca6')
  const idCuotas = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.visa, installments: 3, on: day(0, 1) })
  const idSimple = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.cash, on: day(-1) })

  // CA-6: la compra de H pasa a H−1: aparece una imputación en un mes cerrado.
  await page.goto(editUrl(idCuotas))
  await page.getByTestId('edit-transaction-date').fill(day(-1))
  await save(page)
  const dialog = page.getByTestId('edit-transaction-closed-dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading')).toHaveText('Esto cambia meses que ya pasaron')
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText('de $0,00 a $10.000,00')
  await expect(page.getByTestId('edit-transaction-closed-cancel')).toBeFocused()
  await page.getByTestId('edit-transaction-closed-cancel').click()
  expect((await ledger(s.api, idCuotas)).map((e) => e.period.slice(0, 7))).toEqual([H, month(1), month(2)]) // nada se guardó

  // CA-7: el monto de un gasto de H−1; «Guardar igual» guarda.
  await page.goto(editUrl(idSimple, H1))
  await page.getByTestId('edit-transaction-amount').fill('35000')
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText('de $30.000,00 a $35.000,00')
  await page.getByTestId('edit-transaction-closed-confirm').click()
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  await expect(page).toHaveURL(new RegExp(`/transactions\\?period=${H1}$`)) // CA-26
  await page.goto(`/dashboard?period=${H1}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$35.000,00')
})

test('CA-8 a CA-11 · categoría, monto y categoría, y cuenta en un mes cerrado', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca8')
  const compra = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.visa, installments: 3, on: day(-2) })
  const unaCuota = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.cash, on: day(-1) })

  await page.goto(editUrl(compra, H2))
  await page.getByTestId('edit-transaction-category-chip-otros').click()
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H2}`)).toHaveText(/categoría: de Comida y supermercado a Otros/)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toHaveText(/categoría: de Comida y supermercado a Otros/)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H}`)).toHaveCount(0) // H no está cerrado
  await expect(page.getByTestId(`edit-transaction-closed-period-${H2}`)).not.toContainText('de $')
  await page.getByTestId('edit-transaction-closed-confirm').click()
  await expect(page.getByTestId('transactions-edited')).toBeVisible()

  await page.goto(editUrl(unaCuota, H1))
  await page.getByTestId('edit-transaction-amount').fill('35000')
  await page.getByTestId('edit-transaction-category-chip-otros').click()
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText(
    'de $30.000,00 a $35.000,00 · categoría: de Comida y supermercado a Otros',
  )
  await page.getByTestId('edit-transaction-closed-cancel').click()

  await page.getByTestId('edit-transaction-amount').fill('30000')
  await page.getByTestId('edit-transaction-category-chip-comida-y-supermercado').click()
  await page.getByTestId('edit-transaction-account-chip-tarjeta-de-debito').click()
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText('cuenta: de Efectivo a Tarjeta de débito')
})

test('CA-12 y CA-13 · solo la nota, o moverse dentro del mismo mes, se guarda sin aviso', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca12')
  const id = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.cash, on: day(-1, 5) })
  await page.goto(editUrl(id, H1))
  await page.getByTestId('edit-transaction-description').fill('Heladera')
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  await expect(page.getByTestId('edit-transaction-closed-dialog')).toHaveCount(0)

  await page.goto(editUrl(id, H1))
  await page.getByTestId('edit-transaction-date').fill(day(-1, 20))
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  await expect(page.getByTestId('edit-transaction-closed-dialog')).toHaveCount(0)

  const compra = await addTx(s.api, { amount: '100000.00', category: s.food, account: s.visa, installments: 3, on: day(-1) })
  await page.goto(editUrl(compra, H1))
  await page.getByTestId('edit-transaction-amount').fill('100.000,01')
  await save(page) // solo cambia la última cuota, que cae en un mes futuro
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  await expect(page.getByTestId('edit-transaction-closed-dialog')).toHaveCount(0)
})

test('CA-15 y CA-16 · en USD el tipo de cambio sigue congelado y el aviso va en pesos', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca15')
  await s.api.rpc('upsert_fx_rate', { p_period: `${H}-01`, p_ars_per_usd: '1500.00' }) // hoy el de referencia es otro
  const hoy = await addTx(s.api, { amount: '100.00', currency: 'USD', fx: '1000.00', category: s.food, account: s.cash, on: day(0, 1) })
  const cerrado = await addTx(s.api, { amount: '100.00', currency: 'USD', fx: '1000.00', category: s.food, account: s.cash, on: day(-1) })

  await page.goto(editUrl(hoy))
  await page.getByTestId('edit-transaction-amount').fill('120')
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  const row = (await s.api.select('transactions', `select=amount_text:amount::text,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text&id=eq.${hoy}`)).body
  expect(row).toEqual([{ amount_text: '120.00', fx_rate_text: '1000.0000', amount_ars_text: '120000.00' }])
  expect(await ledger(s.api, hoy)).toEqual([expect.objectContaining({ amount_text: '120.00', amount_ars_text: '120000.00' })])

  await page.goto(editUrl(cerrado, H1))
  await page.getByTestId('edit-transaction-amount').fill('120')
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText('de $100.000,00 a $120.000,00')
})

test('CA-17 · un ingreso no muestra categoría ni cuotas y se edita; por la API, con cuotas se rechaza', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca17')
  const id = await addTx(s.api, { type: 'income', amount: '50000.00', category: null, account: s.cash, on: day(-1) })
  await page.goto(editUrl(id, H1))
  await expect(page.getByTestId('edit-transaction-type-readonly')).toHaveText('Ingreso')
  await expect(page.getByTestId('edit-transaction-category')).toHaveCount(0)
  await expect(page.getByTestId('edit-transaction-installments')).toHaveCount(0)
  await page.getByTestId('edit-transaction-amount').fill('55000')
  await save(page)
  await expect(page.getByTestId(`edit-transaction-closed-period-${H1}`)).toContainText('de $50.000,00 a $55.000,00')
  await page.getByTestId('edit-transaction-closed-confirm').click()
  await expect(page.getByTestId('transactions-edited')).toBeVisible()

  const rejected = await s.api.rpc('update_transaction', {
    p_transaction_id: id, p_amount: '55000.00', p_category_id: null, p_account_id: s.cash, p_installments_count: 3, p_occurred_on: day(-1),
  })
  expect(rejected.status).toBe(400)
  expect(rejected.body).toMatchObject({ code: '23514', message: 'I6: las cuotas solo aplican a gastos con cuenta credit_card' })
})

test('CA-18 · pasar una compra en cuotas a efectivo reinicia las cuotas a 1 y lo avisa; por la API, se rechaza', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca18')
  const id = await addTx(s.api, { amount: '6000.00', category: s.food, account: s.visa, installments: 6, on: day(0, 1) })
  await page.goto(editUrl(id))
  await page.getByTestId('edit-transaction-account-chip-efectivo').click()
  await expect(page.getByTestId('edit-transaction-installments-reset')).toBeVisible()
  await expect(page.getByTestId('edit-transaction-installments')).toHaveCount(0)

  const rejected = await s.api.rpc('update_transaction', {
    p_transaction_id: id, p_amount: '6000.00', p_category_id: s.food, p_account_id: s.cash, p_installments_count: 6, p_occurred_on: day(0, 1),
  })
  expect(rejected.body).toMatchObject({ code: '23514', message: 'I6: las cuotas solo aplican a gastos con cuenta credit_card' })
  expect(await ledger(s.api, id)).toHaveLength(6) // atomicidad: nada cambió
})

test('CA-19 · las validaciones de la pantalla tienen los mensajes de Registrar y no llaman a la base', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca19')
  const id = await addTx(s.api, { amount: '10000.00', category: s.food, account: s.visa, on: day(0, 1) })
  await page.goto(editUrl(id))
  const amount = page.getByTestId('edit-transaction-amount')
  const error = page.getByTestId('edit-transaction-amount-error')
  for (const [text, message] of [
    ['', 'El monto debe ser mayor a cero'],
    ['0', 'El monto debe ser mayor a cero'],
    ['-5', 'El monto debe ser mayor a cero'],
    ['10,123', 'El monto admite hasta 2 decimales'],
  ] as const) {
    await amount.fill(text)
    await expect(error).toHaveText(message)
    await expect(page.getByTestId('edit-transaction-submit')).toBeDisabled()
  }
  await amount.fill('0,11')
  await page.getByTestId('edit-transaction-installments-chip-12').click()
  await expect(page.getByTestId('edit-transaction-installments-error')).toHaveText('Con ese monto, cada cuota daría menos de 0,01')

  await amount.fill('10000')
  await page.getByTestId('edit-transaction-installments-chip-1').click()
  await page.getByTestId('edit-transaction-date').fill(day(1, 1)) // un mes adelante: futura
  await expect(page.getByTestId('edit-transaction-date-error')).toHaveText('La fecha no puede ser futura')

  const tomorrow = await s.api.rpc('update_transaction', {
    p_transaction_id: id, p_amount: '10000.00', p_category_id: s.food, p_account_id: s.visa, p_installments_count: 1, p_occurred_on: day(1, 1),
  })
  expect(tomorrow.body).toMatchObject({ code: '23514', message: 'FR-06: la fecha no puede ser posterior a hoy' })
  const tiny = await s.api.rpc('update_transaction', {
    p_transaction_id: id, p_amount: '0.11', p_category_id: s.food, p_account_id: s.visa, p_installments_count: 12, p_occurred_on: day(0, 1),
  })
  expect(tiny.body).toMatchObject({ code: '23514', message: 'I4: cada cuota debe ser al menos 0,01' })
  expect(await ledger(s.api, id)).toEqual([expect.objectContaining({ amount_text: '10000.00' })])
})

test('CA-20 · una categoría archivada se ve con «(archivada)», se puede guardar sin tocarla y no se ofrece otra', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca20')
  const id = await addTx(s.api, { amount: '10000.00', category: s.other, account: s.cash, on: day(0, 1) })
  expect((await s.api.patch('categories', `id=eq.${s.other}`, { archived_at: new Date().toISOString() })).status).toBe(200)
  expect((await s.api.patch('categories', `id=eq.${s.food}`, { archived_at: new Date().toISOString() })).status).toBe(200)

  await page.goto(editUrl(id))
  const archived = page.getByTestId('edit-transaction-category-chip-otros')
  await expect(archived).toContainText('Otros (archivada)')
  await expect(archived).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByTestId('edit-transaction-category-chip-comida-y-supermercado')).toHaveCount(0) // otra archivada: no se ofrece

  await page.getByTestId('edit-transaction-amount').fill('11000')
  await save(page) // sin tocar la categoría
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
})

test('CA-21 · eliminado, de una suscripción y compartido muestran su aviso y no el formulario', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca21')
  const deleted = await addTx(s.api, { amount: '1000.00', category: s.food, account: s.cash, on: day(0, 1) })
  await s.api.rpc('delete_transaction', { p_transaction_id: deleted })
  await page.goto(editUrl(deleted))
  await expect(page.getByTestId('edit-transaction-blocked-deleted')).toHaveText('Este movimiento está eliminado. Restauralo para poder editarlo.')
  await expect(page.getByTestId('edit-transaction-amount')).toHaveCount(0)
  await expect(page.getByTestId('edit-transaction-blocked-back')).toHaveAttribute('href', `/transactions?period=${H}`)

  const shared = await s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '40000.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: s.food, p_account_id: s.cash,
    p_installments_count: 1, p_occurred_on: day(0, 1), p_description: null, p_shared_persons: ['Sofía'], p_shared_amounts: ['15000.00'], p_request_id: null,
  })
  await page.goto(editUrl(shared.body as string))
  await expect(page.getByTestId('edit-transaction-blocked-shared')).toHaveText(
    'Este gasto está compartido con Sofía. Para cambiarlo, eliminalo y cargalo de nuevo.',
  )
  const apiShared = await s.api.rpc('update_transaction', {
    p_transaction_id: shared.body, p_amount: '41000.00', p_category_id: s.food, p_account_id: s.cash, p_installments_count: 1, p_occurred_on: day(0, 1),
  })
  expect(apiShared.body).toMatchObject({ code: '23514', message: 'Un movimiento compartido no se puede editar' })
  const apiDeleted = await s.api.rpc('update_transaction', {
    p_transaction_id: deleted, p_amount: '1100.00', p_category_id: s.food, p_account_id: s.cash, p_installments_count: 1, p_occurred_on: day(0, 1),
  })
  expect(apiDeleted.body).toMatchObject({ code: '23514', message: 'Un movimiento eliminado no se puede editar' })
})

test('CA-21 · una compra empezada (US-80) muestra su aviso y la base la rechaza', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-started')
  const started = await s.api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '120000.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: s.food, p_account_id: s.visa,
    p_installments_count: 12, p_occurred_on: day(-4, 1), p_description: null, p_installments_paid: 4, p_request_id: null,
  })
  expect(started.status).toBe(200)
  await page.goto(editUrl(started.body as string))
  await expect(page.getByTestId('edit-transaction-blocked-started')).toHaveText(
    'Esta compra ya venía en curso al importarla: solo tiene las cuotas que faltan. Para cambiarla, eliminala y cargala de nuevo.',
  )
  await expect(page.getByTestId('edit-transaction-amount')).toHaveCount(0)
  const api = await s.api.rpc('update_transaction', {
    p_transaction_id: started.body, p_amount: '130000.00', p_category_id: s.food, p_account_id: s.visa, p_installments_count: 12, p_occurred_on: day(-4, 1),
  })
  expect(api.body).toMatchObject({ code: '23514', message: 'Una compra empezada no se puede editar' })
})

test('CA-22 · «Guardar cambios» sigue los cambios y atrás pide confirmar si hay algo sin guardar', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca22')
  const id = await addTx(s.api, { amount: '12500.00', category: s.food, account: s.cash, on: day(0, 1) })
  await page.goto(editUrl(id))
  const submit = page.getByTestId('edit-transaction-submit')
  await expect(submit).toBeDisabled()
  await page.getByTestId('edit-transaction-amount').fill('13000')
  await expect(submit).toBeEnabled()
  await page.getByTestId('edit-transaction-amount').fill('12.500,00') // vuelve al valor original, escrito distinto
  await expect(submit).toBeDisabled()

  await page.getByTestId('edit-transaction-description').fill('Nota nueva')
  await page.getByTestId('edit-transaction-back').click()
  const leave = page.getByTestId('edit-transaction-leave-dialog')
  await expect(leave).toContainText('¿Salir sin guardar los cambios?')
  await page.getByTestId('edit-transaction-leave-stay').click()
  await expect(leave).toHaveCount(0)
  await expect(page.getByTestId('edit-transaction-description')).toHaveValue('Nota nueva')

  await page.getByTestId('edit-transaction-cancel').click()
  await page.getByTestId('edit-transaction-leave-confirm').click()
  await expect(page).toHaveURL(new RegExp(`/transactions\\?period=${H}$`))
  expect((await s.api.select('transactions', `select=description&id=eq.${id}`)).body).toEqual([{ description: null }])
})

test('CA-23 · si falla guardar se muestra el error, se conserva lo escrito y reintentar guarda', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca23')
  const id = await addTx(s.api, { amount: '10000.00', category: s.food, account: s.cash, on: day(0, 1) })
  let calls = 0
  await page.route('**/rest/v1/rpc/update_transaction', (route) => (calls++ === 0 ? route.abort() : route.continue()))
  await page.goto(editUrl(id))
  await page.getByTestId('edit-transaction-amount').fill('12000')
  await save(page)
  await expect(page.getByTestId('edit-transaction-error')).toContainText('No pudimos guardar los cambios')
  await expect(page.getByTestId('edit-transaction-amount')).toHaveValue('12000')
  await expect(page.getByTestId('edit-transaction-submit')).toBeEnabled()
  await save(page)
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  expect(await ledger(s.api, id)).toEqual([expect.objectContaining({ amount_text: '12000.00' })])
})

test('CA-24 y CA-25 · por la API, editar dos veces o dos a la vez deja una sola versión consistente', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca24')
  const id = await addTx(s.api, { amount: '90000.00', category: s.food, account: s.visa, installments: 3, on: day(0, 1) })
  const edit = (amount: string, installments: number) =>
    s.api.rpc('update_transaction', {
      p_transaction_id: id, p_amount: amount, p_category_id: s.food, p_account_id: s.visa, p_installments_count: installments, p_occurred_on: day(0, 1),
    })

  expect((await edit('100001.00', 3)).status).toBe(200)
  const first = (await ledger(s.api, id)).map(({ period, installment_number, amount_text, amount_ars_text }) => [period, installment_number, amount_text, amount_ars_text])
  expect((await edit('100001.00', 3)).status).toBe(200)
  const second = (await ledger(s.api, id)).map(({ period, installment_number, amount_text, amount_ars_text }) => [period, installment_number, amount_text, amount_ars_text])
  expect(second).toEqual(first) // CA-24

  const [a, b] = await Promise.all([edit('120000.00', 4), edit('60000.00', 2)])
  expect([a.status, b.status]).toEqual([200, 200])
  const tx = (await s.api.select('transactions', `select=amount_text:amount::text,installments_count&id=eq.${id}`)).body as { amount_text: string; installments_count: number }[]
  const entries = await ledger(s.api, id)
  expect(entries).toHaveLength(tx[0].installments_count) // I2
  expect(entries.reduce((sum, e) => sum + Number(e.amount_text) * 100, 0)).toBe(Number(tx[0].amount_text) * 100) // I1
  expect(entries.map((e) => e.installment_number)).toEqual(entries.map((_, i) => i + 1))

  // Si una baja confirma antes, la edición se rechaza y nada cambia.
  await s.api.rpc('delete_transaction', { p_transaction_id: id })
  const late = await edit('1.00', 1)
  expect(late.body).toMatchObject({ code: '23514', message: 'Un movimiento eliminado no se puede editar' })
})

test('CA-27 · con la sesión de otro usuario no se encuentra el movimiento ni se puede editar por la API (C7)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await setup(pageA, request, 'us84-ca27-a')
  const b = await setup(pageB, request, 'us84-ca27-b')
  const idA = await addTx(a.api, { amount: '10000.00', category: a.food, account: a.cash, on: day(0, 1) })

  await pageB.goto(editUrl(idA))
  await expect(pageB.getByTestId('edit-transaction-not-found')).toHaveText('No encontramos este movimiento.')
  await pageB.goto(editUrl('no-es-un-uuid'))
  await expect(pageB.getByTestId('edit-transaction-not-found')).toBeVisible()

  const attempt = await b.api.rpc('update_transaction', {
    p_transaction_id: idA, p_amount: '1.00', p_category_id: b.food, p_account_id: b.cash, p_installments_count: 1, p_occurred_on: day(0, 1),
  })
  expect(attempt.body).toMatchObject({ code: '23503', message: 'la transacción no existe o no te pertenece' })
  const anon = await b.api.rpc('update_transaction', {
    p_transaction_id: idA, p_amount: '1.00', p_category_id: b.food, p_account_id: b.cash, p_installments_count: 1, p_occurred_on: day(0, 1),
  }, { asAnon: true })
  expect(anon.status).toBe(401)
  expect(anon.body).toMatchObject({ code: '42501' })
  expect((await b.api.patch('transactions', `id=eq.${idA}`, { amount: 1 })).status).toBe(403) // C4: sin update directo
  expect((await a.api.select('transactions', `select=amount_text:amount::text&id=eq.${idA}`)).body).toEqual([{ amount_text: '10000.00' }])
})

test('CA-28 · el movimiento eliminado no suma y el editado sí, en su mes', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca28')
  const borrado = await addTx(s.api, { amount: '5000.00', category: s.food, account: s.cash, on: day(-1, 3) })
  await s.api.rpc('delete_transaction', { p_transaction_id: borrado })
  const activo = await addTx(s.api, { amount: '30000.00', category: s.food, account: s.cash, on: day(-1, 4) })
  await page.goto(editUrl(activo, H1))
  await page.getByTestId('edit-transaction-amount').fill('35000')
  await save(page)
  await page.getByTestId('edit-transaction-closed-confirm').click()
  await expect(page.getByTestId('transactions-edited')).toBeVisible()
  await page.goto(`/dashboard?period=${H1}`)
  await expect(page.getByTestId('dashboard-total-expenses')).toHaveText('$35.000,00')
})

test('CA-30 · en 390 px no hay scroll horizontal y el diálogo devuelve el foco al botón que lo abrió', async ({ page, request }) => {
  const s = await setup(page, request, 'us84-ca30')
  const id = await addTx(s.api, { amount: '10000.00', category: s.food, account: s.cash, on: day(-1) })
  await page.goto(editUrl(id, H1))
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await page.getByTestId('edit-transaction-amount').fill('11000')
  await page.getByTestId('edit-transaction-submit').focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByTestId('edit-transaction-closed-dialog')
  await expect(dialog).toBeVisible()
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true) // Tab atrapado
  }
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByTestId('edit-transaction-submit')).toBeFocused()
})
