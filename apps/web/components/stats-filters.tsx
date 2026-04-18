"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import { FilterChip, FilterChipGroup } from "@/components/filter-chip"
import { TIERS, type Tier } from "@/lib/bestduo-api"

const TIER_LABELS: Record<Tier, string> = {
  CHALLENGER: "챌린저",
  GRANDMASTER: "그랜드마스터",
  MASTER: "마스터",
  DIAMOND: "다이아몬드",
  EMERALD: "에메랄드",
}

const PATCH_LABELS = ["최신", "이전"] as const

export function StatsFilters({
  tier,
  patchVersion,
  patches,
}: {
  tier: Tier
  patchVersion: string
  patches: string[]
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

  const selectedPatch = patchVersion || patches[0] || ""

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

      <FilterChipGroup label="패치">
        {patches.map((p, i) => (
          <FilterChip
            key={p}
            active={selectedPatch === p}
            disabled={pending}
            onClick={() =>
              pushQuery({ patchVersion: i === 0 ? undefined : p })
            }
          >
            {PATCH_LABELS[i] ?? p} ({p})
          </FilterChip>
        ))}
      </FilterChipGroup>
    </div>
  )
}
