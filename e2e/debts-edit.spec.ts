import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-86 (#285): editar una deuda (ADR-037). Eliminarla (US-87) tiene su propio spec.

type Api = Awaited<ReturnType<typeof apiSession>>

async function setup(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  const id = async (table: 'categories' | 'accounts', name: string) =>
    ((await api.select(table, `select=id&name=eq.${encodeURIComponent(name)}`)).body as { id: string }[])[0].id
  return { api, food: await id('categories', 'Comida y supermercado'), cash: await id('accounts', 'Efectivo') }
}

async function debt(api: Api, over: Record<string, unknown> = {}) {
  const res = await api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '10000.00', p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: '2026-08-15', p_notes: null, ...over,
  })
  expect(res.status).toBe(200)
  return res.body as string
}

async function sharedExpense(api: Api, s: { food: string; cash: string }) {
  const res = await api.rpc('create_transaction', {
    p_type: 'expense', p_amount: '40000.00', p_currency: 'ARS', p_fx_rate: null, p_category_id: s.food, p_account_id: s.cash,
    p_installments_count: 1, p_occurred_on: '2026-08-19', p_description: null, p_shared_persons: ['Sofía'], p_shared_amounts: ['15000.00'], p_request_id: null,
  })
  expect(res.status).toBe(200)
  const debts = (await api.select('debts', `select=id&transaction_id=eq.${res.body}`)).body as { id: string }[]
  return { transactionId: res.body as string, debtId: debts[0].id }
}

const row = (a: Api, id: string) =>
  a.select('debts', `select=person,amount_text:amount::text,notes,incurred_on,direction,fx_rate_text:fx_rate::text,amount_ars_text:amount_ars::text,status&id=eq.${id}`).then((r) => (r.body as Record<string, string>[])[0])

test('US-86 CA-1 · se edita una deuda suelta desde el listado y vuelve con los mismos filtros', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca1')
  const id = await debt(s.api, { p_notes: 'Nafta' })
  await page.goto('/debts?status=pending&direction=owed_to_me')
  const edit = page.getByTestId('debts-item-edit')
  await expect(edit).toHaveAttribute('aria-label', 'Editar deuda de Juan')
  const box = await edit.boundingBox()
  expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(44)
  await edit.click()
  await expect(page).toHaveURL(new RegExp(`/debts/${id}/edit\\?status=pending&direction=owed_to_me$`))
  await expect(page.getByTestId('edit-debt-person')).toHaveValue('Juan')
  await expect(page.getByTestId('edit-debt-amount')).toHaveValue('10.000,00')
  await expect(page.getByTestId('edit-debt-submit')).toBeDisabled() // sin cambios

  await page.getByTestId('edit-debt-person').fill('Juan Pérez')
  await page.getByTestId('edit-debt-amount').fill('12.000,50')
  await page.getByTestId('edit-debt-notes').fill('Combustible')
  await page.getByTestId('edit-debt-date').fill('2026-08-10')
  await page.getByTestId('edit-debt-direction-i-owe').click()
  await page.getByTestId('edit-debt-submit').click()

  await expect(page.getByTestId('debts-edited')).toHaveText(/Cambios guardados/)
  await expect(page).toHaveURL(/\/debts\?status=pending&direction=owed_to_me$/)
  expect(await row(s.api, id)).toMatchObject({ person: 'Juan Pérez', amount_text: '12000.50', notes: 'Combustible', incurred_on: '2026-08-10', direction: 'i_owe' })
  await page.goto('/debts')
  await expect(page.getByTestId('debts-item-person')).toHaveText('Juan Pérez')
  await expect(page.getByTestId('debts-item-direction')).toHaveText('Le debés')
  await expect(page.getByTestId('debts-total-i-owe')).toContainText('$12.000,50')
})

