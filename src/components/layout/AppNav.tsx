import type { MouseEvent } from 'react'
import { ChartNoAxesColumn, CirclePlus, HandCoins, Plus, ReceiptText, Repeat, Settings, type LucideIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import {
  MOBILE_NAV_SCREENS,
  NAV_ITEMS,
  SCREEN_LABELS,
  activeNavScreen,
  isCurrentNavTarget,
  navHref,
  navTestId,
  type Screen,
} from '@/lib/navigation'
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
export function AppNav({ screen, isDesktop }: { screen: Screen | null; isDesktop: boolean }) {
  // ADR-048: en el celular son cinco destinos con Registrar al centro; en desktop, los de NAV_ITEMS y Ajustes al pie.
  const destinations = isDesktop ? NAV_ITEMS.map((item) => item.screen) : MOBILE_NAV_SCREENS
  // Un solo indicador que se desliza entre columnas; las pantallas sin ítem no marcan ninguno.
  const active = activeNavScreen(screen)
  const activeIndex = active ? destinations.indexOf(active) : -1
  return (
    <>
      {/* B1: franja fija de ancho completo detrás de la píldora. Se traga los toques del aire que la rodea
          (y el de entre ella y los pies sticky), que si no llegarían al contenido de atrás. Mide lo mismo que
          --app-nav-offset, que <main> ya reserva abajo, así que no tapa nada. */}
      {!isDesktop && <div aria-hidden="true" data-testid="app-nav-shield" className="app-nav-shield" />}
      <nav
        aria-label="Principal"
        className={cn(
          // ADR-052: en el celular, una píldora esmeralda en los dos temas (la misma superficie que la protagonista).
          'app-nav fixed z-40 mx-auto flex h-(--app-nav-h) max-w-md overflow-hidden rounded-full border border-hero-foreground/10 bg-[color-mix(in_srgb,var(--hero)_94%,transparent)] backdrop-blur-xl',
          'inset-x-[max(0.75rem,env(safe-area-inset-left),env(safe-area-inset-right))] bottom-[calc(env(safe-area-inset-bottom)+var(--app-nav-gap))]',
          'lg:inset-y-0 lg:right-auto lg:left-0 lg:mx-0 lg:h-auto lg:w-60 lg:max-w-none lg:flex-col lg:overflow-visible lg:rounded-none lg:border-0 lg:border-r lg:border-hairline lg:bg-background lg:px-4 lg:pb-6 lg:backdrop-filter-none',
        )}
      >
        <div className="hidden px-3 pt-9 pb-8 lg:block">
          <Wordmark rule className="text-title-1" />
        </div>
        <ul className="relative grid flex-1 grid-cols-5 lg:flex lg:flex-none lg:flex-col lg:gap-1">
          {!isDesktop && (
            <li
              aria-hidden="true"
              data-testid="app-nav-indicator"
              data-index={activeIndex}
              className="app-nav-indicator pointer-events-none absolute inset-y-1 left-0 w-1/5 p-0.5"
              style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)`, opacity: activeIndex < 0 ? 0 : 1 }}
            >
              <span className="block size-full rounded-full bg-hero-foreground/10" />
            </li>
          )}
          {destinations.map((destination) => (
            <li key={destination}>
              <NavItemLink screen={screen} destination={destination} label={SCREEN_LABELS[destination]} />
            </li>
          ))}
        </ul>
        {isDesktop && (
          <div className="mt-auto">
            <NavItemLink screen={screen} destination="settings" label={SCREEN_LABELS.settings} />
          </div>
        )}
      </nav>
    </>
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
        'press relative flex h-(--app-nav-h) flex-col items-center justify-center gap-0.5 text-tab font-medium whitespace-nowrap max-lg:text-[0.625rem] max-lg:tracking-normal text-hero-muted outline-offset-[-4px]',
        'lg:h-12 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-xl lg:px-3 lg:text-callout lg:text-muted-foreground',
        'hover:text-hero-foreground lg:hover:bg-accent lg:hover:text-foreground',
        isActive && 'text-hero-foreground lg:bg-secondary lg:text-foreground',
      )}
    >
      {destination === 'register' ? (
        <>
          {/* ADR-048: Registrar es la acción más frecuente; en el celular lleva un botón sólido. */}
          <span className="grid size-7 place-items-center rounded-full bg-hero-accent text-hero lg:hidden">
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
