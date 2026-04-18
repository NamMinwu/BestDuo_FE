"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import { FilterChip, FilterChipGroup } from "@/components/filter-chip"
import { MATCHUP_SORT, type MatchupSort } from "@/lib/bestduo-api"

const LABELS: Record<MatchupSort, string> = {
  PICKRATE_DESC: "픽률↓",
  PICKRATE_ASC: "픽률↑",
  WINRATE_DESC: "승률↓",
  WINRATE_ASC: "승률↑",
}

const TITLES: Record<MatchupSort, string> = {
  PICKRATE_DESC: "픽률 높은 순",
  PICKRATE_ASC: "픽률 낮은 순",
  WINRATE_DESC: "승률 높은 순",
  WINRATE_ASC: "승률 낮은 순",
}

export function MatchupSortFilter({
  sort,
  duoPath,
}: {
  sort: MatchupSort
  duoPath: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const pushSort = useCallback(
    (value: string) => {
      const next = new URLSearchParams(searchParams.toString())
      next.set("matchupSort", value)
      const q = next.toString()
      startTransition(() => {
        router.push(q ? `${duoPath}?${q}` : duoPath)
      })
    },
    [router, searchParams, duoPath],
  )

  return (
    <FilterChipGroup label="매치업 정렬">
      {MATCHUP_SORT.map((s) => (
        <FilterChip
          key={s}
          active={sort === s}
          disabled={pending}
          title={TITLES[s]}
          onClick={() => pushSort(s)}
        >
          {LABELS[s]}
        </FilterChip>
      ))}
    </FilterChipGroup>
  )
}