test('US-86 CA-2 · en US$ el tipo de cambio sigue congelado y la moneda es texto', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca2')
  const id = await debt(s.api, { p_direction: 'i_owe', p_person: 'Marcos', p_amount: '20.00', p_currency: 'USD', p_fx_rate: '1450.00' })
  await page.goto(`/debts/${id}/edit`)
  await expect(page.getByTestId('edit-debt-currency-readonly')).toHaveText('US$')
  await expect(page.getByTestId('edit-debt-fx-readonly')).toHaveText('TC 1.450,00')
  await expect(page.getByTestId('edit-debt-fx-rate')).toHaveCount(0)
  await page.getByTestId('edit-debt-amount').fill('30')
  await page.getByTestId('edit-debt-submit').click()
  await expect(page.getByTestId('debts-edited')).toBeVisible()
  expect(await row(s.api, id)).toMatchObject({ amount_text: '30.00', fx_rate_text: '1450.0000', amount_ars_text: '43500.00' })
})

test('US-86 CA-3 y CA-4 · la deuda de un gasto edita persona, monto y nota, con el tope del gasto', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca3')
  const { debtId } = await sharedExpense(s.api, s)
  await page.goto(`/debts/${debtId}/edit`)
  await expect(page.getByTestId('edit-debt-date')).toHaveCount(0)
  await expect(page.getByTestId('edit-debt-direction')).toHaveCount(0)
  await expect(page.getByTestId('edit-debt-readonly-note')).toContainText('la fecha y la dirección son las del gasto')

  await page.getByTestId('edit-debt-amount').fill('40.000,01')
  await expect(page.getByTestId('edit-debt-amount-error')).toHaveText('No puede superar el monto del gasto ($40.000,00)')
  await expect(page.getByTestId('edit-debt-submit')).toBeDisabled()
  await page.getByTestId('edit-debt-amount').fill('20000')
  await page.getByTestId('edit-debt-person').fill('Sofía G.')
  await page.getByTestId('edit-debt-notes').fill('Cena')
  await page.getByTestId('edit-debt-submit').click()
  await expect(page.getByTestId('debts-edited')).toBeVisible()
  expect(await row(s.api, debtId)).toMatchObject({ person: 'Sofía G.', amount_text: '20000.00', notes: 'Cena', incurred_on: '2026-08-19', direction: 'owed_to_me' })

  // Por la API, la fecha y la dirección del gasto no se cambian y el tope vale igual (C6).
  const date = await s.api.rpc('update_debt', { p_debt_id: debtId, p_person: 'Sofía', p_amount: '100.00', p_incurred_on: '2026-08-01' })
  expect(date.body).toMatchObject({ code: '23514', message: 'La fecha y la dirección de una deuda de un gasto no se pueden cambiar' })
  const cap = await s.api.rpc('update_debt', { p_debt_id: debtId, p_person: 'Sofía', p_amount: '40000.01' })
  expect(cap.body).toMatchObject({ code: '23514', message: 'I7: la deuda no puede superar el monto del gasto' })
})

test('US-86 CA-5 · las validaciones de la pantalla tienen los mensajes de «Nueva deuda»', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca5')
  const id = await debt(s.api)
  await page.goto(`/debts/${id}/edit`)
  await page.getByTestId('edit-debt-person').fill('   ')
  await expect(page.getByTestId('edit-debt-person-error')).toHaveText('Ingresá el nombre de la persona')
  await page.getByTestId('edit-debt-person').fill('Juan')
  for (const [text, message] of [['0', 'El monto debe ser mayor a cero'], ['10,123', 'El monto admite hasta 2 decimales'], ['abc', 'Ingresá un número válido']] as const) {
    await page.getByTestId('edit-debt-amount').fill(text)
    await expect(page.getByTestId('edit-debt-amount-error')).toHaveText(message)
    await expect(page.getByTestId('edit-debt-submit')).toBeDisabled()
  }
  await page.getByTestId('edit-debt-amount').fill('10000')
  await page.getByTestId('edit-debt-date').fill('2099-01-01')
  await expect(page.getByTestId('edit-debt-date-error')).toHaveText('La fecha no puede ser futura')
  const tooLong = await s.api.rpc('update_debt', { p_debt_id: id, p_person: 'x'.repeat(61), p_amount: '1.00' })
  expect(tooLong.body).toMatchObject({ code: '23514', message: 'La persona admite hasta 60 caracteres' })
  expect((await row(s.api, id)).person).toBe('Juan')
})

test('US-86 CA-6 · una deuda saldada no se edita: primero se vuelve a pendiente', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca6')
  const id = await debt(s.api)
  expect((await s.api.rpc('settle_debt', { p_debt_id: id })).status).toBe(204)

  await page.goto('/debts?status=settled')
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await expect(page.getByTestId('debts-item-edit')).toHaveCount(0)
  await page.goto(`/debts/${id}/edit`)
  await expect(page.getByTestId('edit-debt-blocked-settled')).toHaveText('Una deuda saldada no se puede editar. Volvela a pendiente desde Deudas.')
  await expect(page.getByTestId('edit-debt-person')).toHaveCount(0)

  const edit = await s.api.rpc('update_debt', { p_debt_id: id, p_person: 'Juan', p_amount: '1.00' })
  expect(edit.body).toMatchObject({ code: '23514', message: 'Una deuda saldada no se puede editar: volvela a pendiente primero' })

  await page.goto('/debts?status=settled')
  await page.getByTestId('debts-item-reopen').click()
  await expect(page.getByTestId('debts-reopened')).toBeVisible()
  await page.goto(`/debts/${id}/edit`)
  await expect(page.getByTestId('edit-debt-person')).toBeVisible()
})

test('US-86 CA-7 · si falla guardar se muestra el error, se conserva lo escrito y reintentar guarda', async ({ page, request }) => {
  const s = await setup(page, request, 'us86-ca7')
  const id = await debt(s.api)
  let calls = 0
  await page.route('**/rest/v1/rpc/update_debt', (route) => (calls++ === 0 ? route.abort() : route.continue()))
  await page.goto(`/debts/${id}/edit`)
  await page.getByTestId('edit-debt-amount').fill('12000')
  await page.getByTestId('edit-debt-submit').click()
  await expect(page.getByTestId('edit-debt-error')).toContainText('No pudimos guardar los cambios')
  await expect(page.getByTestId('edit-debt-amount')).toHaveValue('12000')
  await page.getByTestId('edit-debt-submit').click()
  await expect(page.getByTestId('debts-edited')).toBeVisible()
  expect((await row(s.api, id)).amount_text).toBe('12000.00')
})

test('US-86 CA-8 · otro usuario y anon no pueden editar la deuda ajena (C7)', async ({ browser, request }) => {
  const pageA = await browser.newPage()
  const pageB = await browser.newPage()
  const a = await setup(pageA, request, 'us86-ca8-a')
  const b = await setup(pageB, request, 'us86-ca8-b')
  const id = await debt(a.api)

  await pageB.goto(`/debts/${id}/edit`)
  await expect(pageB.getByTestId('edit-debt-not-found')).toHaveText('No encontramos esta deuda.')
  await pageB.goto('/debts/no-es-un-uuid/edit')
  await expect(pageB.getByTestId('edit-debt-not-found')).toBeVisible()

  const edit = await b.api.rpc('update_debt', { p_debt_id: id, p_person: 'Hack', p_amount: '1.00' })
  expect(edit.status).toBe(404)
  expect(edit.body).toMatchObject({ code: 'PT404', message: 'Deuda no encontrada' })
  const anon = await b.api.rpc('update_debt', { p_debt_id: id, p_person: 'Hack', p_amount: '1.00' }, { asAnon: true })
  expect(anon.status).toBe(401)
  expect(anon.body).toMatchObject({ code: '42501' })
  expect((await b.api.patch('debts', `id=eq.${id}`, { amount: 1 })).status).toBe(403) // ADR-037: sin update directo
  expect((await row(a.api, id)).person).toBe('Juan')
})
