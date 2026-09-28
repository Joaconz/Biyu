import type { ReactNode } from 'react'

/** Rótulo de sección del formulario: chico y en secundario, para que el monto sea el protagonista. */
export function SectionLabel({ id, children }: { id: string; children: ReactNode }) {
  return (
    <span id={id} className="text-footnote font-medium text-muted-foreground">
      {children}
    </span>
  )
}
