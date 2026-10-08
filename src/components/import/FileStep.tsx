import { useRef, useState, type DragEvent } from 'react'
import { Download, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * Paso 1 · Archivo (§1): la plantilla, la zona para elegir o arrastrar el .xlsx y el error de archivo
 * (A1–A7) debajo. Validar el archivo es de quien lo recibe (`onFile`), no de este componente.
 */
export function FileStep({
  error,
  reading,
  onFile,
  onDownloadTemplate,
}: {
  error: string | null
  reading: boolean
  onFile: (file: File) => void
  onDownloadTemplate: () => void
}) {
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && !reading) onFile(file)
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="text-callout text-muted-foreground">
        Subí una planilla .xlsx con un movimiento por fila. La primera fila tiene que tener los encabezados de la
        plantilla.
      </p>

      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={onDownloadTemplate}
        data-testid="import-template-download"
      >
        <Download aria-hidden="true" />
        Descargar plantilla
      </Button>

      <div
        data-testid="import-file-dropzone"
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(e) => {
          // Pasar por encima del botón o del ícono también dispara dragleave en la zona.
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
        }}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-3 rounded-xl border border-dashed border-input bg-card px-5 py-8 text-center transition-colors duration-(--dur-fade)',
          dragging && 'border-primary bg-accent',
        )}
      >
        <FileSpreadsheet aria-hidden="true" className="size-8 text-muted-foreground" strokeWidth={1.5} />
        <Button
          type="button"
          onClick={() => input.current?.click()}
          disabled={reading}
          aria-describedby={error ? 'import-file-error' : undefined}
          data-testid="import-file-pick"
        >
          {reading ? 'Leyendo…' : 'Elegir archivo .xlsx'}
        </Button>
        <span className="hidden text-footnote text-muted-foreground lg:inline">o arrastralo acá</span>
        <input
          ref={input}
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          data-testid="import-file-input"
          onChange={(e) => {
            const file = e.target.files?.[0]
            // Vaciar el input deja volver a elegir el mismo archivo después de corregirlo.
            e.target.value = ''
            if (file) onFile(file)
          }}
        />
      </div>

      {error && (
        <p
          id="import-file-error"
          role="alert"
          data-testid="import-file-error"
          className="rounded-lg bg-destructive/8 p-4 text-callout text-destructive"
        >
          {error}
        </p>
      )}

      <p className="text-footnote text-muted-foreground">Hasta 500 filas y 1 MB. Solo se lee la primera hoja.</p>
    </div>
  )
}
