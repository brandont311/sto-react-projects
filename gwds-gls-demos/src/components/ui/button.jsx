import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
}

const Button = React.forwardRef(({ className, variant = "default", ...props }, ref) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "h-10 px-4 py-2",
      buttonVariants[variant],
      className
    )}
    ref={ref}
    {...props}
  />
))
Button.displayName = "Button"

export { Button }
