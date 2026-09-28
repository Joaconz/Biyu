import { useEffect, type ReactNode } from 'react'
import { Wordmark } from './Wordmark'

const BRAND_GREEN = '#1b4d3e' // --primary
const ECRU = '#f9f6f0' // --background, el theme-color de index.html

/**
 * Entrar / Crear cuenta. En el celular, la marca ocupa la parte de arriba sobre verde y el
 * formulario sube como una hoja desde abajo, donde llega el pulgar. Desde 1024 px, pantalla
 * partida. El ejemplo del mes muestra qué responde la app antes de pedir nada.
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
        <MonthPreview />
      </div>

      <div className="rounded-t-[1.75rem] bg-background px-6 pt-7 pb-[max(env(safe-area-inset-bottom),2rem)] text-foreground lg:flex lg:items-center lg:justify-center lg:rounded-none lg:px-16">
        <div className="mx-auto w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}

const PREVIEW_ROWS = [
  { label: 'Comida', share: 0.46 },
  { label: 'Transporte', share: 0.28 },
  { label: 'Servicios', share: 0.17 },
]

function previewTone(index: number): string {
  return index === 0 ? 'var(--gold)' : `color-mix(in srgb, var(--primary-foreground) ${index === 1 ? 55 : 35}%, transparent)`
}

/** Ilustración con montos ficticios (C14); para el lector de pantalla alcanza con el lema. */
function MonthPreview() {
  return (
    <div
      aria-hidden="true"
      className="max-w-sm rounded-2xl border border-primary-foreground/12 bg-primary-foreground/[0.06] p-4 lg:p-6"
    >
      <span className="text-footnote font-medium text-primary-foreground/70">Gastado en septiembre</span>
      <div className="tabular mt-0.5 text-title-2 font-bold lg:mt-1 lg:text-title-1">$128.450,00</div>
      {/* En el celular, una sola barra apilada: el formulario tiene que entrar sin scroll. */}
      <div className="mt-3 flex h-1.5 gap-0.5 overflow-hidden rounded-full lg:hidden">
        {PREVIEW_ROWS.map((row, i) => (
          <span key={row.label} style={{ flexGrow: row.share, backgroundColor: previewTone(i) }} />
        ))}
        <span className="grow-[0.09] bg-primary-foreground/10" />
      </div>
      <div className="mt-5 hidden flex-col gap-3 lg:flex">
        {PREVIEW_ROWS.map((row, i) => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-footnote text-primary-foreground/75">{row.label}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-primary-foreground/10">
              <span
                className="block h-full rounded-full"
                style={{ width: `${row.share * 100}%`, backgroundColor: previewTone(i) }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
