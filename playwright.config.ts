import { defineConfig, devices } from '@playwright/test'

// Prueba de humo del deploy (docs/02-behavior-spec.md §Testing Decisions, nivel 4). Corre contra
// la URL que se le pase en SMOKE_URL, nunca contra una hardcodeada: no hay dev server acá.
const baseURL = process.env.SMOKE_URL
if (!baseURL) {
  throw new Error('Falta SMOKE_URL: SMOKE_URL=https://<deploy> npm run test:e2e')
}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    // El período del dashboard sale del reloj del navegador: que sea el de Argentina.
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
})
