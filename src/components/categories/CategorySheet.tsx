import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Drawer } from '@base-ui/react/drawer'
import { Popover } from '@base-ui/react/popover'
import { Archive, Trash2 } from 'lucide-react'
import { CategoryIcon, CATEGORY_ICONS } from '@/components/shared/CategoryIcon'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SM_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { CATEGORY_COLOR_PALETTE, type Category } from '@/lib/categories'
import { cn, toTestIdSuffix } from '@/lib/utils'
import { CATEGORY_ICON_KEYS, CATEGORY_ICON_LABELS, displayCategoryColor, resolveCategoryIconKey } from '@/lib/visuals'

/** Lo que se guarda al crear o editar: el nombre, un color de la paleta y la clave del ícono (o null: punto de color). */
export interface CategoryDraft {
  name: string
  color: string
  icon: string | null
}

export type CategorySheetState = { mode: 'create' } | { mode: 'edit'; category: Category } | null

interface CategorySheetProps {
  state: CategorySheetState
  /** Desde `sm` la hoja es un popover que cuelga de este elemento. */
  anchor: HTMLElement | null
  error: string | null
  saving: boolean
  onClose: () => void
  onSubmit: (draft: CategoryDraft) => void
  onArchive: (category: Category) => void
  onDelete: (category: Category) => void
}

const BACKDROP_CLASS =
  'fixed inset-0 z-50 bg-black/40 transition-opacity duration-[400ms] ease-drawer data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0'

const DRAWER_POPUP_CLASS =
  'w-full max-h-[90dvh] translate-y-[var(--drawer-swipe-movement-y,0px)] overflow-y-auto overscroll-contain rounded-t-3xl bg-popover pb-[env(safe-area-inset-bottom)] text-popover-foreground outline-none transition-transform duration-[400ms] ease-drawer data-ending-style:translate-y-full data-ending-style:duration-[calc(var(--drawer-swipe-strength,1)*300ms)] data-starting-style:translate-y-full data-swiping:duration-0 motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0'

const POPOVER_POPUP_CLASS =
  'max-h-(--available-height) w-[min(30rem,calc(100vw-2rem))] origin-(--transform-origin) overflow-y-auto rounded-2xl bg-popover shadow-xl ring-1 ring-hairline text-popover-foreground outline-none transition-[transform,opacity] duration-(--dur-fade) ease-out-quick data-ending-style:scale-[0.97] data-ending-style:opacity-0 data-ending-style:duration-100 data-starting-style:scale-[0.97] data-starting-style:opacity-0 motion-reduce:data-ending-style:scale-100 motion-reduce:data-starting-style:scale-100'

/**
 * Hoja para crear y editar una categoría (ADR-055), con el mismo patrón que las opciones del balance del
 * Resumen (ADR-051): en el celular una hoja desde abajo que se cierra deslizándola; desde `sm`, un popover
 * que nace de la fila. Es una sola hoja para las dos acciones: lo que cambia es el contenido.
 */
export function CategorySheet({ state, anchor, onClose, ...formProps }: CategorySheetProps) {
  const asSheet = !useMediaQuery(SM_QUERY)
  // Al cerrar, el estado pasa a null antes de que termine la animación de salida: se conserva el último
  // para que la hoja no se vacíe mientras se va.
  const last = useRef<Exclude<CategorySheetState, null>>({ mode: 'create' })
  if (state) last.current = state
  const shown = last.current
  const open = state !== null
  const title = shown.mode === 'create' ? 'Nueva categoría' : 'Editar categoría'
  const formKey = shown.mode === 'create' ? 'create' : shown.category.id
  const onOpenChange = (next: boolean) => {
    if (!next) onClose()
  }

  if (asSheet) {
    return (
      <Drawer.Root open={open} onOpenChange={onOpenChange}>
        <Drawer.Portal>
          <Drawer.Backdrop className={BACKDROP_CLASS} />
          <Drawer.Viewport className="fixed inset-0 z-50 flex flex-col justify-end">
            {/* Sin foco inicial en el campo: en el celular abriría el teclado sobre la grilla. */}
            <Drawer.Popup data-testid="settings-categories-sheet" initialFocus={false} className={DRAWER_POPUP_CLASS}>
              <div aria-hidden="true" className="mx-auto mt-2 h-1 w-9 rounded-full bg-input" />
              <CategoryForm
                key={formKey}
                shown={shown}
                title={<Drawer.Title className="text-headline font-semibold">{title}</Drawer.Title>}
                onCancel={onClose}
                {...formProps}
              />
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    )
  }

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Portal>
        <Popover.Positioner anchor={anchor} side="bottom" align="end" sideOffset={6} collisionPadding={16} className="z-50">
          <Popover.Popup data-testid="settings-categories-sheet" className={POPOVER_POPUP_CLASS}>
            <CategoryForm
              key={formKey}
              shown={shown}
              title={<Popover.Title className="text-headline font-semibold">{title}</Popover.Title>}
              onCancel={onClose}
              {...formProps}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}

