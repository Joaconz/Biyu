import { Compass } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { Wordmark } from '@/components/layout/Wordmark'

/** DEF-001: ruta catch-all (route "*"). Antes, una ruta inexistente mostraba el error crudo del router. */
export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center text-foreground">
      <Wordmark className="text-headline text-primary" />
      <div
        data-testid="not-found"
        className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-input/50 px-8 py-12"
      >
        <Compass aria-hidden="true" strokeWidth={1.7} className="size-9 text-muted-foreground" />
        <p className="text-title-2 font-semibold">Esta página no existe</p>
        <p data-testid="not-found-message" className="max-w-64 text-callout text-muted-foreground">
          Revisá la dirección o volvé a la app.
        </p>
        <Link to="/" data-testid="not-found-home" className={buttonVariants({ variant: 'default', className: 'mt-2' })}>
          Volver a Biyu
        </Link>
      </div>
    </div>
  )
}
