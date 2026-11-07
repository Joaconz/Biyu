import { cn } from '@/lib/utils'
import { Wordmark } from './Wordmark'

/**
 * Header del celular: material translúcido con el contenido pasando por debajo. El filete inferior
 * aparece solo cuando hay algo debajo (efecto de borde de scroll, apple-design §12).
 */
export function AppHeader({ scrolled }: { scrolled: boolean }) {
  return (
    <header
      className={cn(
        'app-header chrome sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] transition-[border-color] duration-(--dur-fade)',
        scrolled ? 'border-hairline' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-(--app-header-h) max-w-xl items-center pl-5">
        <Wordmark className="text-title-2" />
      </div>
    </header>
  )
}
