import { TransactionForm } from '@/components/transaction-form/TransactionForm'
import { useCatalog } from '@/hooks/useCatalog'

// Pantalla de inicio (US-01): `/` y el login redirigen acá y abre en el primer paso del registro (ADR-024).
export function RegisterPage() {
  const catalog = useCatalog()
  return (
    <div className="pt-2 lg:pt-0">
      <h1 data-testid="register-title" className="sr-only">
        Registrar un gasto
      </h1>
      {catalog.status === 'loading' && (
        <div data-testid="register-loading" aria-busy="true" className="mx-auto flex w-full max-w-xl flex-col gap-7">
          <span className="sr-only">Cargando…</span>
          {/* Misma forma que el primer paso: barra de progreso, Gasto | Ingreso y el monto. */}
          <div className="h-1 animate-pulse rounded-full bg-muted" />
          <div className="h-12 animate-pulse rounded-lg bg-muted" />
          <div className="mx-auto mt-16 h-16 w-40 animate-pulse rounded-lg bg-muted" />
        </div>
      )}
      {catalog.status === 'error' && (
        <p role="alert" data-testid="register-error" className="mx-auto max-w-xl rounded-lg bg-warning-surface p-4 text-callout text-warning">
          No se pudieron cargar tus categorías y cuentas: {catalog.message}
        </p>
      )}
      {catalog.status === 'ready' && (
        <TransactionForm
          categories={catalog.categories}
          accounts={catalog.accounts}
          defaultAccountId={catalog.defaultAccountId}
        />
      )}
    </div>
  )
}
