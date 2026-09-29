import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-input bg-card px-3 text-base text-foreground transition-[border-color,background-color] duration-(--dur-fade) outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
