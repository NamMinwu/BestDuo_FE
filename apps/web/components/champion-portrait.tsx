import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

interface ChampionPortraitProps {
  image: string
  name: string
  size?: number
  className?: string
}

export function ChampionPortrait({
  image,
  name,
  size = 36,
  className,
}: ChampionPortraitProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image
        src={image}
        alt={name}
        width={size}
        height={size}
        className="rounded-sm border border-border shrink-0"
      />
      <span className="truncate font-medium">{name}</span>
    </div>
  )
}
