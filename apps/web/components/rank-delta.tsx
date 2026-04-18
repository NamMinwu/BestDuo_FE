import { cn } from "@workspace/ui/lib/utils"

interface RankDeltaProps {
  delta: number | null | undefined
  className?: string
}

export function RankDelta({ delta, className }: RankDeltaProps) {
  if (delta == null || delta === 0) {
    return (
      <span
        className={cn(
          "text-muted-foreground inline-flex items-center text-xs",
          className,
        )}
        aria-label="변동 없음"
      >
        –
      </span>
    )
  }

  const isUp = delta > 0
  const magnitude = Math.abs(delta)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium tabular-nums",
        isUp ? "text-emerald-400" : "text-rose-400",
        className,
      )}
      aria-label={isUp ? `${magnitude}단계 상승` : `${magnitude}단계 하락`}
    >
      <span aria-hidden>{isUp ? "▲" : "▼"}</span>
      {magnitude}
    </span>
  )
}
