import { useEffect, useRef, type MouseEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { parseDraftInput } from '@/domain/draft'
import {
  formatFieldAmount,
  MAX_PERSON_LENGTH,
  MAX_SHARED_PEOPLE,
  sharedDebtPreview,
  splitEqually,
  validateSharedRows,
} from '@/domain/sharedDebt'
import { cn } from '@/lib/utils'
import type { SectionProps, SharedRowTouched } from './types'

/**
 * "Gasto compartido" (US-34, US-82, ADR-036, ADR-040): una lista de hasta 10 personas, cada una con lo que
 * le debe al usuario en la moneda del gasto. Solo se monta para un gasto. Escribe `shared` y `sharedRows`;
 * las deudas viajan en la misma llamada a create_transaction (C4). Un campo vacío muestra su error al
 * perder el foco. Cada `data-testid` se repite en cada fila y se distingue por el `data-index` de la fila.
 */
export function SharedSection({
  values,
  touched,
  onChange,
  onTouchedRowsChange,
}: SectionProps & { onTouchedRowsChange: (rows: SharedRowTouched[]) => void }) {
  const rows = values.sharedRows
  const touchedRows = touched.sharedRows ?? []
  const draft = parseDraftInput(values)
  const { rows: rowErrors, total: totalError } = validateSharedRows(rows, draft)
  const allValid = rowErrors.every((e) => !e.sharedPerson && !e.sharedAmount) && !totalError
  const summary = allValid ? sharedDebtPreview(rows, values.amount, values.currency) : null
  const prefix = values.currency === 'USD' ? 'US$' : '$'

  // "Agregar persona" lleva el foco al "¿Con quién?" de la fila nueva, cuando ya está en pantalla.
  const focusIndex = useRef<number | null>(null)
  useEffect(() => {
    if (focusIndex.current === null) return
    document.getElementById(`transaction-form-shared-person-${focusIndex.current}`)?.focus()
    focusIndex.current = null
  }, [rows.length])

  function setRow(index: number, patch: Partial<(typeof rows)[number]>) {
    onChange({ sharedRows: rows.map((row, i) => (i === index ? { ...row, ...patch } : row)) })
  }
  function touch(index: number, field: keyof SharedRowTouched) {
    const next = rows.map((_, i) => touchedRows[i] ?? {})
    next[index] = { ...next[index], [field]: true }
    onTouchedRowsChange(next)
  }
  function addRow() {
    focusIndex.current = rows.length + 1
    onChange({ sharedRows: [...rows, { person: '', amount: '' }] })
  }
  function removeRow(index: number) {
    onTouchedRowsChange(rows.map((_, i) => touchedRows[i] ?? {}).filter((_, i) => i !== index))
    onChange({ sharedRows: rows.filter((_, i) => i !== index) })
  }
  function splitEvenly() {
    const total = draft.amount
    if (!total || !total.isFinite() || total.lte(0) || rows.length === 0) return
    const amount = formatFieldAmount(splitEqually(total, rows.length).share)
    onChange({ sharedRows: rows.map((row) => ({ ...row, amount })) })
    onTouchedRowsChange(rows.map((_, i) => ({ ...touchedRows[i], amount: true })))
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-card">
      <div className="flex min-h-12 items-center gap-3 px-4 py-2.5">
        <span id="transaction-form-shared-label" className="text-callout font-semibold">
          Gasto compartido
        </span>
        <Switch
          checked={values.shared}
          onCheckedChange={(shared) => onChange({ shared })}
          testId="transaction-form-shared-toggle"
          labelledBy="transaction-form-shared-label"
        />
      </div>

      {values.shared && (
        <div className="grid gap-4 border-t border-hairline px-4 py-3">
          {rows.map((row, i) => {
            const index = i + 1
            const errors = rowErrors[i] ?? {}
            const personShown = !!touchedRows[i]?.person && errors.sharedPerson
            const amountShown = !!touchedRows[i]?.amount && errors.sharedAmount
            const personErrorId = `transaction-form-shared-person-error-${index}`
            const amountErrorId = `transaction-form-shared-amount-error-${index}`
            const name = row.person.trim()
            return (
              <div
                key={i}
                data-testid="transaction-form-shared-row"
                data-index={index}
                className={cn('grid gap-3', i > 0 && 'border-t border-hairline pt-4')}
              >
                <div className="flex items-end gap-2">
                  <div className="grid min-w-0 flex-1 gap-1.5">
                    <label htmlFor={`transaction-form-shared-person-${index}`} className="text-footnote font-semibold">
                      ¿Con quién?
                    </label>
                    <Input
                      id={`transaction-form-shared-person-${index}`}
                      data-testid="transaction-form-shared-person"
                      data-index={index}
                      type="text"
                      autoComplete="off"
                      enterKeyHint="next"
                      maxLength={MAX_PERSON_LENGTH}
                      placeholder="Nombre"
                      value={row.person}
                      onChange={(e) => setRow(i, { person: e.target.value })}
                      onBlur={() => touch(i, 'person')}
                      aria-invalid={!!personShown || undefined}
                      aria-describedby={personShown ? personErrorId : undefined}
                    />
                  </div>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      data-testid="transaction-form-shared-remove"
                      data-index={index}
                      aria-label={name ? `Quitar a ${name}` : `Quitar persona ${index}`}
                      onMouseDown={keepFocus}
                      onClick={() => removeRow(i)}
                      className="press inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                    >
                      <X aria-hidden="true" className="size-5" />
                    </button>
                  )}
                </div>
                <RowError id={personErrorId} testId="transaction-form-shared-person-error" index={index} message={personShown ? errors.sharedPerson : undefined} />

                <div className="grid gap-1.5">
                  <label htmlFor={`transaction-form-shared-amount-${index}`} className="text-footnote font-semibold">
                    ¿Cuánto te debe?
                  </label>
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      data-testid="transaction-form-shared-amount-prefix"
                      className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground"
                    >
                      {prefix}
                    </span>
                    <Input
                      id={`transaction-form-shared-amount-${index}`}
                      data-testid="transaction-form-shared-amount"
                      data-index={index}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      enterKeyHint="done"
                      className={cn('tabular', values.currency === 'USD' ? 'pl-12' : 'pl-7')}
                      value={row.amount}
                      onChange={(e) => setRow(i, { amount: e.target.value })}
                      onBlur={() => touch(i, 'amount')}
                      aria-invalid={!!amountShown || undefined}
                      aria-describedby={amountShown ? amountErrorId : undefined}
                    />
                  </div>
                  <RowError id={amountErrorId} testId="transaction-form-shared-amount-error" index={index} message={amountShown ? errors.sharedAmount : undefined} />
                </div>
              </div>
            )
          })}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={rows.length >= MAX_SHARED_PEOPLE}
              onMouseDown={keepFocus}
              onClick={addRow}
              data-testid="transaction-form-shared-add"
            >
              <Plus aria-hidden="true" />
              Agregar persona
            </Button>
            <Button type="button" variant="outline" size="sm" onMouseDown={keepFocus} onClick={splitEvenly} data-testid="transaction-form-shared-split">
              Dividir en partes iguales
            </Button>
          </div>
          {rows.length >= MAX_SHARED_PEOPLE && (
            <p data-testid="transaction-form-shared-limit" className="text-footnote text-muted-foreground">
              Podés compartir un gasto con hasta 10 personas
            </p>
          )}

          {totalError && (
            <p data-testid="transaction-form-shared-total-error" role="alert" className="text-footnote text-destructive">
              {totalError}
            </p>
          )}
          {summary && (
            <p data-testid="transaction-form-shared-summary" className="tabular text-footnote text-muted-foreground">
              {summary}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Tocar un botón de la lista no le saca el foco al campo en el que se estaba: si el campo perdiera el foco
 * ahí, su error aparecería y correría el botón entre el toque y el soltar, y el toque se perdería.
 */
function keepFocus(e: MouseEvent) {
  e.preventDefault()
}

/** Error de un campo de una fila, con role="alert": la spec de US-34 pide que el motivo se anuncie. */
function RowError({ id, testId, index, message }: { id: string; testId: string; index: number; message?: string }) {
  if (!message) return null
  return (
    <p id={id} data-testid={testId} data-index={index} role="alert" className="text-footnote text-destructive">
      {message}
    </p>
  )
}

