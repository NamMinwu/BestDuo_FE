import { cn } from "@workspace/ui/lib/utils"

const TIER_MAP = {
  1: { label: "S+", className: "bg-rose-500/15 text-rose-400 ring-rose-500/30" },
  2: { label: "S", className: "bg-orange-500/15 text-orange-400 ring-orange-500/30" },
  3: { label: "A", className: "bg-amber-500/15 text-amber-400 ring-amber-500/30" },
  4: { label: "B", className: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30" },
  5: { label: "C", className: "bg-slate-500/15 text-slate-400 ring-slate-500/30" },
} as const

type TierKey = keyof typeof TIER_MAP

interface DuoTierBadgeProps {
  tier: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function DuoTierBadge({ tier, size = "md", className }: DuoTierBadgeProps) {
  const key = (tier >= 1 && tier <= 5 ? tier : 5) as TierKey
  const { label, className: colorClass } = TIER_MAP[key]

  const sizeClass =
    size === "sm"
      ? "h-6 min-w-6 px-1.5 text-xs"
      : size === "lg"
        ? "h-10 min-w-10 px-3 text-lg"
        : "h-7 min-w-7 px-2 text-sm"

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md font-bold tracking-tight ring-1 ring-inset tabular-nums",
        colorClass,
        sizeClass,
        className,
      )}
    >
      {label}
    </span>
  )
}
