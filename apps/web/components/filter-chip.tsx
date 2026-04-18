"use client"

import type { ReactNode } from "react"
import { cn } from "@workspace/ui/lib/utils"

interface FilterChipProps {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
  className?: string
  title?: string
}

export function FilterChip({
  active,
  disabled,
  onClick,
  children,
  className,
  title,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={title}
      className={cn(
        "inline-flex h-8 items-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors",
        "ring-1 ring-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "bg-primary/15 text-primary ring-primary/40 hover:bg-primary/20"
          : "bg-muted/30 text-muted-foreground ring-border hover:bg-muted/50 hover:text-foreground",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </button>
  )
}

interface FilterChipGroupProps {
  label: string
  children: ReactNode
  className?: string
}

export function FilterChipGroup({
  label,
  children,
  className,
}: FilterChipGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}
