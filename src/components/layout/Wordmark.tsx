import { cn } from '@/lib/utils'

/**
 * "biyu" en la fuente de la interfaz, en negrita y apretada: la marca sale del peso y del punto
 * dorado, no de una serif (ADR-023). El oro es decorativo: nunca va en el texto.
 */
export function Wordmark({ className, rule = false }: { className?: string; rule?: boolean }) {
  return (
    <span className={cn('inline-flex flex-col items-start font-bold tracking-[-0.04em] text-foreground', className)}>
      <span>
        biyu<span aria-hidden="true" className="text-gold">.</span>
      </span>
      {rule && <span aria-hidden="true" className="mt-2 h-px w-8 bg-gold" />}
    </span>
  )
}
