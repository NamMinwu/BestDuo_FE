import Link from "next/link"
import { Suspense } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { ChampionPortrait } from "@/components/champion-portrait"
import { ChampionSidebar } from "@/components/champion-sidebar"
import { DuoTierBadge } from "@/components/duo-tier-badge"
import { RankDelta } from "@/components/rank-delta"
import { SortableHead } from "@/components/sortable-head"
import { StatsFilters } from "@/components/stats-filters"
import {
  getBottomDuoStats,
  parseStatsSort,
  parseTier,
  type Tier,
} from "@/lib/bestduo-api"
import { getAllChampions } from "@/lib/ddragon"
import { formatPercent } from "@/lib/format"

function detailHref(
  adcId: string,
  supId: string,
  tier: Tier,
  patchVersion: string | undefined,
) {
  const p = new URLSearchParams()
  p.set("tier", tier)
  if (patchVersion) p.set("patchVersion", patchVersion)
  const q = p.toString()
  return q ? `/duo/${adcId}/${supId}?${q}` : `/duo/${adcId}/${supId}`
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = await searchParams
  const tier = parseTier(
    typeof sp.tier === "string" ? sp.tier : undefined,
  )
  const sort = parseStatsSort(
    typeof sp.sort === "string" ? sp.sort : undefined,
  )
  const patchVersion =
    typeof sp.patchVersion === "string" ? sp.patchVersion.trim() : ""
  const patchParam = patchVersion || undefined
  const adcId = typeof sp.adcId === "string" ? sp.adcId : undefined
  const supId = typeof sp.supId === "string" ? sp.supId : undefined

  const [champions, data] = await Promise.all([
    getAllChampions(),
    getBottomDuoStats({
      tier,
      sort,
      patchVersion: patchParam,
      adcChampionId: adcId,
      supChampionId: supId,
    }),
  ])

  return (
    <div className="min-h-svh bg-background px-3 py-5 sm:px-4 sm:py-8 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[220px_1fr] lg:gap-6">
        <ChampionSidebar
          adcId={adcId}
          supId={supId}
          champions={champions}
        />

        <div className="space-y-5 sm:space-y-8">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
              Best Duo
            </h1>
            <p className="text-muted-foreground text-xs sm:text-sm">
              바텀 듀오 픽률·승률 · 티어 {tier.replace(/_/g, " ")} · 패치{" "}
              {data.patchVersion}
              {data.totalGames != null ? (
                <span> · 샘플 {data.totalGames.toLocaleString()}게임</span>
              ) : null}
            </p>
          </header>

          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-10" />
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-16 rounded-full" />
                    ))}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-[120px] rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-14 rounded-full" />
                </div>
              </div>
            }
          >
            <StatsFilters
              key={`${tier}-${patchParam ?? ""}`}
              tier={tier}
              patchVersion={patchParam ?? ""}
            />
          </Suspense>

          <Card>
            <CardHeader>
              <CardTitle>듀오 랭킹</CardTitle>
              <CardDescription>
                ADC + 서포트 조합별 통계입니다. 컬럼 제목을 눌러 정렬하세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="-mx-2 overflow-x-auto sm:mx-0">
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <SortableHead
                      activeSort={sort}
                      ascSort="RANKING_ASC"
                      descSort="RANKING_DESC"
                      className="w-[72px]"
                    >
                      순위
                    </SortableHead>
                    <TableHead>Bottom</TableHead>
                    <TableHead>Support</TableHead>
                    <SortableHead
                      activeSort={sort}
                      ascSort="DUO_TIER_ASC"
                      descSort="DUO_TIER_DESC"
                      className="w-[72px] text-center"
                      align="center"
                    >
                      티어
                    </SortableHead>
                    <SortableHead
                      activeSort={sort}
                      ascSort="WINRATE_ASC"
                      descSort="WINRATE_DESC"
                      className="text-right"
                      align="right"
                    >
                      승률
                    </SortableHead>
                    <SortableHead
                      activeSort={sort}
                      ascSort="PICKRATE_ASC"
                      descSort="PICKRATE_DESC"
                      className="text-right"
                      align="right"
                    >
                      픽률
                    </SortableHead>
                    <TableHead className="text-right">게임 수</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-muted-foreground py-10 text-center"
                      >
                        조건에 맞는 데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.items.map((row) => {
                      const href = detailHref(
                        row.adcId,
                        row.supId,
                        tier,
                        patchParam,
                      )
                      return (
                        <TableRow
                          key={`${row.adcId}-${row.supId}`}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-muted-foreground">
                                {row.ranking}
                              </span>
                              <RankDelta delta={row.rankDelta} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={href}
                              className="-m-2 block rounded-md p-2"
                            >
                              <ChampionPortrait
                                image={row.adcImage}
                                name={row.adcName}
                              />
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              href={href}
                              className="-m-2 block rounded-md p-2"
                            >
                              <ChampionPortrait
                                image={row.supImage}
                                name={row.supName}
                              />
                            </Link>
                          </TableCell>
                          <TableCell className="text-center">
                            <DuoTierBadge tier={row.duoTier} />
                          </TableCell>
                          <TableCell className="text-right tabular-nums font-semibold">
                            {formatPercent(row.winRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {formatPercent(row.pickRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {row.games.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
