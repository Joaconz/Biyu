import {
  BookOpen, Briefcase, Bus, Car, Coffee, Dumbbell, Ellipsis, Fuel, Gamepad2, Gift, GraduationCap, HeartPulse, House,
  Music, PawPrint, Pill, Plane, Shirt, ShoppingBasket, Smartphone, Ticket, Utensils, Wifi, Zap, type LucideIcon,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { displayCategoryColor, resolveCategoryIconKey, type CategoryIconKey } from '@/lib/visuals'

/** Clave de `categories.icon` → ícono de lucide. Las claves son las de `CATEGORY_ICON_KEYS` (ADR-055). */
export const CATEGORY_ICONS: Record<CategoryIconKey, LucideIcon> = {
  'shopping-basket': ShoppingBasket,
  utensils: Utensils,
  coffee: Coffee,
  bus: Bus,
  car: Car,
  fuel: Fuel,
  plane: Plane,
  zap: Zap,
  house: House,
  wifi: Wifi,
  smartphone: Smartphone,
  ticket: Ticket,
  'gamepad-2': Gamepad2,
  music: Music,
  'heart-pulse': HeartPulse,
  pill: Pill,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  shirt: Shirt,
  gift: Gift,
  'paw-print': PawPrint,
  dumbbell: Dumbbell,
  briefcase: Briefcase,
  ellipsis: Ellipsis,
}

/**
 * Círculo con el ícono de la categoría en su color. El ícono sale de `icon` (el que eligió el usuario), si no
 * del nombre de las sembradas, y si no es un punto de color (ADR-055).
 */
export function CategoryIcon({
  name,
  color,
  icon,
  size = 'md',
  className,
}: {
  name: string
  color: string | null | undefined
  /** `categories.icon`: la clave guardada; ausente o desconocida cae al de las sembradas. */
  icon?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const tone = displayCategoryColor(color, name)
  const key = resolveCategoryIconKey(icon, name)
  const Icon = key ? CATEGORY_ICONS[key] : null
  return (
    <span
      aria-hidden="true"
      data-icon={key ?? 'dot'}
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
