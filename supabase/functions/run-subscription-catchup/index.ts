// run-subscription-catchup (US-53, ADR-017, ADR-031): la puesta al día al entrar.
//
// La app la invoca una vez por carga, con la sesión del usuario. No usa la service_role (C8): llama a
// la RPC run_subscription_catchup con el mismo JWT, así RLS y auth.uid() deciden de quién es la
// puesta al día y el hoy lo pone Postgres (ADR-021). Respuesta: 200 con
// { generated, failed: [{ subscription_id, period, reason }] } (ADR-031 §5); un `failed` no vacío
// no es un error.
import { createClient } from 'npm:@supabase/supabase-js@2.116.0'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405)

  const authorization = req.headers.get('Authorization')
  if (!authorization) return json({ error: 'Falta la sesión' }, 401)

  const url = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!url || !anonKey) {
    console.error('run-subscription-catchup: faltan SUPABASE_URL o SUPABASE_ANON_KEY')
    return json({ error: 'No pudimos poner al día tus suscripciones' }, 500)
  }

  const supabase = createClient(url, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase.rpc('run_subscription_catchup')
  if (error) {
    // Sin sesión válida: 42501 de la RPC o PGRST30x de PostgREST (JWT vencido o inválido). El texto
    // de Postgres va al log, no al cliente.
    const unauthorized = error.code === '42501' || error.code?.startsWith('PGRST30')
    console.error('run_subscription_catchup', error)
    return json({ error: unauthorized ? 'Falta la sesión' : 'No pudimos poner al día tus suscripciones', code: error.code }, unauthorized ? 401 : 500)
  }
  return json(data, 200)
})
