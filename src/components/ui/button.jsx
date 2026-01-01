import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-[var(--btn-primary)] text-[var(--btn-text)] hover:opacity-90 shadow-[var(--btn-shadow)] hover:shadow-[var(--btn-shadow-hover)] hover:-translate-y-0.5",
    secondary: "bg-[var(--btn-secondary)] text-[var(--btn-text)] hover:opacity-90 shadow-[var(--btn-shadow)] hover:shadow-[var(--btn-shadow-hover)] hover:-translate-y-0.5",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-[var(--btn-primary)] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-[var(--btn-transition)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" || variant === "secondary" ? "rounded-[var(--btn-radius)]" : "rounded-md",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }

