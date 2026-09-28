import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completalos (en Vercel: Project Settings → Environment Variables, antes del deploy).',
  )
}

// La anon key es pública por diseño (C8): la autorización real es RLS (C7).
// La service_role key nunca va acá.
//
// FR-03 (US-49): sesión persistente entre visitas en el celular. persistSession y
// autoRefreshToken ya son el default del SDK en un entorno con window — quedan
// explícitos acá para que la decisión no dependa de un default que podría cambiar.
// El plazo de inactividad tras el cual el refresh token deja de ser válido es
// configuración del proyecto de Supabase (Auth → Sessions → "Time-box user sessions" /
// "Inactivity timeout"), no algo que este cliente controle.
export const supabase = createClient<Database>(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: window.localStorage,
  },
})
