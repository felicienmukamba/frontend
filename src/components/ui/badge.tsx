import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

export function BadgeDRC({ children, variant = 'blue', className }: { children: React.ReactNode; variant?: 'blue' | 'yellow' | 'red' | 'green' | 'slate' | 'purple' | 'danger' | 'gray'; className?: string }) {
  const styles: Record<string, string> = {
    blue: "bg-blue-50 text-blue-700 border-blue-100 shadow-blue-500/5",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 shadow-yellow-500/5",
    red: "bg-red-50 text-red-700 border-red-100 shadow-red-500/5",
    green: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-500/5",
    slate: "bg-slate-50 text-slate-600 border-slate-200 shadow-slate-500/5",
    purple: "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-indigo-500/5",
    danger: "bg-red-50 text-red-600 border-red-100 shadow-red-500/5",
    gray: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-sm",
      styles[variant] || styles.blue,
      className
    )}>
      {children}
    </span>
  );
}
