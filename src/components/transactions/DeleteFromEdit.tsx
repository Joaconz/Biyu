import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { DeleteTransactionDialog } from '@/components/transactions/DeleteTransactionDialog'
import { buttonVariants } from '@/components/ui/button'
import { fetchDashboardTransaction, type DashboardTransaction } from '@/lib/dashboard'
import { cn } from '@/lib/utils'

/**
 * «Eliminar movimiento» al pie de Editar (ADR-052): las filas de Movimientos ya no tienen botones, así que la
 * baja lógica (C10) se hace desde acá, con el mismo diálogo de siempre (US-94). Al confirmar vuelve a la lista.
 */
export function DeleteFromEdit({ transactionId, backTo }: { transactionId: string; backTo: string }) {
  const navigate = useNavigate()
  const [transaction, setTransaction] = useState<DashboardTransaction | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchDashboardTransaction(transactionId)
      .then((tx) => {
        if (!cancelled) setTransaction(tx)
      })
      // Sin el movimiento no hay qué confirmar: el botón no aparece y el resto de la pantalla sigue igual.
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [transactionId])

  if (!transaction || transaction.deleted_at) return null

  return (
    <div className="mt-10 flex justify-center">
      <button
        type="button"
        data-testid="edit-transaction-delete"
        onClick={() => setIsOpen(true)}
        className={cn(buttonVariants({ variant: 'ghost' }), 'text-destructive hover:bg-destructive/10 hover:text-destructive')}
      >
        <Trash2 aria-hidden="true" strokeWidth={1.8} />
        Eliminar movimiento
      </button>
      <DeleteTransactionDialog
        transaction={transaction}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onDeleted={() => navigate(backTo)}
      />
    </div>
  )
}
