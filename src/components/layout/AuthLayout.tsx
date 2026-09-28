import type { ReactNode } from 'react'
import { Wordmark } from './Wordmark'

/** Entrar / Crear cuenta: sin navegación, la marca arriba y el formulario en una columna angosta. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col px-6 pt-[max(env(safe-area-inset-top),3rem)] pb-[max(env(safe-area-inset-bottom),2rem)] sm:items-center sm:justify-center sm:pt-12">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <Wordmark rule className="text-[2.5rem] leading-none tracking-[-0.02em]" />
          <p className="mt-4 text-callout text-muted-foreground">En qué se fue la plata este mes.</p>
        </div>
        {children}
      </div>
    </div>
  )
}
