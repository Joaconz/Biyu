import { Button } from '@/components/ui/button'
import { ignoredColumnsMessage, type ImportSheet } from '@/domain/importFile'

/** Paso 2 · Revisión (§1). No escribe nada en la base. */
export function ReviewStep({
  fileName,
  sheet,
  onChangeFile,
}: {
  fileName: string
  sheet: ImportSheet
  onChangeFile: () => void
}) {
  const ignored = ignoredColumnsMessage(sheet.ignoredColumns)
  return (
    <div className="flex flex-col gap-5">
      <p data-testid="import-file-name" className="text-headline font-semibold break-all">
        {fileName}
      </p>
      {ignored && (
        <p data-testid="import-ignored-columns" className="text-footnote text-muted-foreground">
          {ignored}
        </p>
      )}
      <Button type="button" variant="outline" className="self-start" onClick={onChangeFile} data-testid="import-change-file">
        Elegir otro archivo
      </Button>
    </div>
  )
}
