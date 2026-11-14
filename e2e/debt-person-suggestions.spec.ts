import { expect, type APIRequestContext, type Page, test } from '@playwright/test'
import { apiSession, signUpAndSkipSetup } from './support/app.ts'

// US-100 (#361): «Persona» sugiere las personas ya cargadas y Nueva deuda tiene botón atrás.

type Api = Awaited<ReturnType<typeof apiSession>>
const debt = (api: Api, person: string) =>
  api.rpc('create_debt', {
    p_direction: 'owed_to_me', p_person: person, p_amount: '10000.00', p_currency: 'ARS', p_fx_rate: null,
    p_incurred_on: '2026-08-15', p_notes: null,
  })

async function withPeople(page: Page, request: APIRequestContext, tag: string, people: string[]) {
  const { email } = await signUpAndSkipSetup(page, tag)
  const api = await apiSession(request, email)
  for (const person of people) expect((await debt(api, person)).status).toBe(200)
}

test('US-100 CA-1 · al escribir sugiere las personas que coinciden, sin distinguir mayúsculas ni tildes', async ({ page, request }) => {
  await withPeople(page, request, 'us100-ca1', ['Sofía', 'Juan Pérez', 'Mariana'])
  await page.goto('/debts/new')
  const person = page.getByTestId('debt-form-person')
  await person.fill('SOFI')
  await expect(page.getByTestId('debt-form-person-suggestion')).toHaveText(['Sofía'])
  await expect(person).toHaveAttribute('aria-expanded', 'true')
  await person.fill('juan p')
  await expect(page.getByTestId('debt-form-person-suggestion')).toHaveText(['Juan Pérez'])
})

test('US-100 CA-2 · elegir una sugerencia completa el campo con ese nombre y guarda en la misma persona', async ({ page, request }) => {
  await withPeople(page, request, 'us100-ca2', ['Sofía'])
  await page.goto('/debts/new')
  await page.getByTestId('debt-form-person').fill('sof')
  await page.getByTestId('debt-form-person-suggestion').click()
  await expect(page.getByTestId('debt-form-person')).toHaveValue('Sofía')
  await expect(page.getByTestId('debt-form-person-suggestions')).toHaveCount(0)
  // Elegir no marcó el error de «Persona» por perder el foco.
  await expect(page.getByTestId('debt-form-person-error')).toHaveCount(0)
  await page.getByTestId('debt-form-amount').fill('5000')
  await page.getByTestId('debt-form-submit').click()
  await expect(page).toHaveURL(/\/debts\?status=pending/)
  await expect(page.getByTestId('debts-group-sofia')).toHaveCount(1)
})

test('US-100 CA-3 · sin coincidencias, o con el campo vacío, no sugiere nada', async ({ page, request }) => {
  await withPeople(page, request, 'us100-ca3', ['Sofía'])
  await page.goto('/debts/new')
  const person = page.getByTestId('debt-form-person')
  await expect(page.getByTestId('debt-form-person-suggestions')).toHaveCount(0)
  await person.fill('Zulema')
  await expect(page.getByTestId('debt-form-person-suggestions')).toHaveCount(0)
  await expect(person).toHaveAttribute('aria-expanded', 'false')
})

test('US-100 CA-4 · con el teclado: flechas recorren, Enter elige sin enviar el formulario y Escape cierra', async ({ page, request }) => {
  await withPeople(page, request, 'us100-ca4', ['Ana', 'Mariana'])
  await page.goto('/debts/new')
  const person = page.getByTestId('debt-form-person')
  await person.fill('an')
  await expect(page.getByTestId('debt-form-person-suggestion')).toHaveText(['Ana', 'Mariana'])
  await person.press('ArrowDown')
  await person.press('ArrowDown')
  await expect(page.getByTestId('debt-form-person-suggestion').nth(1)).toHaveAttribute('aria-selected', 'true')
  await person.press('Enter')
  await expect(person).toHaveValue('Mariana')
  await expect(page).toHaveURL(/\/debts\/new/)

  await person.fill('an')
  await expect(page.getByTestId('debt-form-person-suggestions')).toBeVisible()
  await person.press('Escape')
  await expect(page.getByTestId('debt-form-person-suggestions')).toHaveCount(0)
})

test('US-100 CA-5 · en el gasto compartido de Registrar también sugiere', async ({ page, request }) => {
  await withPeople(page, request, 'us100-ca5', ['Sofía'])
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-shared-toggle').click()
  const person = page.locator('[data-testid="transaction-form-shared-person"][data-index="1"]')
  await person.fill('sofi')
  await page.getByTestId('transaction-form-shared-person-suggestion').click()
  await expect(person).toHaveValue('Sofía')
})

test('US-100 CA-6 · el encabezado de Nueva deuda tiene «‹ Deudas» que vuelve a la lista', async ({ page }) => {
  await signUpAndSkipSetup(page, 'us100-ca6')
  await page.goto('/debts/new')
  await expect(page.getByTestId('debt-form-back')).toHaveText('‹ Deudas')
  await page.getByTestId('debt-form-back').click()
  await expect(page).toHaveURL(/\/debts$/)
  await expect(page.getByTestId('debts-title')).toBeVisible()
})
