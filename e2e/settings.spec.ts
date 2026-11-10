/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, type Page, test } from '@playwright/test'

// Ajustes: DEF-015 (#156), DEF-010 (#151) y DEF-011 (#152). Corre en local y contra el deploy (SMOKE_URL),
// como smoke.spec.ts: la lógica de siembra también tiene su test en tests/lib/seedPlan.test.ts y el
// borrado de cuentas el suyo en supabase/tests/database/delete_account.test.sql.
const PASSWORD = 'Smoke-Test-2026'

async function signUpAndSkipSetup(page: Page, tag: string) {
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(`settings+${tag}-${Date.now()}-${test.info().workerIndex}@biyu.test`)
  await page.getByTestId('signup-form-password').fill(PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  const form = page.getByTestId('transaction-form')
  await expect(form.or(page.getByTestId('setup-reason-skip'))).toBeVisible({ timeout: 15_000 })
  if (!(await form.isVisible())) {
    await page.getByTestId('setup-reason-skip').click()
    await page.getByTestId('setup-categories-skip').click()
    await page.getByTestId('setup-accounts-skip').click()
    await page.getByTestId('setup-expense-skip').click()
  }
  await expect(page).toHaveURL(/\/register$/)
}

/** Los elementos interactivos de `root` que no tienen `data-testid`, y los que lo repiten. */
async function auditTestIds(page: Page, root: string) {
  return page.evaluate((rootSelector) => {
    const interactive = [...document.querySelectorAll(rootSelector)].flatMap((el) => [
      ...el.querySelectorAll('button, a[href], input:not([type="hidden"]):not([aria-hidden="true"]), select, textarea, [role="radio"]'),
    ])
    const ids = interactive.map((el) => el.getAttribute('data-testid'))
    return {
      count: interactive.length,
      missing: interactive.filter((el) => !el.getAttribute('data-testid')).map((el) => el.outerHTML.slice(0, 120)),
      duplicated: [...new Set(ids.filter((id, i) => id && ids.indexOf(id) !== i))],
    }
  }, root)
}

test('DEF-015: todo elemento interactivo de Ajustes tiene un data-testid propio', async ({ page }) => {
  await signUpAndSkipSetup(page, 'testids')
  await page.goto('/settings')
  await expect(page.getByTestId('settings-nav-categories')).toBeVisible()
  await expect(page.getByTestId('settings-accounts-list').locator('li').first()).toBeVisible()
  const settings = await auditTestIds(page, 'main')
  expect(settings.missing).toEqual([])
  expect(settings.duplicated).toEqual([])

  // ADR-055: las categorías, en su pantalla y en su hoja (que vive fuera de <main>).
  await page.getByTestId('settings-nav-categories').click()
  await expect(page).toHaveURL(/\/settings\/categories/)
  await expect(page.getByTestId('settings-categories-list').locator('li').first()).toBeVisible()
  const categories = await auditTestIds(page, 'main')
  expect(categories.missing).toEqual([])
  expect(categories.duplicated).toEqual([])
  await page.getByTestId('settings-categories-edit-transporte').click()
  await expect(page.getByTestId('settings-categories-sheet')).toBeVisible()
  const sheet = await auditTestIds(page, '[data-testid="settings-categories-sheet"]')
  expect(sheet.count).toBeGreaterThan(30) // íconos, colores y acciones
  expect(sheet.missing).toEqual([])
  expect(sheet.duplicated).toEqual([])
})

/** Abre Categorías desde Ajustes, como lo hace el usuario. */
async function openCategories(page: Page) {
  await page.goto('/settings')
  await page.getByTestId('settings-nav-categories').click()
  await expect(page.getByTestId('settings-categories-title')).toBeVisible()
}

/** Archiva todas las categorías activas, una por una desde su hoja. */
async function archiveAllCategories(page: Page) {
  const rows = page.getByTestId('settings-categories-list').locator('li')
  await expect(rows.first()).toBeVisible()
  const sheet = page.getByTestId('settings-categories-sheet')
  while ((await rows.count()) > 0) {
    const before = await rows.count()
    await rows.first().getByRole('button').click()
    await sheet.getByRole('button', { name: /^Archivar/ }).click()
    await expect(rows).toHaveCount(before - 1)
    await expect(sheet).toHaveCount(0)
  }
}

test('DEF-010: archivar todas las categorías no hace que se vuelvan a sembrar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'archivar')
  await openCategories(page)
  await archiveAllCategories(page)
  const rows = page.getByTestId('settings-categories-list').locator('li')

  await page.goto('/register')
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  await page.goto('/settings/categories')
  await expect(page.getByTestId('settings-categories-empty')).toBeVisible()
  await expect(rows).toHaveCount(0)
})

