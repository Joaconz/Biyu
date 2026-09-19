import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copiá .env.example a .env y completalos.',
  )
}

// La anon key es pública por diseño (C8): la autorización real es RLS (C7).
// La service_role key nunca va acá.
export const supabase = createClient(url, anonKey)