function CategoryForm({
  shown,
  title,
  error,
  saving,
  onCancel,
  onSubmit,
  onArchive,
  onDelete,
}: Pick<CategorySheetProps, 'error' | 'saving' | 'onSubmit' | 'onArchive' | 'onDelete'> & {
  shown: Exclude<CategorySheetState, null>
  title: ReactNode
  onCancel: () => void
}) {
  const editing = shown.mode === 'edit' ? shown.category : null
  // Los ids de siempre: crear usa `settings-categories-*` y editar `settings-categories-edit-*` (DEF-025).
  const prefix = editing ? 'settings-categories-edit' : 'settings-categories'
  const [name, setName] = useState(editing?.name ?? '')
  // Una categoría con color de la paleta vieja se abre con su equivalente apagado, y al guardar queda ese.
  const [color, setColor] = useState(editing ? displayCategoryColor(editing.color, editing.name) : CATEGORY_COLOR_PALETTE[0])
  // Una sembrada sin ícono guardado se abre con el suyo, así renombrarla no se lo quita.
  const [icon, setIcon] = useState<string | null>(editing ? resolveCategoryIconKey(editing.icon, editing.name) : null)
  const trimmed = name.trim()

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (trimmed) onSubmit({ name: trimmed, color, icon })
  }

  return (
    <form onSubmit={submit} data-testid={`${prefix}-form`} className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-3">
        <div data-testid="settings-categories-preview" className="flex min-w-0 flex-1 items-center gap-3">
          <CategoryIcon name={trimmed || 'Categoría'} color={color} icon={icon} size="lg" />
          <div className="min-w-0 flex-1">
            {title}
            <p className={cn('truncate text-footnote', trimmed ? 'text-foreground' : 'text-muted-foreground')}>
              {trimmed || 'Así se va a ver'}
            </p>
          </div>
        </div>
      </div>

      <label className="grid gap-1.5 text-footnote font-medium text-muted-foreground">
        Nombre
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          data-testid={`${prefix}-name`}
          aria-label="Nombre de la categoría"
          placeholder="Tecnología"
          className="text-base text-foreground"
        />
      </label>

      <div className="grid gap-2">
        <span id={`${prefix}-icon-label`} className="text-footnote font-medium text-muted-foreground">Ícono</span>
        <div role="radiogroup" aria-labelledby={`${prefix}-icon-label`} data-testid={`${prefix}-icon`} className="grid grid-cols-7 justify-items-center gap-2 sm:grid-cols-9">
          <IconOption
            testId={`${prefix}-icon-none`}
            label="Sin ícono"
            selected={icon === null}
            onSelect={() => setIcon(null)}
          >
            <span aria-hidden="true" className="size-2.5 rounded-full bg-current" />
          </IconOption>
          {CATEGORY_ICON_KEYS.map((key) => {
            const Icon = CATEGORY_ICONS[key]
            return (
              <IconOption
                key={key}
                testId={`${prefix}-icon-${key}`}
                label={CATEGORY_ICON_LABELS[key]}
                selected={icon === key}
                onSelect={() => setIcon(key)}
              >
                <Icon aria-hidden="true" strokeWidth={1.6} className="size-5" />
              </IconOption>
            )
          })}
        </div>
      </div>

      <div className="grid gap-2">
        <span id={`${prefix}-color-label`} className="text-footnote font-medium text-muted-foreground">Color</span>
        <div role="radiogroup" aria-labelledby={`${prefix}-color-label`} data-testid={`${prefix}-color`} className="grid grid-cols-5 justify-items-center gap-2.5">
          {CATEGORY_COLOR_PALETTE.map((swatch) => (
            <button
              key={swatch}
              type="button"
              role="radio"
              aria-checked={color === swatch}
              aria-label={swatch}
              data-testid={`${prefix}-color-${swatch.slice(1).toLowerCase()}`} // DEF-015
              onClick={() => setColor(swatch)}
              className="press size-10 rounded-full ring-offset-2 ring-offset-popover outline-none aria-checked:ring-2 aria-checked:ring-foreground focus-visible:ring-2 focus-visible:ring-ring"
              style={{ backgroundColor: swatch }}
            />
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" data-testid={`${prefix}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} data-testid="settings-categories-cancel" className="flex-1">
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={saving || !trimmed}
          data-testid={editing ? 'settings-categories-save' : 'settings-categories-submit'}
          className="flex-1"
        >
          {editing ? 'Guardar' : 'Crear categoría'}
        </Button>
      </div>

      {editing && (
        <div className="flex items-center justify-between gap-2 border-t border-hairline pt-3">
          <button
            type="button"
            data-testid={`settings-categories-archive-${toTestIdSuffix(editing.name)}`}
            onClick={() => onArchive(editing)}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-muted-foreground hover:text-foreground')}
          >
            <Archive strokeWidth={1.6} />
            Archivar
          </button>
          <button
            type="button"
            data-testid={`settings-categories-delete-${toTestIdSuffix(editing.name)}`}
            onClick={() => onDelete(editing)}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'text-destructive hover:text-destructive')}
          >
            <Trash2 strokeWidth={1.6} />
            Eliminar
          </button>
        </div>
      )}
    </form>
  )
}

function IconOption({
  testId,
  label,
  selected,
  onSelect,
  children,
}: {
  testId: string
  label: string
  selected: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      title={label}
      data-testid={testId}
      onClick={onSelect}
      className="press flex size-10 items-center justify-center rounded-xl border border-hairline bg-card text-muted-foreground outline-none hover:border-input aria-checked:border-primary aria-checked:bg-[color-mix(in_srgb,var(--primary)_9%,var(--card))] aria-checked:text-primary aria-checked:ring-1 aria-checked:ring-primary aria-checked:ring-inset focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  )
}
