import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { DebtItem } from '@/components/debts/DebtItem'
import { DebtsDirectionFilter, DebtsFilter } from '@/components/debts/DebtsFilter'
import { DebtsTotals } from '@/components/debts/DebtsTotals'
import { SettledNotice } from '@/components/debts/SettledNotice'
import { PageHeader } from '@/components/layout/PageHeader'
import { GroupedCard } from '@/components/shared/GroupedList'
import { buttonVariants } from '@/components/ui/button'
import {
  debtTotals,
  debtUpdateErrorReason,
  debtsForFilter,
  emptyDebtsMessage,
  isStaleDebtError,
  parseDebtDirectionFilter,
  parseDebtStatusFilter,
  reopenedNoticeText,
  type DebtDirectionFilter,
  type DebtRecord,
  type DebtStatusFilter,
} from '@/domain/debts'
import { useDebts } from '@/hooks/useDebts'
import { reopenDebt, settleDebt } from '@/lib/debts'

const UNDO_MS = 5000

/** Deudas (US-38): la lista con su filtro en la URL (C11). */
export function DebtsPage() {
  const [params, setParams] = useSearchParams()
  // Un valor desconocido se lee como "Pendientes" (estado) o "Todas" (dirección), y la URL queda como
  // está hasta que se elige otro (US-38 CA-4, US-79 CA-4).
  const filter = parseDebtStatusFilter(params.get('status'))
  const direction = parseDebtDirectionFilter(params.get('direction'))
  const debtsState = useDebts()
  const { reload } = debtsState
  // Las filas que esperan settle_debt o reopen_debt. El ref corta el doble toque antes de que React
  // vuelva a pintar el botón deshabilitado (US-39 CA-3); el estado es lo que se ve.
  const busyRef = useRef(new Set<string>())
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set())
  const undoNotices = useRef(new Set<string | number>())
  // Sube al cambiar de filtro o salir de la pantalla: un saldado que termina después ya no muestra
  // "Deshacer", porque el aviso dura hasta ese cambio.
  const noticeGeneration = useRef(0)

  function dismissUndoNotices() {
    noticeGeneration.current += 1
    undoNotices.current.forEach((id) => toast.dismiss(id))
    undoNotices.current.clear()
  }

  // "Deshacer" dura hasta que se cambia de pantalla (y de filtro, en selectFilter).
  useEffect(() => dismissUndoNotices, [])

  function setRowBusy(id: string, on: boolean) {
    if (on) busyRef.current.add(id)
    else busyRef.current.delete(id)
    setBusy(new Set(busyRef.current))
  }

  function showUpdateError(error: unknown) {
    const reason = debtUpdateErrorReason(error)
    toast.error('No se pudo actualizar la deuda', { testId: 'debts-update-error', description: reason })
    return reason
  }

  async function handleSettle(debt: DebtRecord) {
    if (busyRef.current.has(debt.id)) return
    setRowBusy(debt.id, true)
    const generation = noticeGeneration.current
    try {
      await settleDebt(debt.id)
    } catch (error) {
      if (isStaleDebtError(showUpdateError(error), 'settle')) await reload()
      setRowBusy(debt.id, false)
      return
    }
    // La fila cambia cuando llega la lista nueva, con el settled_at del servidor (CA-2) y los totales.
    await reload()
    setRowBusy(debt.id, false)
    if (generation !== noticeGeneration.current) return
    const id = toast.custom(
      (toastId) => (
        <SettledNotice
          person={debt.person}
          onUndo={async () => {
            try {
              await reopenDebt(debt.id)
            } catch (error) {
              showUpdateError(error)
              return
            }
            await reload()
            toast.dismiss(toastId)
            undoNotices.current.delete(toastId)
          }}
        />
      ),
      { duration: UNDO_MS, onAutoClose: (t) => undoNotices.current.delete(t.id) },
    )
    undoNotices.current.add(id)
  }

  // "Volver a pendiente" (US-40): sin diálogo ni "Deshacer", porque se revierte con "Marcar saldada".
  async function handleReopen(debt: DebtRecord) {
    if (busyRef.current.has(debt.id)) return
    setRowBusy(debt.id, true)
    try {
      await reopenDebt(debt.id)
    } catch (error) {
      if (isStaleDebtError(showUpdateError(error), 'reopen')) await reload()
      setRowBusy(debt.id, false)
      return
    }
    await reload()
    setRowBusy(debt.id, false)
    toast.success(reopenedNoticeText(debt.person), { testId: 'debts-reopened' })
  }

  // Cada filtro escribe su parámetro y conserva el otro (US-79 CA-2, CA-5). No vuelve a pedir datos.
  function setParam(name: 'status' | 'direction', value: string) {
    dismissUndoNotices()
    setParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set(name, value)
      return p
    })
  }
  const selectFilter = (next: DebtStatusFilter) => setParam('status', next)
  const selectDirection = (next: DebtDirectionFilter) => setParam('direction', next)

  const debts = debtsState.status === 'ready' ? debtsForFilter(debtsState.debts, filter, direction) : []
  const empty = emptyDebtsMessage(filter, direction)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <PageHeader title="Deudas" testId="debts-title" className="items-center">
        <Link to="/debts/new" data-testid="debts-new" className={buttonVariants({ variant: 'secondary', size: 'sm' })}>
          Nueva deuda
        </Link>
      </PageHeader>

      {/* Los totales (US-37) salen de todas las deudas, no de las del filtro (CA-4). Como comparten el
          estado con la lista, se recalculan cada vez que se vuelve a pedir (CA-5). */}
      {debtsState.status === 'ready' && <DebtsTotals totals={debtTotals(debtsState.debts)} />}
      <DebtsFilter value={filter} onChange={selectFilter} />
      <DebtsDirectionFilter value={direction} onChange={selectDirection} />

      {debtsState.status === 'loading' && (
        <p data-testid="debts-loading" className="text-callout text-muted-foreground">
          Cargando deudas…
        </p>
      )}

      {debtsState.status === 'error' && (
        <div className="flex flex-col items-start gap-3">
          <p role="alert" data-testid="debts-error" className="text-callout text-destructive">
            No pudimos cargar tus deudas.
          </p>
          <button
            type="button"
            data-testid="debts-retry"
            onClick={debtsState.refresh}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Reintentar
          </button>
        </div>
      )}

      {debtsState.status === 'ready' && (
        <>
          {debts.length === 0 ? (
            <div
              data-testid="debts-empty"
              className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-input/50 px-6 py-12 text-center"
            >
              <p className="text-callout text-muted-foreground">{empty.message}</p>
              {empty.offerNew && (
                <Link to="/debts/new" data-testid="debts-empty-new" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  Cargar una deuda
                </Link>
              )}
            </div>
          ) : (
            <GroupedCard data-testid="debts-list">
              {debts.map((debt) => (
                <DebtItem
                  key={debt.id}
                  debt={debt}
                  busy={busy.has(debt.id)}
                  onSettle={handleSettle}
                  onReopen={handleReopen}
                />
              ))}
            </GroupedCard>
          )}
        </>
      )}
    </div>
  )
}
