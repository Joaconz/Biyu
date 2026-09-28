interface FieldErrorProps {
  /** Se usa como id (para aria-describedby) y como data-testid. */
  id: string
  message?: string
  /** El usuario ya tocó el campo: el motivo se muestra como error y no como aviso. */
  active: boolean
}

/**
 * Motivo por el que un campo no deja guardar, junto al campo, una vez que el usuario lo tocó. Antes
 * de tocarlo el motivo no desaparece (US-11): se resume junto a Guardar (TransactionForm), así el
 * formulario vacío no arranca con cuatro errores.
 */
export function FieldError({ id, message, active }: FieldErrorProps) {
  if (!message || !active) return null
  return (
    <p id={id} data-testid={id} className="text-footnote text-destructive">
      {message}
    </p>
  )
}
