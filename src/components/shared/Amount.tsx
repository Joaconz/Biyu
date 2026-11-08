import type { ComponentProps } from 'react'
import { splitAmountText } from '@/lib/visuals'
import { cn } from '@/lib/utils'

/**
 * Monto con los centavos más chicos y apagados (ADR-052), como el número protagonista de las apps de
 * finanzas. El texto completo sigue siendo el mismo (`$436.850,50`): lectores de pantalla y tests lo leen igual.
 */
export function Amount({ text, className, centsClassName, ...props }: { text: string; centsClassName?: string } & ComponentProps<'span'>) {
  const { whole, cents } = splitAmountText(text)
  return (
    <span className={cn('tabular', className)} {...props}>
      {whole}
      {cents && <span className={cn('text-[0.58em] font-semibold tracking-normal opacity-55', centsClassName)}>{cents}</span>}
    </span>
  )
}
