import { type APIRequestContext, expect, type Page, test } from '@playwright/test'
import { e2eTarget } from './env.ts'

// Pasos comunes de los casos (docs/12-procedimientos-de-prueba.md) para los specs automatizados.
// Cada test crea su propio usuario: ningún caso usa datos que dejó otro.

// PR-01: cumple los 5 criterios de US-67 y la política del proyecto hosteado.
export const TEST_PASSWORD = 'Clave123!'

// workerIndex y retry: dos workers (o un reintento) pueden arrancar en el mismo milisegundo.
export function uniqueEmail(tag: string) {
  const info = test.info()
  return `qa+${tag}-${Date.now()}-${info.workerIndex}-${info.retry}@example.com`
}

// PR-01: alta por la pantalla y los 4 pasos de la configuración inicial salteados.
export async function signUpAndSkipSetup(page: Page, tag: string) {
  const email = uniqueEmail(tag)
  await page.goto('/signup')
  await page.getByTestId('signup-form-email').fill(email)
  await page.getByTestId('signup-form-password').fill(TEST_PASSWORD)
  await page.getByTestId('signup-form-confirm-password').fill(TEST_PASSWORD)
  await page.getByTestId('signup-form-submit').click()
  await expect(page).toHaveURL(/\/setup$/, { timeout: 15_000 })
  for (const step of ['reason', 'categories', 'accounts', 'expense']) {
    await page.getByTestId(`setup-${step}-skip`).click()
  }
  await expect(page).toHaveURL(/\/register$/)
  await expect(page.getByTestId('transaction-form')).toBeVisible()
  return { email, password: TEST_PASSWORD }
}

export type ApiResponse = { status: number; body: unknown }

// PR-04: inicia sesión por la API de Auth y llama a PostgREST con el token del usuario, como las
// variantes API de los casos. Nunca con la service_role (C8).
export async function apiSession(request: APIRequestContext, email: string, password: string = TEST_PASSWORD) {
  const { supabaseUrl, anonKey } = e2eTarget()
  if (!supabaseUrl || !anonKey) throw new Error('Para llamar a la API contra un deploy pasá SUPABASE_URL y SUPABASE_ANON_KEY.')
  const login = await request.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    headers: { apikey: anonKey },
    data: { email, password },
  })
  expect(login.status(), 'PR-04 paso 1: login por la API').toBe(200)
  const { access_token: token, user } = (await login.json()) as { access_token: string; user: { id: string } }
  const headers = (bearer: string | null) => ({ apikey: anonKey, Authorization: `Bearer ${bearer ?? anonKey}` })
  const parse = async (res: Awaited<ReturnType<APIRequestContext['get']>>): Promise<ApiResponse> => {
    const text = await res.text()
    return { status: res.status(), body: text ? JSON.parse(text) : null }
  }
  return {
    token,
    userId: user.id,
    // `asAnon`: la misma llamada sin sesión (rol anon), para el par de autorización (C7).
    rpc: async (fn: string, args: Record<string, unknown>, opts: { asAnon?: boolean } = {}) =>
      parse(await request.post(`${supabaseUrl}/rest/v1/rpc/${fn}`, { headers: headers(opts.asAnon ? null : token), data: args })),
    select: async (table: string, query = 'select=*', opts: { asAnon?: boolean } = {}) =>
      parse(await request.get(`${supabaseUrl}/rest/v1/${table}?${query}`, { headers: headers(opts.asAnon ? null : token) })),
  }
}

// Reloj fijo en la hora de Argentina, para los casos que dependen de "hoy" (C1, ADR-021).
// Llamarlo antes de page.goto.
export async function fixToday(page: Page, isoDate: string) {
  await page.clock.setFixedTime(new Date(`${isoDate}T12:00:00-03:00`))
}
