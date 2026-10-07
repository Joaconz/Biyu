import { ChartNoAxesColumn, CirclePlus, HandCoins, ReceiptText, Settings, type LucideIcon } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { NAV_ITEMS_V1, navHref, navTestId, type Screen } from '@/lib/navigation'
import { Wordmark } from './Wordmark'

const ICONS: Record<Screen, LucideIcon> = {
  register: CirclePlus,
  dashboard: ChartNoAxesColumn,
  transactions: ReceiptText,
  debts: HandCoins,
  settings: Settings,
}

/**
 * Un solo <nav> para las dos formas (ADR-023): barra inferior translúcida en el celular y sidebar
 * desde 1024px. Nunca se montan dos copias, así ningún data-testid queda duplicado en el DOM.
 */
export function AppNav({ screen, showSettings }: { screen: Screen | null; showSettings: boolean }) {
  return (
    <nav
      aria-label="Principal"
      className="app-nav chrome fixed inset-x-0 bottom-0 z-40 flex border-t border-hairline pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] lg:inset-y-0 lg:right-auto lg:w-60 lg:flex-col lg:border-t-0 lg:border-r lg:bg-background lg:px-4 lg:pb-6 lg:backdrop-filter-none"
    >
      <div className="hidden px-3 pt-9 pb-8 lg:block">
        <Wordmark rule className="text-title-1" />
      </div>
      <ul className="grid flex-1 grid-cols-3 lg:flex lg:flex-none lg:flex-col lg:gap-1">
        {NAV_ITEMS_V1.map((item) => (
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
  const { search } = useLocation()
  const Icon = ICONS[destination]
  return (
    <NavLink
      to={navHref(destination, screen, search)}
      data-testid={navTestId(screen ?? 'register', destination)}
      className={({ isActive }) =>
        cn(
          'press relative flex h-(--app-nav-h) flex-col items-center justify-center gap-1 text-tab font-medium text-muted-foreground outline-offset-[-4px]',
          'lg:h-11 lg:flex-row lg:justify-start lg:gap-3 lg:rounded-lg lg:px-3 lg:text-callout',
          'hover:text-foreground lg:hover:bg-accent',
          isActive && 'text-primary lg:bg-muted lg:text-primary',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon aria-hidden="true" className="size-6 lg:size-5" strokeWidth={isActive ? 2 : 1.6} />
          <span className={cn(isActive && 'font-semibold')}>{label}</span>
          {/* Marca del activo: un punto dorado en la barra, un filete dorado en la sidebar. */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute top-1 size-1 rounded-full bg-gold transition-opacity duration-(--dur-fade) lg:inset-y-2.5 lg:top-auto lg:left-0 lg:h-auto lg:w-0.5 lg:rounded-none',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          />
        </>
      )}
    </NavLink>
  )
}
