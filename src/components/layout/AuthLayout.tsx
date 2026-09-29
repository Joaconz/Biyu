import { ArrowLeftRight, CalendarRange, ChartNoAxesColumn, type LucideIcon } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Wordmark } from './Wordmark'

const BRAND_GREEN = '#1b4d3e' // --primary
const ECRU = '#f9f6f0' // --background, el theme-color de index.html

/**
 * Entrar / Crear cuenta. En el celular, la marca ocupa la parte de arriba sobre verde y el
 * formulario sube como una hoja desde abajo, donde llega el pulgar. Desde 1024 px, pantalla
 * partida. Tres líneas cuentan qué hace la app antes de pedir nada.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  // La barra del navegador toma el verde del panel y vuelve al ecru al salir (mobile-native).
  useEffect(() => {
    const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    metas.forEach((m) => (m.content = BRAND_GREEN))
    return () => metas.forEach((m) => (m.content = ECRU))
  }, [])

  return (
    <div className="flex min-h-dvh flex-col bg-primary text-primary-foreground lg:grid lg:grid-cols-2">
      <div className="flex flex-1 flex-col justify-between gap-6 px-6 pt-[max(env(safe-area-inset-top),2rem)] pb-8 lg:justify-center lg:gap-14 lg:px-16 lg:py-16">
        <div>
          <Wordmark className="text-[2.75rem] leading-none text-primary-foreground lg:text-[3.5rem]" />
          <p className="mt-3 text-headline text-primary-foreground/80 lg:text-title-2">
            En qué se fue la plata este mes.
          </p>
        </div>
        <FeatureList />
      </div>

      <div className="rounded-t-[1.75rem] bg-background px-6 pt-7 pb-[max(env(safe-area-inset-bottom),2rem)] text-foreground lg:flex lg:items-center lg:justify-center lg:rounded-none lg:px-16">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}

/** Lo que la app ya hace en V1, en una línea cada cosa. Nada de montos: todavía no hay datos del usuario. */
const FEATURES: { icon: LucideIcon; title: string; detail: string }[] = [
  { icon: ArrowLeftRight, title: 'Pesos y dólares', detail: 'Cada gasto guarda el tipo de cambio que usaste.' },
  { icon: CalendarRange, title: 'Cuotas sin cuentas', detail: 'Cada cuota cae sola en su mes.' },
  { icon: ChartNoAxesColumn, title: 'Tu mes, de un vistazo', detail: 'En qué se fue la plata, por categoría.' },
]

function FeatureList() {
  return (
    <ul className="flex max-w-sm flex-col gap-4">
      {FEATURES.map(({ icon: Icon, title, detail }) => (
        <li key={title} className="flex items-start gap-3.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground">
            <Icon aria-hidden="true" className="size-5" strokeWidth={1.7} />
          </span>
          <span className="flex flex-col gap-0.5 pt-0.5">
            <span className="text-callout font-semibold text-primary-foreground">{title}</span>
            <span className="text-footnote text-primary-foreground/70">{detail}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
