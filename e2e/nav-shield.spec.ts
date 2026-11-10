/// <reference lib="dom" />
// (page.evaluate corre en el navegador: necesita los tipos del DOM)
import { expect, test } from '@playwright/test'
import { signUpAndSkipSetup } from './support/app.ts'

// B1 (UX): el aire alrededor de la píldora flotante y el que la separa de los pies sticky deja pasar los
// toques al contenido de atrás. Una franja fija de ancho completo (`app-nav-shield`) se los traga.
// Es un test de la barra móvil: el proyecto local corre a 390 px.
test('B1: un toque en la franja de la barra no navega ni activa nada de atrás', async ({ page }) => {
  await signUpAndSkipSetup(page, 'nav-shield')
  await page.goto('/settings')
  const shield = page.getByTestId('app-nav-shield')
  await expect(shield).toBeVisible()

  const nav = await page.getByRole('navigation', { name: 'Principal' }).boundingBox()
  const strip = await shield.boundingBox()
  expect(nav && strip).toBeTruthy()
  // La franja llega al borde inferior y cubre del tope de la píldora hasta su aire de arriba.
  expect(strip!.y).toBeLessThan(nav!.y)
  expect(strip!.y + strip!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height)
  expect(strip!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width)

  // Un botón de prueba con z-index 30 (bajo la franja), en cada punto del aire: si el toque le llegara, cuenta.
  const points = [
    { name: 'debajo', x: nav!.x + nav!.width / 2, y: nav!.y + nav!.height + 3 },
    { name: 'encima', x: nav!.x + nav!.width / 2, y: nav!.y - 3 },
    { name: 'a la izquierda', x: nav!.x - 5, y: nav!.y + nav!.height / 2 },
    { name: 'a la derecha', x: nav!.x + nav!.width + 5, y: nav!.y + nav!.height / 2 },
  ]
  const url = page.url()
  for (const point of points) {
    await page.evaluate(({ x, y }) => {
      document.getElementById('shield-probe')?.remove()
      const probe = document.createElement('button')
      probe.id = 'shield-probe'
      probe.dataset.clicks = '0'
      probe.style.cssText = `position:fixed;z-index:30;left:${x - 20}px;top:${y - 20}px;width:40px;height:40px`
      probe.addEventListener('click', () => (probe.dataset.clicks = String(Number(probe.dataset.clicks) + 1)))
      document.body.appendChild(probe)
    }, point)
    await page.mouse.click(point.x, point.y)
    expect(await page.locator('#shield-probe').getAttribute('data-clicks'), `toque ${point.name} de la píldora`).toBe('0')
    expect(page.url(), `toque ${point.name} de la píldora`).toBe(url)
  }
})
