"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

import { TableHead } from "@workspace/ui/components/table"
import { cn } from "@workspace/ui/lib/utils"

import type { StatsSort } from "@/lib/bestduo-api"

interface SortableHeadProps {
  activeSort: StatsSort
  ascSort: StatsSort
  descSort: StatsSort
  children: React.ReactNode
  className?: string
  align?: "left" | "right" | "center"
}

export function SortableHead({
  activeSort,
  ascSort,
  descSort,
  children,
  className,
  align = "left",
}: SortableHeadProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const isAsc = activeSort === ascSort
  const isDesc = activeSort === descSort
  const isActive = isAsc || isDesc

  const nextSort: StatsSort = isDesc ? ascSort : descSort

  const handleClick = () => {
    const next = new URLSearchParams(searchParams.toString())
    next.set("sort", nextSort)
    const q = next.toString()
    startTransition(() => {
      router.push(q ? `/?${q}` : "/")
    })
  }

  const indicator = isActive ? (isAsc ? "↑" : "↓") : "↕"

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-sort={isAsc ? "ascending" : isDesc ? "descending" : "none"}
        className={cn(
          "hover:text-foreground inline-flex select-none items-center gap-1 transition-colors",
          align === "right" && "ml-auto flex-row-reverse",
          align === "center" && "mx-auto",
          isActive ? "text-foreground font-semibold" : "text-muted-foreground",
          pending && "cursor-wait opacity-50",
        )}
      >
        <span>{children}</span>
        <span
          aria-hidden
          className={cn(
            "text-[10px] leading-none",
            isActive ? "opacity-100" : "opacity-40",
          )}
        >
          {indicator}
        </span>
      </button>
    </TableHead>
  )
}
