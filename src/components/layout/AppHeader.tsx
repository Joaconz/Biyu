import { Settings } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '@/lib/utils'
import { navTestId, type Screen } from '@/lib/navigation'
import { Wordmark } from './Wordmark'

/**
 * Header del celular: material translúcido con el contenido pasando por debajo. El filete inferior
 * aparece solo cuando hay algo debajo (efecto de borde de scroll, apple-design §12).
 */
export function AppHeader({ screen, scrolled }: { screen: Screen | null; scrolled: boolean }) {
  return (
    <header
      className={cn(
        'chrome sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] transition-[border-color] duration-(--dur-fade)',
        scrolled ? 'border-hairline' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-(--app-header-h) max-w-xl items-center justify-between pr-2 pl-5">
        <Wordmark className="text-title-2" />
        <NavLink
          to="/settings"
          aria-label="Ajustes"
          data-testid={navTestId(screen ?? 'register', 'settings')}
          className={({ isActive }) =>
            cn(
              'press flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground',
              isActive && 'text-primary',
            )
          }
        >
          {({ isActive }) => <Settings aria-hidden="true" className="size-[1.375rem]" strokeWidth={isActive ? 2 : 1.6} />}
        </NavLink>
      </div>
    </header>
  )
}