test('DEF-011: editar, archivar y eliminar cuentas, con confirmación al eliminar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'cuentas')

  // Un gasto en Efectivo, para que eliminar esa cuenta avise que se lleva un movimiento.
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1500')
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId('transaction-form-account-chip-efectivo').click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')

  await page.goto('/settings')

  // Editar: renombrar la billetera.
  await page.getByTestId('settings-accounts-edit-billetera-virtual').click()
  await page.getByTestId('settings-accounts-edit-name').fill('Mercado Pago')
  await page.getByTestId('settings-accounts-save').click()
  await expect(page.getByTestId('settings-accounts-edit-mercado-pago')).toBeVisible()
  await expect(page.getByTestId('settings-accounts-edit-billetera-virtual')).toHaveCount(0)

  // Archivar: sale de la lista.
  await page.getByTestId('settings-accounts-archive-cuenta-bancaria').click()
  await expect(page.getByTestId('settings-accounts-edit-cuenta-bancaria')).toHaveCount(0)

  // Eliminar (desde la edición): primero se cancela y la cuenta sigue; después se confirma.
  await page.getByTestId('settings-accounts-edit-efectivo').click()
  await page.getByTestId('settings-accounts-delete').click()
  await expect(page.getByTestId('settings-accounts-delete-dialog')).toContainText('¿Seguro que querés eliminar «Efectivo»?')
  await expect(page.getByTestId('settings-accounts-delete-impact')).toContainText('su movimiento')
  await page.getByTestId('settings-accounts-delete-dialog-cancel').click()
  await page.getByTestId('settings-accounts-cancel').click()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toBeVisible()

  await page.getByTestId('settings-accounts-edit-efectivo').click()
  await page.getByTestId('settings-accounts-delete').click()
  await page.getByTestId('settings-accounts-delete-dialog-confirm').click()
  await expect(page.getByTestId('settings-accounts-delete-dialog')).toBeHidden()
  await expect(page.getByTestId('settings-accounts-edit-efectivo')).toHaveCount(0)

  // El gasto se fue con la cuenta: el mes queda vacío.
  await page.goto('/dashboard')
  await expect(page.getByTestId('dashboard-empty')).toBeVisible()
})

/** Un gasto con la cuenta y las cuotas dadas, desde Registrar cargado de cero. */
async function registerExpense(page: Page, amount: string, account: string, installments?: number) {
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill(amount)
  await page.getByTestId('transaction-form-next').click()
  await page.getByTestId('transaction-form-category-chip-otros').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'details')
  await page.getByTestId(`transaction-form-account-chip-${account}`).click()
  if (installments) await page.getByTestId(`transaction-form-installments-chip-${installments}`).click()
  await page.getByTestId('transaction-form-submit').click()
  await expect(page.getByTestId('transaction-form-step')).toHaveAttribute('data-step', 'amount')
}

test('DEF-024: el diálogo de eliminar cuenta toma el foco, lo retiene y lo devuelve', async ({ page }) => {
  await signUpAndSkipSetup(page, 'foco')
  await page.goto('/settings')
  await page.getByTestId('settings-accounts-edit-efectivo').click()
  await page.getByTestId('settings-accounts-delete').focus()
  await page.keyboard.press('Enter')

  const dialog = page.getByTestId('settings-accounts-delete-dialog')
  await expect(dialog).toBeVisible()
  // Acción destructiva: el foco arranca en Cancelar.
  await expect(page.getByTestId('settings-accounts-delete-dialog-cancel')).toBeFocused()
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)
  }
  await page.keyboard.press('Shift+Tab')
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true)

  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(page.getByTestId('settings-accounts-delete')).toBeFocused()
})

