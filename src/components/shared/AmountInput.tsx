import { useLayoutEffect, useRef, type ChangeEvent, type ComponentProps, type ElementType } from 'react'
import { formatAmountInput, formatAmountText } from '@/domain/amountInput'

type Props = Omit<ComponentProps<'input'>, 'value' | 'onChange'> & {
  value: string
  /** Recibe el texto ya formateado en es-AR («12.500,5»), el mismo que entiende tryParseMoney. */
  onValueChange: (value: string) => void
  /** Componente que dibuja el campo (por defecto un <input>; los formularios pasan el `Input` de la UI). */
  as?: ElementType
}

/**
 * Campo de monto con separador de miles mientras se escribe (US-99). El texto lo arma
 * `formatAmountInput` (dominio puro) y acá solo se devuelve el cursor a su lugar.
 */
export function AmountInput({ value, onValueChange, as: Component = 'input', ...rest }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const shown = formatAmountText(value)

  useLayoutEffect(() => {
    const el = ref.current
    if (el && pendingCaret.current !== null && document.activeElement === el) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current)
    }
    pendingCaret.current = null
  })

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const el = e.target
    const inputType = (e.nativeEvent as InputEvent).inputType
    const { text, caret } = formatAmountInput(el.value, shown, {
      caret: el.selectionStart ?? el.value.length,
      deletion: inputType?.startsWith('delete') ?? false,
      backward: inputType !== 'deleteContentForward',
    })
    pendingCaret.current = caret
    // Si el texto formateado coincide con el de antes, React no vuelve a renderizar: se deja el cursor acá.
    if (text === shown) {
      el.value = shown
      el.setSelectionRange(caret, caret)
    }
    onValueChange(text)
  }

  return <Component ref={ref} {...rest} type="text" inputMode="decimal" value={shown} onChange={handleChange} />
}
