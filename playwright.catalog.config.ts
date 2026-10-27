import { defineConfig, devices } from '@playwright/test'

// Ejecución automatizada del catálogo de casos (Entrega 2 / V3). A diferencia de playwright.config.ts
// (prueba de humo del deploy, 3 navegadores), esta corre contra la app local: Vite + Supabase local.
//   CATALOG_URL            app bajo prueba (por defecto http://127.0.0.1:5173)
//   CATALOG_SUPABASE_URL   API de Supabase (por defecto http://127.0.0.1:54321)
//   CATALOG_ANON_KEY       anon key del Supabase local (supabase status -o env)
//   CATALOG_RUN            correlativo del email de cada caso (qa+cp-exp-001-<RUN>@example.com)
const baseURL = process.env.CATALOG_URL ?? 'http://127.0.0.1:5173'

export default defineConfig({
  testDir: './e2e/catalogo',
  fullyParallel: true,
  workers: Number(process.env.CATALOG_WORKERS ?? 4),
  retries: 0,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report-catalogo' }],
    ['json', { outputFile: 'test-results-catalogo/resultado.json' }],
  ],
  outputDir: 'test-results-catalogo/artefactos',
  use: {
    baseURL,
    ...devices['Pixel 7'],
    viewport: { width: 375, height: 812 },
    locale: 'es-AR',
    timezoneId: 'America/Argentina/Buenos_Aires',
    acceptDownloads: true,
    trace: 'on',
    screenshot: 'on',
  },
  projects: [{ name: 'chromium' }],
})
