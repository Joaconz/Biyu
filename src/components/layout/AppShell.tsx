import type { ReactNode } from 'react'

interface AppShellProps {
  children: ReactNode
  /** Contenido del extremo derecho del header (acciones de la pantalla). */
  actions?: ReactNode
}

// Layout mobile-first: una columna centrada, respeta el notch y usa dvh para
// que la barra del navegador móvil no corte el contenido.
export function AppShell({ children, actions }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)]">
      <header className="flex h-14 items-center justify-between">
        <span className="text-lg font-semibold tracking-tight">Biyu</span>
        {actions}
      </header>
      <main className="flex flex-1 flex-col gap-4 pb-6">{children}</main>
    </div>
  )
}
