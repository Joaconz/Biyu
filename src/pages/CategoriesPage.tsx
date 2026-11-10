import { useEffect, useState } from 'react'
import { ArchiveRestore, ChevronDown, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { CategorySheet, type CategoryDraft, type CategorySheetState } from '@/components/categories/CategorySheet'
import { PageHeader } from '@/components/layout/PageHeader'
import { CategoryIcon } from '@/components/shared/CategoryIcon'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { GroupedCard } from '@/components/shared/GroupedList'
import { Button } from '@/components/ui/button'
import { categoryDeletionSummary } from '@/domain/deletion'
import { formatPeriodLong } from '@/domain/period'
import { usePeriodParam } from '@/hooks/usePeriodParam'
import { today } from '@/lib/clock'
import {
  archiveCategory,
  countCategoryMovementsInPeriod,
  countCategoryUsage,
  createCategory,
  deleteCategory,
  listActiveCategories,
  listArchivedCategories,
  unarchiveCategory,
  updateCategory,
  type Category,
} from '@/lib/categories'
import { isUniqueViolation } from '@/lib/errors'
import { toTestIdSuffix } from '@/lib/utils'
import { categoryMonthMovementsLabel } from '@/lib/visuals'

const byName = (a: Category, b: Category) => a.name.localeCompare(b.name)

/**
 * Administración de categorías (ADR-055), en su propia pantalla bajo Ajustes: la lista con su ícono, color y
 * los movimientos del mes; crear y editar en una hoja; las archivadas, plegadas al pie. Toda la validación
 * es de Postgres (C6): el nombre repetido lo rechaza el índice único y el borrado en uso, `delete_category`.
 */
export function CategoriesPage() {
  const { period } = usePeriodParam()
  const monthName = formatPeriodLong(period).split(' ')[0]
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [archived, setArchived] = useState<Category[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [showArchived, setShowArchived] = useState(false)
  const [sheet, setSheet] = useState<CategorySheetState>(null)
  // Desde `sm` la hoja es un popover que cuelga de «Nueva categoría», para crear y para editar: la fila es
  // ancha y no deja lugar al costado ni abajo, y así siempre aparece en el mismo lugar.
  const [newButton, setNewButton] = useState<HTMLElement | null>(null)
  const [saving, setSaving] = useState(false)
  // DEF-025: el error de guardar va en la hoja, donde se edita; el resto, arriba de la lista.
  const [sheetError, setSheetError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // US-89: la categoría que se quiere borrar y cuánto la usa, para la confirmación.
  const [deleting, setDeleting] = useState<{ category: Category; transactions: number; subscriptions: number } | null>(null)

  useEffect(() => {
    listActiveCategories().then(setCategories).catch((e: Error) => setError(e.message))
    listArchivedCategories().then(setArchived).catch(() => {})
  }, [])

  useEffect(() => {
    countCategoryMovementsInPeriod(period).then(setCounts).catch(() => setCounts({}))
  }, [period])

  function open(next: CategorySheetState) {
    setError(null)
    setSheetError(null)
    setSheet(next)
  }

  function closeSheet() {
    if (saving) return
    setSheet(null)
    setSheetError(null)
  }

  async function onSubmit(draft: CategoryDraft) {
    if (!sheet) return
    setSheetError(null)
    setSaving(true)
    try {
      if (sheet.mode === 'create') {
        const created = await createCategory(draft)
        setCategories((prev) => [...(prev ?? []), created].sort(byName))
      } else {
        const id = sheet.category.id
        await updateCategory(id, draft)
        setCategories((prev) => prev?.map((c) => (c.id === id ? { ...c, ...draft } : c)).sort(byName) ?? null)
      }
      setSheet(null)
    } catch (err) {
      setSheetError(isUniqueViolation(err) ? 'Ya existe una categoría activa con ese nombre' : 'No se pudo guardar la categoría')
    } finally {
      setSaving(false)
    }
  }

  async function onArchive(category: Category) {
    setSheet(null)
    setError(null)
    try {
      const archivedAt = today().toISOString()
      await archiveCategory(category.id, archivedAt)
      setArchived((prev) => [...prev, { ...category, archived_at: archivedAt }].sort(byName))
      setCategories((prev) => prev?.filter((c) => c.id !== category.id) ?? null)
    } catch {
      setError('No se pudo archivar la categoría')
    }
  }

  // DEF-026: reactivar deshace el archivado; si ya hay una activa con ese nombre, lo dice.
  async function onUnarchive(category: Category) {
    setError(null)
    try {
      await unarchiveCategory(category.id)
      setArchived((prev) => prev.filter((c) => c.id !== category.id))
      setCategories((prev) => [...(prev ?? []), { ...category, archived_at: null }].sort(byName))
    } catch (err) {
      setError(isUniqueViolation(err) ? `Ya hay una categoría activa llamada «${category.name}»` : 'No se pudo reactivar la categoría')
    }
  }

  // US-89: cuenta el uso antes de confirmar; la regla real (rechazar con uso) la aplica Postgres (C6).
  async function onAskDelete(category: Category) {
    setSheet(null)
    setError(null)
    try {
      setDeleting({ category, ...(await countCategoryUsage(category.id)) })
    } catch {
      setError('No se pudo consultar el uso de la categoría')
    }
  }

  async function onConfirmDelete() {
    if (!deleting) return
    const id = deleting.category.id
    try {
      await deleteCategory(id)
      setCategories((prev) => prev?.filter((c) => c.id !== id) ?? null)
      setArchived((prev) => prev.filter((c) => c.id !== id))
      setDeleting(null)
      toast.success('Categoría eliminada', { testId: 'settings-categories-deleted' })
    } catch (err) {
      setDeleting(null)
      setError((err as { message?: string }).message || 'No se pudo eliminar la categoría')
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <PageHeader
        title="Categorías"
        testId="settings-categories-title"
        className="pb-0 lg:pb-0"
        leading={
          <Link
            to="/settings"
            data-testid="settings-categories-back"
            className="press -ml-1 inline-flex min-h-11 items-center rounded-full px-1 text-callout font-medium text-primary hover:underline"
          >
            ‹ Ajustes
          </Link>
        }
      >
        <Button
          ref={setNewButton}
          type="button"
          size="sm"
          data-testid="settings-categories-new"
          onClick={() => open({ mode: 'create' })}
        >
          <Plus strokeWidth={2} />
          Nueva categoría
        </Button>
      </PageHeader>

      {error && (
        <p role="alert" data-testid="settings-categories-error" className="px-1 text-sm text-destructive">
          {error}
        </p>
      )}

      {categories !== null && categories.length === 0 && (
        <p data-testid="settings-categories-empty" className="rounded-xl bg-card px-4 py-5 text-callout text-muted-foreground">
          No tenés categorías activas. Creá una o reactivá una archivada.
        </p>
      )}
      {categories !== null && categories.length > 0 && (
        <GroupedCard>
          <ul data-testid="settings-categories-list" className="contents">
            {categories.map((category) => (
              <li key={category.id} className="px-1.5">
                {/* El renglón entero abre la edición (ADR-055): ícono, nombre y movimientos del mes. */}
                <button
                  type="button"
                  data-testid={`settings-categories-edit-${toTestIdSuffix(category.name)}`}
                  aria-label={`Editar ${category.name}`}
                  className="press flex min-h-16 w-full min-w-0 items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-accent/60"
                  onClick={() => open({ mode: 'edit', category })}
                >
                  <CategoryIcon name={category.name} color={category.color} icon={category.icon} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-callout font-medium break-words">{category.name}</span>
                    <span data-testid={`settings-categories-count-${toTestIdSuffix(category.name)}`} className="block text-footnote text-muted-foreground">
                      {categoryMonthMovementsLabel(counts[category.id] ?? 0, monthName)}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" strokeWidth={1.6} className="size-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        </GroupedCard>
      )}

      {/* DEF-026: sin esto, archivar era de ida. Plegadas: no es lo que se viene a hacer acá. */}
      {archived.length > 0 && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-testid="settings-categories-archived-toggle"
            aria-expanded={showArchived}
            aria-controls="settings-categories-archived"
            onClick={() => setShowArchived((prev) => !prev)}
            className="press flex min-h-11 items-center gap-1.5 self-start rounded-full px-1 text-footnote font-semibold text-muted-foreground hover:text-foreground"
          >
            <ChevronDown aria-hidden="true" strokeWidth={1.8} className={`size-4 transition-transform ${showArchived ? '' : '-rotate-90'}`} />
            Archivadas ({archived.length})
          </button>
          {showArchived && (
            <div id="settings-categories-archived">
              <GroupedCard>
                <ul data-testid="settings-categories-archived-list" className="contents">
                  {archived.map((category, i) => (
                    <li key={category.id} className="flex min-h-16 items-center gap-3 py-2 pr-1.5 pl-4">
                      <CategoryIcon name={category.name} color={category.color} icon={category.icon} />
                      <span className="min-w-0 flex-1 text-callout font-medium break-words text-muted-foreground">{category.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-testid={uniqueTestId(`settings-categories-unarchive-${toTestIdSuffix(category.name)}`, archived, i)}
                        aria-label={`Reactivar ${category.name}`}
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => onUnarchive(category)}
                      >
                        <ArchiveRestore strokeWidth={1.6} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-testid={uniqueTestId(`settings-categories-delete-archived-${toTestIdSuffix(category.name)}`, archived, i)}
                        aria-label={`Eliminar ${category.name}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => onAskDelete(category)}
                      >
                        <Trash2 strokeWidth={1.6} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </GroupedCard>
            </div>
          )}
        </div>
      )}

      <CategorySheet
        state={sheet}
        anchor={newButton}
        error={sheetError}
        saving={saving}
        onClose={closeSheet}
        onSubmit={onSubmit}
        onArchive={onArchive}
        onDelete={onAskDelete}
      />

      <ConfirmDialog
        isOpen={deleting !== null}
        title="¿Eliminar categoría?"
        summary={deleting ? categoryDeletionSummary(deleting.category.name, deleting) : undefined}
        confirmLabel="Eliminar"
        busyLabel="Eliminando…"
        testId="settings-categories-delete-dialog"
        onConfirm={onConfirmDelete}
        onClose={() => setDeleting(null)}
      >
        {deleting && (deleting.transactions > 0 || deleting.subscriptions > 0) ? (
          <p data-testid="settings-categories-delete-impact" className="font-medium text-destructive">
            No se puede eliminar una categoría en uso. Archivala si no la querés ver más.
          </p>
        ) : (
          <p data-testid="settings-categories-delete-impact">Se borra para siempre y su nombre queda libre.</p>
        )}
      </ConfirmDialog>
    </div>
  )
}

/**
 * Puede haber dos archivadas con el mismo nombre (archivar "Salud", crear otra "Salud" y archivarla):
 * la segunda lleva un sufijo para que su data-testid siga siendo único (DEF-015).
 */
function uniqueTestId(base: string, items: readonly { name: string }[], index: number): string {
  const repeats = items.slice(0, index).filter((item) => toTestIdSuffix(item.name) === toTestIdSuffix(items[index].name)).length
  return repeats === 0 ? base : `${base}-${repeats + 1}`
}
