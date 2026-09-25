import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '@/lib/auth'

/** Layout de las rutas privadas: sin sesión manda a /login conservando el destino. */
export function RequireAuth() {
  const { session, loading } = useSession()
  const location = useLocation()
  if (loading) return <p data-testid="auth-loading" className="p-6 text-muted-foreground">Cargando…</p>
  if (!session) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return <Outlet />
}

/** Layout de /login y /signup: con sesión no tiene sentido mostrarlas. */
export function RedirectIfAuthed() {
  const { session, loading } = useSession()
  if (loading) return null
  return session ? <Navigate to="/register" replace /> : <Outlet />
}