test('DEF-025: el error al editar aparece en la fila que se edita', async ({ page }) => {
  await signUpAndSkipSetup(page, 'error-edicion')
  await registerExpense(page, '9000', 'tarjeta-de-credito', 3)
  await openCategories(page)

  // Categoría: renombrar a un nombre activo con otras mayúsculas (DEF-019); el error queda en la hoja.
  await page.getByTestId('settings-categories-edit-transporte').click()
  await page.getByTestId('settings-categories-edit-name').fill('OTROS')
  await page.getByTestId('settings-categories-save').click()
  await expect(page.getByTestId('settings-categories-edit-error')).toHaveText('Ya existe una categoría activa con ese nombre')
  await expect(page.getByTestId('settings-categories-edit-error')).toBeInViewport()
  await page.getByTestId('settings-categories-cancel').click()
  await expect(page.getByTestId('settings-categories-edit-error')).toHaveCount(0)

  // Cuenta: sacar de crédito una tarjeta con cuotas (I6, DEF-009).
  await page.goto('/settings')
  await page.getByTestId('settings-accounts-edit-tarjeta-de-credito').click()
  await page.getByTestId('settings-accounts-edit-type').click()
  await page.getByTestId('settings-accounts-edit-type-cash').click()
  await page.getByTestId('settings-accounts-save').click()
  await expect(page.getByTestId('settings-accounts-edit-error')).toContainText('compras en cuotas')
  await expect(page.getByTestId('settings-accounts-edit-error')).toBeInViewport()
})

test('DEF-026: sin categorías activas hay salida, y las archivadas se pueden reactivar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'sin-categorias')
  await openCategories(page)
  await archiveAllCategories(page)

  // Registrar explica qué hacer y lleva a Categorías.
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('500')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-empty')).toBeVisible()
  await page.getByTestId('transaction-form-category-empty-settings').click()
  await expect(page).toHaveURL(/\/settings\/categories/)

  // Las archivadas están plegadas: se despliegan y se reactivan.
  await expect(page.getByTestId('settings-categories-unarchive-salud')).toHaveCount(0)
  await page.getByTestId('settings-categories-archived-toggle').click()
  await page.getByTestId('settings-categories-unarchive-salud').click()
  await expect(page.getByTestId('settings-categories-edit-salud')).toBeVisible()
  await expect(page.getByTestId('settings-categories-unarchive-salud')).toHaveCount(0)

  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('500')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-chip-salud')).toBeVisible()
})

test('DEF-026: el paso de categorías del setup no queda vacío sin explicación', async ({ page }) => {
  await signUpAndSkipSetup(page, 'setup-vacio')
  await openCategories(page)
  await archiveAllCategories(page)
  await page.goto('/settings')
  await page.getByTestId('settings-nav-setup').click()
  await page.getByTestId('setup-reason-skip').click()
  await expect(page.getByTestId('setup-categories-empty')).toBeVisible()
})

/** Crea una categoría desde «Nueva categoría»; `icon` es la clave del ícono, si se quiere elegir uno. */
async function createCategory(page: Page, name: string, icon?: string) {
  await page.getByTestId('settings-categories-new').click()
  await page.getByTestId('settings-categories-name').fill(name)
  if (icon) await page.getByTestId(`settings-categories-icon-${icon}`).click()
  await page.getByTestId('settings-categories-submit').click()
  await expect(page.getByTestId('settings-categories-sheet')).toHaveCount(0)
}

/** Abre la hoja de una categoría y toca Eliminar. */
async function deleteFromSheet(page: Page, slug: string) {
  await page.getByTestId(`settings-categories-edit-${slug}`).click()
  await page.getByTestId(`settings-categories-delete-${slug}`).click()
}

