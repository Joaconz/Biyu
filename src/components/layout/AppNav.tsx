import type { MouseEvent } from 'react'
import { ChartNoAxesColumn, CirclePlus, HandCoins, Plus, ReceiptText, Repeat, Settings, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, activeNavScreen, isCurrentNavTarget, navHref, navTestId, type Screen } from '@/lib/navigation'
import { Wordmark } from './Wordmark'

const ICONS: Record<Screen, LucideIcon> = {
  register: CirclePlus,
  dashboard: ChartNoAxesColumn,
  transactions: ReceiptText,
  debts: HandCoins,
  subscriptions: Repeat,
  settings: Settings,
}

/**
 * Un solo <nav> para las dos formas (ADR-023): píldora flotante translúcida en el celular (ADR-048)
 * y sidebar desde 1024px. Nunca se montan dos copias, así ningún data-testid queda duplicado.
 */
export function AppNav({ screen, showSettings }: { screen: Screen | null; showSettings: boolean }) {
  // ADR-048: un solo indicador que se desliza entre columnas. Ajustes y las pantallas sin ítem no marcan ninguno.
  const activeIndex = NAV_ITEMS.findIndex((item) => item.screen === activeNavScreen(screen))
  return (
    <nav
      aria-label="Principal"
      className={cn(
        'app-nav chrome fixed z-40 mx-auto flex h-(--app-nav-h) max-w-md overflow-hidden rounded-full border border-hairline',
        'inset-x-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))] bottom-[calc(env(safe-area-inset-bottom)+var(--app-nav-gap))]',
        'lg:inset-y-0 lg:right-auto lg:left-0 lg:mx-0 lg:h-auto lg:w-60 lg:max-w-none lg:flex-col lg:overflow-visible lg:rounded-none lg:border-0 lg:border-r lg:bg-background lg:px-4 lg:pb-6 lg:backdrop-filter-none',
      )}
    >
      <div className="hidden px-3 pt-9 pb-8 lg:block">
        <Wordmark rule className="text-title-1" />
      </div>
      <ul className="relative grid flex-1 grid-cols-4 lg:flex lg:flex-none lg:flex-col lg:gap-1">
        <li
          aria-hidden="true"
          data-testid="app-nav-indicator"
          data-index={activeIndex}
          className="app-nav-indicator pointer-events-none absolute inset-y-1 left-0 w-1/4 p-0.5 lg:hidden"
          style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`, opacity: activeIndex < 0 ? 0 : 1 }}
        >
          <span className="block size-full rounded-full bg-secondary" />
        </li>
        {NAV_ITEMS.map((item) => (
          <li key={item.screen}>
            <NavItemLink screen={screen} destination={item.screen} label={item.label} />
          </li>
        ))}
      </ul>
      {showSettings && (
        <div className="mt-auto hidden lg:block">
          <NavItemLink screen={screen} destination="settings" label="Ajustes" />
        </div>
      )}
    </nav>
  )
}

function NavItemLink({ screen, destination, label }: { screen: Screen | null; destination: Screen; label: string }) {
  const { pathname, search } = useLocation()
  const Icon = ICONS[destination]
  // US-69 · CA-3: el activo sale de la pantalla, no de la ruta (Movimientos marca Resumen).
  const isActive = activeNavScreen(screen) === destination

  // US-69 · CA-11: en la ruta exacta del ítem, tocarlo no hace nada (protege el borrador de Registrar).
  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    // Cmd/Ctrl/Shift+clic o el botón del medio abren otra pestaña: eso no toca el borrador.
    const opensElsewhere = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (!opensElsewhere && isCurrentNavTarget(destination, pathname)) event.preventDefault()
  }

  return (
    <Link
      to={navHref(destination, screen, search)}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      data-testid={navTestId(screen ?? 'register', destination)}
      className={cn(
        'press relative flex h-(--app-nav-h) flex-col items-center justify-center gap-0.5 text-tab font-medium whitespace-nowrap text-muted-foreground outline-offset-[-4px]',
        'lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-lg lg:px-3 lg:text-callout',
        'hover:text-foreground lg:hover:bg-accent',
        isActive && 'text-primary lg:bg-muted lg:text-primary',
      )}
    >
      {destination === 'register' ? (
        <>
          {/* ADR-048: Registrar es la acción más frecuente; en el celular lleva un botón sólido. */}
          <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground lg:hidden">
            <Plus aria-hidden="true" className="size-4" strokeWidth={2.4} />
          </span>
          <Icon aria-hidden="true" className="hidden size-5 lg:block" strokeWidth={isActive ? 2 : 1.6} />
        </>
      ) : (
        <Icon aria-hidden="true" className="size-6 lg:size-5" strokeWidth={isActive ? 2 : 1.6} />
      )}
      <span className={cn(isActive && 'font-semibold')}>{label}</span>
      {/* Marca del activo: en la sidebar un filete dorado; en el celular la marca es el indicador deslizante. */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute hidden transition-opacity duration-(--dur-fade) lg:inset-y-2.5 lg:left-0 lg:block lg:w-0.5 lg:bg-gold',
          isActive ? 'opacity-100' : 'opacity-0',
        )}
      />
    </Link>
  )
}
