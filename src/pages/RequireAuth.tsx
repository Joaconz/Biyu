import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router'
import { useSession } from '@/lib/auth'
import { postAuthDestination } from '@/lib/navigation'

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

/**
 * Layout de /login y /signup: con sesión no tiene sentido mostrarlas. Al iniciar sesión, la
 * sesión nueva hace que este guard redirija antes que el navigate() de AuthForm, así que tiene
 * que respetar el mismo ?next (DEF-008).
 */
export function RedirectIfAuthed() {
  const { session, loading } = useSession()
  const [params] = useSearchParams()
  if (loading) return null
  return session ? <Navigate to={postAuthDestination(params.get('next'))} replace /> : <Outlet />
}
