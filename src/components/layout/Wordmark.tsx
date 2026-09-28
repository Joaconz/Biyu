import { cn } from '@/lib/utils'

/** "Biyu" en Playfair. El filete dorado es el microdetalle de oro (ADR-023); nunca va en el texto. */
export function Wordmark({ className, rule = false }: { className?: string; rule?: boolean }) {
  return (
    <span className={cn('inline-flex flex-col items-start font-serif font-semibold text-foreground', className)}>
      <span>Biyu</span>
      {rule && <span aria-hidden="true" className="mt-2 h-px w-8 bg-gold" />}
    </span>
  )
}
