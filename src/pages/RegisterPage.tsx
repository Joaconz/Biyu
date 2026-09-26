import { Link } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { TransactionForm } from '@/components/transaction-form/TransactionForm'
import { useCatalog } from '@/hooks/useCatalog'

// Pantalla de inicio (US-01): `/` y el login redirigen acá.
export function RegisterPage() {
  const catalog = useCatalog()
  return (
    <AppShell
      actions={
        <Link to="/dashboard" data-testid="register-nav-dashboard" className="text-sm underline">
          Dashboard
        </Link>
      }
    >
      <h1 data-testid="register-title" className="text-2xl font-semibold">Registrar un gasto</h1>
      {catalog.status === 'loading' && (
        <p data-testid="register-loading" className="text-muted-foreground">Cargando…</p>
      )}
      {catalog.status === 'error' && (
        <p role="alert" data-testid="register-error" className="text-sm text-destructive">
          No se pudieron cargar tus categorías y cuentas: {catalog.message}
        </p>
      )}
      {catalog.status === 'ready' && (
        <TransactionForm categories={catalog.categories} accounts={catalog.accounts} />
      )}
    </AppShell>
  )
}
