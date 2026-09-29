import { Bus, Ellipsis, GraduationCap, HeartPulse, Shirt, ShoppingBasket, Ticket, Zap, type LucideIcon } from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { categoryIconKey, displayCategoryColor, type CategoryIconKey } from '@/lib/visuals'

const ICONS: Record<CategoryIconKey, LucideIcon> = {
  basket: ShoppingBasket,
  bus: Bus,
  bolt: Zap,
  ticket: Ticket,
  health: HeartPulse,
  education: GraduationCap,
  shirt: Shirt,
  other: Ellipsis,
}

/** Baldosa con el ícono de la categoría en su color apagado; las propias muestran un punto de color. */
export function CategoryIcon({
  name,
  color,
  size = 'md',
  className,
}: {
  name: string
  color: string | null | undefined
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const tone = displayCategoryColor(color, name)
  const key = categoryIconKey(name)
  const Icon = key ? ICONS[key] : null
  return (
    <span
      aria-hidden="true"
      style={{ '--tone': tone } as CSSProperties}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--tone)_13%,var(--card))] text-(--tone)',
        size === 'sm' && 'size-8 [&_svg]:size-4',
        size === 'md' && 'size-9 [&_svg]:size-[1.125rem]',
        size === 'lg' && 'size-10 [&_svg]:size-5',
        className,
      )}
    >
      {Icon ? <Icon strokeWidth={1.6} /> : <span className="size-2.5 rounded-full bg-(--tone)" />}
    </span>
  )
}
