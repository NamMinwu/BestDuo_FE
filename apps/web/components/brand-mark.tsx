import Image from "next/image"

import { cn } from "@workspace/ui/lib/utils"

interface BrandMarkProps {
  className?: string
  size?: number
  title?: string
  priority?: boolean
}

export function BrandMark({
  className,
  size = 40,
  title = "BestDuo",
  priority = false,
}: BrandMarkProps) {
  return (
    <Image
      src="/logo.png"
      alt={title}
      width={size}
      height={size}
      priority={priority}
      className={cn("h-9 w-9 object-contain", className)}
    />
  )
}

interface BrandWordmarkProps {
  className?: string
  showMark?: boolean
}

export function BrandWordmark({
  className,
  showMark = true,
}: BrandWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-bold tracking-tight",
        className,
      )}
    >
      {showMark ? (
        <BrandMark
          className="h-8 w-8 sm:h-9 sm:w-9"
          size={36}
          priority
        />
      ) : null}
      <span className="flex items-baseline gap-[2px] text-[15px] sm:text-base">
        <span className="text-foreground">Best</span>
        <span className="brand-gradient-text">Duo</span>
      </span>
    </span>
  )
}
