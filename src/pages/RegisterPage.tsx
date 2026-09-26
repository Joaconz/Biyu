import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'

// Esqueleto: el formulario real llega con US-01 en adelante.
export function RegisterPage() {
  return (
    <AppShell
      actions={
        <div className="flex items-center gap-3">
          <Link to="/settings" data-testid="register-nav-settings" className="text-sm underline">
            Configuración
          </Link>
          <Link to="/dashboard" data-testid="register-nav-dashboard" className="text-sm underline">
            Dashboard
          </Link>
        </div>
      }
    >
      <h1 data-testid="register-title" className="text-2xl font-semibold">Registrar un gasto</h1>
    </AppShell>
  )
}
