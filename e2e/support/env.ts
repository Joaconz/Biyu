import { loadEnv } from 'vite'

// Contra qué corre la suite (#334). Con SMOKE_URL, contra ese deploy (prueba de humo). Sin
// SMOKE_URL, contra Vite y Supabase local: es lo que corre la CI y lo que usa la automatización de
// V3 (entrega-3/02-seleccion-automatizacion.md).
export const LOCAL_APP_URL = 'http://127.0.0.1:5173'
const LOCAL_SUPABASE_URL = 'http://127.0.0.1:54321'

export type E2eTarget = {
  mode: 'local' | 'deploy'
  appUrl: string
  // Solo hacen falta para las llamadas directas a la API (PR-04). En modo deploy son opcionales:
  // los specs de humo no las usan.
  supabaseUrl?: string
  anonKey?: string
}

export function e2eTarget(): E2eTarget {
  const smokeUrl = process.env.SMOKE_URL
  if (smokeUrl) {
    return { mode: 'deploy', appUrl: smokeUrl, supabaseUrl: process.env.SUPABASE_URL, anonKey: process.env.SUPABASE_ANON_KEY }
  }
  // El .env de `npm run dev` ya tiene las claves locales (docs/09-guia-de-inicio.md §3).
  const fileEnv = loadEnv('development', process.cwd(), 'VITE_')
  const supabaseUrl = process.env.SUPABASE_URL ?? fileEnv.VITE_SUPABASE_URL ?? LOCAL_SUPABASE_URL
  const anonKey = process.env.SUPABASE_ANON_KEY ?? fileEnv.VITE_SUPABASE_ANON_KEY
  if (!/^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\/?$/.test(supabaseUrl)) {
    // Los tests crean usuarios y datos: nunca contra el proyecto hosteado sin pedirlo con SMOKE_URL.
    throw new Error(`La suite local tiene que apuntar a Supabase local y apunta a ${supabaseUrl}. Corré \`supabase start\` y revisá .env o SUPABASE_URL.`)
  }
  if (!anonKey) {
    throw new Error('Falta la anon key local: completá VITE_SUPABASE_ANON_KEY en .env o pasá SUPABASE_ANON_KEY (sale de `supabase status -o env`).')
  }
  return { mode: 'local', appUrl: LOCAL_APP_URL, supabaseUrl, anonKey }
}
