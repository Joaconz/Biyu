import { defineConfig, devices } from '@playwright/test'
import { e2eTarget } from './e2e/support/env.ts'

// Dos modos (#334, e2e/support/env.ts):
// - Local (sin SMOKE_URL): levanta Vite contra Supabase local, o reusa el que ya corre en 5173. Es
//   lo que corre la CI. Un solo navegador con el ancho de celular de las ejecuciones manuales.
// - Deploy (SMOKE_URL=<url>): prueba de humo contra ese deploy en Chromium, WebKit y Firefox.
const target = e2eTarget()
const local = target.mode === 'local'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: target.appUrl,
    // El período del dashboard sale del reloj del navegador: que sea el de Argentina.
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: local
    ? [{ name: 'local', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } } }]
    : [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
        { name: 'webkit', use: { ...devices['Desktop Safari'] } },
        { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
      ],
  webServer: local
    ? {
        command: 'npx vite --port 5173 --strictPort --host 127.0.0.1',
        url: target.appUrl,
        reuseExistingServer: !process.env.CI,
        env: { VITE_SUPABASE_URL: target.supabaseUrl!, VITE_SUPABASE_ANON_KEY: target.anonKey! },
      }
    : undefined,
})
