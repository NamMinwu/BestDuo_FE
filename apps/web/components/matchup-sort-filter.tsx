"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { MATCHUP_SORT, type MatchupSort } from "@/lib/bestduo-api"

const LABELS: Record<MatchupSort, string> = {
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
    <div className="grid gap-2">
      <Label htmlFor="matchupSort">매치업 정렬</Label>
      <Select
        value={sort}
        onValueChange={pushSort}
        disabled={pending}
      >
        <SelectTrigger id="matchupSort" className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MATCHUP_SORT.map((s) => (
            <SelectItem key={s} value={s}>
              {LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
