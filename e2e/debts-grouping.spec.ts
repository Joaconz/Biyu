import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-91 (#333): las deudas de una misma persona van juntas, con el neto por moneda.

type Api = Awaited<ReturnType<typeof apiSession>>
const debt = (api: Api, over: Record<string, unknown>) =>
  api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: 'Juan', p_amount: '10000.00', p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: '2026-08-15', p_notes: null, ...over,
  })

async function userWithApi(page: Page, request: APIRequestContext, tag: string) {
  const { email } = await signUpAndSkipSetup(page, tag)
  return apiSession(request, email)
}

test('US-91 CA-1 · «Juan», «juan» y «Juán» quedan en un solo grupo, plegado, que se despliega al tocarlo', async ({ page, request }) => {
  const api = await userWithApi(page, request, 'us91-ca1')
  for (const person of ['Juan', 'juan', 'Juán']) expect((await debt(api, { p_person: person })).status).toBe(200)
  expect((await debt(api, { p_person: 'Sofía' })).status).toBe(200)

  await page.goto('/debts')
  await expect(page.getByTestId('debts-list')).toBeVisible()
  const group = page.getByTestId('debts-group-juan')
  await expect(group).toHaveCount(1)
  await expect(group.getByTestId('debts-group-count')).toHaveText('3 deudas')
  // Plegado: no se ven las filas del grupo; Sofía, con una sola deuda, es una fila común.
  await expect(group.getByTestId('debts-item')).toHaveCount(0)
  await expect(page.getByTestId('debts-item')).toHaveCount(1)
  await expect(page.getByTestId('debts-item-person')).toHaveText('Sofía')

  await group.getByTestId('debts-group-toggle').click()
  await expect(group.getByTestId('debts-group-toggle')).toHaveAttribute('aria-expanded', 'true')
  await expect(group.getByTestId('debts-item')).toHaveCount(3)
  await group.getByTestId('debts-group-toggle').click()
  await expect(group.getByTestId('debts-item')).toHaveCount(0)
})

test('US-91 CA-2 · el neto de un grupo con ARS y US$ muestra las dos monedas, sin convertir', async ({ page, request }) => {
  const api = await userWithApi(page, request, 'us91-ca2')
  expect((await debt(api, { p_person: 'Juan', p_amount: '10000.00' })).status).toBe(200)
  expect((await debt(api, { p_person: 'juan', p_direction: 'i_owe', p_amount: '4000.00' })).status).toBe(200)
  expect((await debt(api, { p_person: 'Juán', p_direction: 'i_owe', p_amount: '20.00', p_currency: 'USD', p_fx_rate: '1450.00' })).status).toBe(200)

  await page.goto('/debts')
  const nets = page.getByTestId('debts-group-juan').getByTestId('debts-group-net-item')
  await expect(nets).toHaveCount(2)
  await expect(nets.nth(0)).toHaveText('Te debe $6.000,00')
  await expect(nets.nth(0)).toHaveAttribute('data-currency', 'ARS')
  await expect(nets.nth(1)).toHaveText('Le debés US$20,00')
  await expect(nets.nth(1)).toHaveAttribute('data-currency', 'USD')
})

test('US-91 CA-3 · con «Saldadas» el grupo solo cuenta las saldadas y el filtro vive en la URL', async ({ page, request }) => {
  const api = await userWithApi(page, request, 'us91-ca3')
  const ids: string[] = []
  for (const person of ['Ana', 'ana', 'Ana ']) {
    const res = await debt(api, { p_person: person })
    expect(res.status).toBe(200)
    ids.push(res.body as string)
  }
  expect((await api.rpc('settle_debt', { p_debt_id: ids[0] })).status).toBe(204)
  expect((await api.rpc('settle_debt', { p_debt_id: ids[1] })).status).toBe(204)

  await page.goto('/debts?status=settled')
  const group = page.getByTestId('debts-group-ana')
  await expect(group.getByTestId('debts-group-count')).toHaveText('2 deudas, ninguna pendiente')
  await expect(group.getByTestId('debts-group-net-item')).toHaveCount(0)

  await page.goto('/debts?status=pending') // queda una sola pendiente: fila común, no grupo
  await expect(page.getByTestId('debts-group-ana')).toHaveCount(0)
  await expect(page.getByTestId('debts-item')).toHaveCount(1)

  await page.goto('/debts?status=all')
  await expect(page.getByTestId('debts-group-ana').getByTestId('debts-group-count')).toHaveText('3 deudas, 1 pendiente')
})

test('US-91 CA-4 · los totales por dirección y el estado vacío no cambian, y saldar desde el grupo funciona', async ({ page, request }) => {
  const api = await userWithApi(page, request, 'us91-ca4')
  expect((await debt(api, { p_person: 'Juan', p_amount: '10000.00' })).status).toBe(200)
  expect((await debt(api, { p_person: 'juan', p_amount: '5000.00' })).status).toBe(200)
  expect((await debt(api, { p_person: 'Marcos', p_direction: 'i_owe', p_amount: '2000.00' })).status).toBe(200)

  await page.goto('/debts')
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('$15.000,00')
  await expect(page.getByTestId('debts-total-i-owe')).toContainText('$2.000,00')

  // Saldar desde el grupo: la primera fila es la más reciente (la de $5.000).
  const group = page.getByTestId('debts-group-juan')
  await group.getByTestId('debts-group-toggle').click()
  await group.getByTestId('debts-item-settle').first().click()
  await expect(page.getByTestId('debts-total-owed-to-me')).toContainText('$10.000,00')
  // Con «Pendientes» le queda una sola deuda a Juan: ya no es un grupo, es una fila común.
  await expect(page.getByTestId('debts-group-juan')).toHaveCount(0)
  await expect(page.getByTestId('debts-item-person').filter({ hasText: 'Juan' })).toHaveCount(1)
  await page.goto('/debts?status=all')
  await expect(page.getByTestId('debts-group-juan').getByTestId('debts-group-count')).toHaveText('2 deudas, 1 pendiente')

  await page.goto('/debts?direction=i_owe&status=settled')
  await expect(page.getByTestId('debts-empty')).toBeVisible()
})

test('US-91 · una persona con una sola deuda se ve como fila común, y el listado no tiene grupos sin deudas repetidas', async ({ page, request }) => {
  const api = await userWithApi(page, request, 'us91-fila')
  for (const person of ['Ana', 'Beto', 'Carla']) expect((await debt(api, { p_person: person })).status).toBe(200)
  await page.goto('/debts')
  await expect(page.getByTestId('debts-item')).toHaveCount(3)
  await expect(page.locator('[data-testid^="debts-group-"][data-person-key]')).toHaveCount(0)
})
