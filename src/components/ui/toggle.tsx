import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/lib/utils'

// Chips de selección (ADR-023): sin elegir, papel con filete; elegido, verde cazador.
const toggleVariants = cva(
  "press group/toggle inline-flex items-center justify-center gap-1.5 rounded-lg text-callout font-medium outline-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent text-foreground hover:bg-accent aria-pressed:bg-accent",
        outline:
          "border border-input bg-card text-foreground hover:bg-accent aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
      },
      size: {
        default: "min-h-11 min-w-11 px-3",
        sm: "min-h-9 min-w-9 px-2.5 text-footnote",
        lg: "min-h-12 min-w-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
