import { useId, useState, type ComponentProps, type KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { suggestPeople } from '@/domain/debts'
import { cn } from '@/lib/utils'

type PersonInputProps = Omit<ComponentProps<typeof Input>, 'value' | 'onChange' | 'role'> & {
  value: string
  /** Recibe el texto nuevo, escrito o elegido de las sugerencias. */
  onValueChange: (value: string) => void
  /** Las personas ya cargadas (más reciente primero). */
  people: readonly string[]
  /** Prefijo de los `data-testid` de la lista y sus opciones. */
  testId: string
}

/**
 * US-100: «Persona» con sugerencias de las personas ya cargadas (combobox accesible, patrón ARIA de lista).
 * Flecha abajo/arriba recorre las opciones, Enter elige la activa y Escape cierra; con el mouse o el dedo se
 * elige tocando, sin sacarle el foco al campo. La lista va en el flujo, no flotante, para que ningún
 * contenedor con `overflow` la recorte. Escribir libremente sigue siendo válido: sugerir no obliga.
 */
export function PersonInput({ value, onValueChange, people, testId, onKeyDown, onBlur, onFocus, ...props }: PersonInputProps) {
  const listId = useId()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const suggestions = suggestPeople(people, value)
  const expanded = open && suggestions.length > 0
  const optionId = (i: number) => `${listId}-option-${i}`

  function choose(name: string) {
    onValueChange(name)
    setOpen(false)
    setActive(-1)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e)
    if (e.defaultPrevented) return
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (suggestions.length === 0) return
      e.preventDefault()
      if (!expanded) {
        setOpen(true)
        setActive(e.key === 'ArrowDown' ? 0 : suggestions.length - 1)
        return
      }
      const step = e.key === 'ArrowDown' ? 1 : -1
      setActive((i) => (i + step + suggestions.length) % suggestions.length)
    } else if (e.key === 'Enter' && expanded && active >= 0) {
      // Elegir no envía el formulario.
      e.preventDefault()
      choose(suggestions[active])
    } else if (e.key === 'Escape' && expanded) {
      e.preventDefault()
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <div className="grid gap-1">
      <Input
        {...props}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls={expanded ? listId : undefined}
        aria-activedescendant={expanded && active >= 0 ? optionId(active) : undefined}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={(e) => {
          onFocus?.(e)
          setOpen(true)
        }}
        onBlur={(e) => {
          onBlur?.(e)
          setOpen(false)
          setActive(-1)
        }}
        onKeyDown={handleKeyDown}
      />
      {expanded && (
        <ul
          id={listId}
          role="listbox"
          aria-label="Personas que ya cargaste"
          data-testid={`${testId}-suggestions`}
          className="overflow-hidden rounded-xl border border-hairline bg-card"
        >
          {suggestions.map((name, i) => (
            <li
              key={name}
              id={optionId(i)}
              role="option"
              aria-selected={i === active}
              data-testid={`${testId}-suggestion`}
              // El mousedown no le saca el foco al campo: así el blur no marca el error antes de elegir.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => choose(name)}
              className={cn('flex min-h-11 cursor-pointer items-center px-4 text-base text-foreground', i === active ? 'bg-accent' : 'hover:bg-accent')}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
