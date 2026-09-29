import { useEffect, useRef, useState } from 'react'
import { Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { DESKTOP_QUERY, useMediaQuery } from '@/hooks/useMediaQuery'
import { useVisualViewportInset } from '@/hooks/useVisualViewportInset'
import { screenFromPath } from '@/lib/navigation'
import { fetchSetupStatus } from '@/lib/setup'
import { AppHeader } from './AppHeader'
import { AppNav } from './AppNav'

/**
 * Layout de las rutas privadas (ADR-023). Queda montado al cambiar de pestaña, así el cromo
 * translúcido no parpadea. Scrollea el documento, no un contenedor: la barra de Safari se sigue
 * escondiendo y los sticky funcionan.
 */
export function AppLayout() {
  useVisualViewportInset()
  const { pathname } = useLocation()
  const screen = screenFromPath(pathname)
  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const sentinel = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)
  // US-68 (ADR-025): una consulta por sesión (este layout queda montado entre pestañas). Si
  // falla, se trata como "no completado" — /setup es barato de volver a completar o saltear.
  const [setupPending, setSetupPending] = useState<boolean | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchSetupStatus()
      .then((s) => {
        if (!cancelled) setSetupPending(!s.completed)
      })
      .catch(() => {
        if (!cancelled) setSetupPending(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (setupPending === null) {
    return <p data-testid="app-layout-loading" className="p-6 text-muted-foreground">Cargando…</p>
  }
  if (setupPending) {
    return <Navigate to="/setup" replace />
  }

  return (
    <div className="min-h-dvh lg:pl-60">
      <div ref={sentinel} aria-hidden="true" className="absolute top-0 h-px w-px" />
      {!isDesktop && <AppHeader screen={screen} scrolled={scrolled} />}
      <AppNav screen={screen} showSettings={isDesktop} />
      <main className="px-5 pb-[calc(var(--app-nav-offset)+2.5rem)] sm:px-6 lg:px-10 lg:pt-10">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}
