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

/** Círculo con el ícono de la categoría en su color; las propias muestran un punto de color. */
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
        // ADR-052: círculo; en oscuro el tono se aclara para que el ícono se lea sobre esmeralda.
        'inline-flex shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--tone)_14%,var(--card))] text-(--tone)',
        'dark:bg-[color-mix(in_srgb,var(--tone)_26%,var(--card))] dark:text-[color-mix(in_oklab,var(--tone)_50%,white)]',
        size === 'sm' && 'size-8 [&_svg]:size-4',
        size === 'md' && 'size-11 [&_svg]:size-5',
        size === 'lg' && 'size-12 [&_svg]:size-[1.375rem]',
        className,
      )}
    >
      {Icon ? <Icon strokeWidth={1.6} /> : <span className="size-2.5 rounded-full bg-(--tone)" />}
    </span>
  )
}
