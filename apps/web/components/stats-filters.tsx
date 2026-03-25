"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  STATS_SORT,
  TIERS,
  type StatsSort,
  type Tier,
} from "@/lib/bestduo-api"

const SORT_LABELS: Record<StatsSort, string> = {
  PICKRATE_DESC: "픽률 높은 순",
  PICKRATE_ASC: "픽률 낮은 순",
  WINRATE_DESC: "승률 높은 순",
  WINRATE_ASC: "승률 낮은 순",
  DUO_TIER_ASC: "듀오 티어 낮은 순",
  DUO_TIER_DESC: "듀오 티어 높은 순",
  RANKING_ASC: "랭킹 낮은 순",
  RANKING_DESC: "랭킹 높은 순",
}

const TIER_LABELS: Record<Tier, string> = {
  CHALLENGER: "챌린저",
  GRANDMASTER: "그랜드마스터",
  MASTER: "마스터",
  DIAMOND: "다이아몬드",
  EMERALD: "에메랄드",
  PLATINUM: "플래티넘",
  GOLD: "골드",
  SILVER: "실버",
  BRONZE: "브론즈",
  IRON: "아이언",
  ALL_TIERS: "전체 티어",
}

export function StatsFilters({
  tier,
  sort,
  patchVersion,
}: {
  tier: Tier
  sort: StatsSort
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
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="grid gap-2">
        <Label htmlFor="tier">티어</Label>
        <Select
          value={tier}
          onValueChange={(v) => pushQuery({ tier: v })}
          disabled={pending}
        >
          <SelectTrigger id="tier" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIERS.map((t) => (
              <SelectItem key={t} value={t}>
                {TIER_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sort">정렬</Label>
        <Select
          value={sort}
          onValueChange={(v) => pushQuery({ sort: v })}
          disabled={pending}
        >
          <SelectTrigger id="sort" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATS_SORT.map((s) => (
              <SelectItem key={s} value={s}>
                {SORT_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          const patch = String(fd.get("patchVersion") ?? "").trim()
          pushQuery({ patchVersion: patch || undefined })
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="patchVersion">패치 (선택)</Label>
          <Input
            id="patchVersion"
            name="patchVersion"
            placeholder="예: 16.4"
            defaultValue={patchVersion}
            className="w-[140px]"
            disabled={pending}
          />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          패치 적용
        </Button>
      </form>
    </div>
  )
}