test('US-89: una categoría sin uso se borra con confirmación; una en uso se rechaza', async ({ page }) => {
  await signUpAndSkipSetup(page, 'borrar-categoria')
  await openCategories(page)

  // Una categoría nueva, sin uso: cancelar no borra; confirmar sí, y el nombre queda libre.
  await createCategory(page, 'Tecnología')
  await expect(page.getByTestId('settings-categories-edit-tecnologia')).toBeVisible()

  await deleteFromSheet(page, 'tecnologia')
  const dialog = page.getByTestId('settings-categories-delete-dialog')
  await expect(page.getByTestId('settings-categories-delete-dialog-summary')).toContainText('Sin uso')
  await page.getByTestId('settings-categories-delete-dialog-cancel').click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByTestId('settings-categories-edit-tecnologia')).toBeVisible()

  await deleteFromSheet(page, 'tecnologia')
  await page.getByTestId('settings-categories-delete-dialog-confirm').click()
  await expect(page.getByTestId('settings-categories-edit-tecnologia')).toHaveCount(0)

  await createCategory(page, 'Tecnología')
  await expect(page.getByTestId('settings-categories-edit-tecnologia')).toBeVisible()

  // «Otros» recibe un gasto: la confirmación dice cuánto la usa y la RPC rechaza con ese mensaje.
  await registerExpense(page, '500', 'efectivo')
  await openCategories(page)
  await expect(page.getByTestId('settings-categories-count-otros')).toContainText('1 movimiento')
  await deleteFromSheet(page, 'otros')
  await expect(page.getByTestId('settings-categories-delete-dialog-summary')).toContainText('1 movimiento')
  await page.getByTestId('settings-categories-delete-dialog-confirm').click()
  await expect(page.getByTestId('settings-categories-error')).toContainText('Archivala')
  await expect(page.getByTestId('settings-categories-edit-otros')).toBeVisible()
})

test('ADR-055: el ícono y el color elegidos se ven en la lista y en Registrar, y se pueden cambiar', async ({ page }) => {
  await signUpAndSkipSetup(page, 'icono-categoria')
  await openCategories(page)

  // La vista previa de la hoja sigue lo que se elige, antes de guardar.
  await page.getByTestId('settings-categories-new').click()
  await page.getByTestId('settings-categories-name').fill('Mascotas')
  await page.getByTestId('settings-categories-icon-paw-print').click()
  await expect(page.getByTestId('settings-categories-preview').locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')
  await page.getByTestId('settings-categories-submit').click()
  await expect(page.getByTestId('settings-categories-sheet')).toHaveCount(0)

  const row = page.getByTestId('settings-categories-edit-mascotas')
  await expect(row.locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')
  await expect(page.getByTestId('settings-categories-count-mascotas')).toContainText('Sin movimientos')

  // En Registrar, la categoría nueva trae su ícono (el del picker).
  await page.goto('/register')
  await page.getByTestId('transaction-form-amount').fill('1000')
  await page.getByTestId('transaction-form-next').click()
  await expect(page.getByTestId('transaction-form-category-chip-mascotas').locator('[data-icon]')).toHaveAttribute('data-icon', 'paw-print')

  // Editar: cambiar el ícono se guarda; una sembrada sin ícono guardado se abre con el suyo.
  await openCategories(page)
  await page.getByTestId('settings-categories-edit-transporte').click()
  await expect(page.getByTestId('settings-categories-edit-icon-bus')).toHaveAttribute('aria-checked', 'true')
  await page.getByTestId('settings-categories-edit-icon-car').click()
  await page.getByTestId('settings-categories-save').click()
  await expect(page.getByTestId('settings-categories-sheet')).toHaveCount(0)
  await expect(page.getByTestId('settings-categories-edit-transporte').locator('[data-icon]')).toHaveAttribute('data-icon', 'car')
  await page.reload()
  await expect(page.getByTestId('settings-categories-edit-transporte').locator('[data-icon]')).toHaveAttribute('data-icon', 'car')
})
