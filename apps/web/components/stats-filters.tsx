"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { FilterChip, FilterChipGroup } from "@/components/filter-chip"
import { TIERS, type Tier } from "@/lib/bestduo-api"

const TIER_LABELS: Record<Tier, string> = {
  CHALLENGER: "챌린저",
  GRANDMASTER: "그랜드마스터",
  MASTER: "마스터",
  DIAMOND: "다이아몬드",
  EMERALD: "에메랄드",
}

export function StatsFilters({
  tier,
  patchVersion,
}: {
  tier: Tier
  patchVersion: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const pushQuery = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (v === undefined || v === "") next.delete(k)
        else next.set(k, v)
      }
      const q = next.toString()
      startTransition(() => {
        router.push(q ? `/?${q}` : "/")
      })
    },
    [router, searchParams],
  )

  return (
    <div className="space-y-4">
      <FilterChipGroup label="티어">
        {TIERS.map((t) => (
          <FilterChip
            key={t}
            active={tier === t}
            disabled={pending}
            onClick={() => pushQuery({ tier: t })}
          >
            {TIER_LABELS[t]}
          </FilterChip>
        ))}
      </FilterChipGroup>

      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const patch = String(fd.get("patchVersion") ?? "").trim()
          pushQuery({ patchVersion: patch || undefined })
        }}
      >
        <div className="space-y-2">
          <div className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider">
            패치 (선택)
          </div>
          <Input
            id="patchVersion"
            name="patchVersion"
            placeholder="예: 16.4"
            defaultValue={patchVersion}
            className="h-8 w-[120px] rounded-full px-3 text-xs"
            disabled={pending}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={pending}
          className="h-8 rounded-full px-4 text-xs"
        >
          적용
        </Button>
      </form>
    </div>
  )
}
