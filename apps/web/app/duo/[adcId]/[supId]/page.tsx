import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export const metadata: Metadata = {
  robots: { index: false, follow: true },
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { DuoImages } from "@/components/duo-images"
import { DuoTierBadge } from "@/components/duo-tier-badge"
import { MatchupSortFilter } from "@/components/matchup-sort-filter"
import {
  getBottomDuoCounters,
  getBottomDuoMatchups,
  getBottomDuoStats,
  parseMatchupSort,
  parseTier,
  type Tier,
} from "@/lib/bestduo-api"
import { formatPercent } from "@/lib/format"

function detailHref(
  adcId: string,
  supId: string,
  tier: Tier,
  patchVersion: string | undefined,
  matchupSort: string | undefined,
) {
  const p = new URLSearchParams()
  p.set("tier", tier)
  if (patchVersion) p.set("patchVersion", patchVersion)
  if (matchupSort) p.set("matchupSort", matchupSort)
  const q = p.toString()
  return q ? `/duo/${adcId}/${supId}?${q}` : `/duo/${adcId}/${supId}`
}

function mainHref(tier: Tier, patchVersion: string | undefined) {
  const p = new URLSearchParams()
  p.set("tier", tier)
  if (patchVersion) p.set("patchVersion", patchVersion)
  const q = p.toString()
  return q ? `/?${q}` : "/"
}

function StatCard({
  label,
  value,
  sub,
  highlight = false,
}: {
  label: string
  value: string
  sub?: string
  highlight?: boolean
}) {
  return (
    <div
      className={
        "brand-card relative overflow-hidden rounded-xl px-3 py-2.5 sm:px-4 sm:py-3.5 " +
        (highlight ? "ring-1 ring-[#4F7BFF]/40" : "")
      }
    >
      {highlight ? (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#4F7BFF]/25 blur-2xl"
        />
      ) : null}
      <div className="text-muted-foreground text-[11px] uppercase tracking-wider sm:text-xs">
        {label}
      </div>
      <div
        className={
          "mt-1 text-xl font-bold tabular-nums sm:text-2xl " +
          (highlight ? "brand-gradient-text" : "text-foreground")
        }
      >
        {value}
      </div>
      {sub ? (
        <div className="text-muted-foreground mt-0.5 text-[11px] tabular-nums sm:text-xs">
          {sub}
        </div>
      ) : null}
    </div>
  )
}

export default async function DuoDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ adcId: string; supId: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { adcId, supId } = await params
  if (!adcId || !supId) notFound()

  const sp = await searchParams
  const tier = parseTier(typeof sp.tier === "string" ? sp.tier : undefined)
  const patchVersion =
    typeof sp.patchVersion === "string" ? sp.patchVersion.trim() : ""
  const patchParam = patchVersion || undefined
  const matchupSort = parseMatchupSort(
    typeof sp.matchupSort === "string" ? sp.matchupSort : undefined,
  )

  const duoPath = `/duo/${encodeURIComponent(adcId)}/${encodeURIComponent(supId)}`

  const resolvedPatch =
    patchParam ?? (await getBottomDuoStats({ tier })).patchVersion

  const [matchups, counters, stats] = await Promise.all([
    getBottomDuoMatchups({
      tier,
      adcChampionId: adcId,
      supChampionId: supId,
      patchVersion: resolvedPatch,
      sort: matchupSort,
    }),
    getBottomDuoCounters({
      tier,
      adcChampionId: adcId,
      supChampionId: supId,
      patchVersion: resolvedPatch,
    }),
    getBottomDuoStats({
      tier,
      adcChampionId: adcId,
      supChampionId: supId,
      patchVersion: resolvedPatch,
    }),
  ])

  const { myDuo } = matchups
  const myStat = stats.items.find(
    (it) => it.adcId === adcId && it.supId === supId,
  )

  return (
    <div className="px-3 py-5 sm:px-4 sm:py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={mainHref(tier, resolvedPatch)}
            className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
          >
            ← 랭킹으로
          </Link>
        </div>

        <header className="space-y-5 sm:space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
            <DuoImages
              adcImage={myDuo.adcImage}
              supImage={myDuo.supImage}
              adcName={myDuo.adcName}
              supName={myDuo.supName}
              size={64}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                  <span className="text-foreground">{myDuo.adcName}</span>{" "}
                  <span className="brand-gradient-text font-normal">+</span>{" "}
                  <span className="text-foreground">{myDuo.supName}</span>
                </h1>
                {myStat ? (
                  <DuoTierBadge tier={myStat.duoTier} size="lg" />
                ) : null}
              </div>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm">
                티어 {tier.replace(/_/g, " ")} · 패치 {matchups.patchVersion} ·
                표본 {matchups.totalGames.toLocaleString()}게임
              </p>
            </div>
          </div>

          {myStat ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard
                label="승률"
                value={formatPercent(myStat.winRate)}
                sub={`랭킹 #${myStat.ranking}`}
                highlight
              />
              <StatCard label="픽률" value={formatPercent(myStat.pickRate)} />
              <StatCard
                label="게임 수"
                value={myStat.games.toLocaleString()}
              />
              <StatCard
                label="랭크 변동"
                value={
                  myStat.rankDelta == null || myStat.rankDelta === 0
                    ? "–"
                    : myStat.rankDelta > 0
                      ? `▲ ${myStat.rankDelta}`
                      : `▼ ${Math.abs(myStat.rankDelta)}`
                }
              />
            </div>
          ) : null}
        </header>

        <section className="space-y-4">
          <Card className="brand-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">카운터</CardTitle>
              <CardDescription>
                이 듀오에게 불리한 상위 {counters.counters.length}개 상대
                조합입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <div className="-mx-2 overflow-x-auto sm:mx-0">
                <Table className="min-w-[560px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>상대 듀오</TableHead>
                      <TableHead className="text-right">픽률</TableHead>
                      <TableHead className="text-right">승률</TableHead>
                      <TableHead className="text-right">게임</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {counters.counters.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-muted-foreground py-10 text-center"
                        >
                          카운터 데이터가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      counters.counters.map((row) => (
                        <TableRow key={`${row.oppAdcId}-${row.oppSupId}`}>
                          <TableCell>
                            <Link
                              href={detailHref(
                                row.oppAdcId,
                                row.oppSupId,
                                tier,
                                resolvedPatch,
                                matchupSort,
                              )}
                              className="hover:bg-muted/50 -m-2 flex items-center gap-2 rounded-md p-2 transition-colors sm:gap-3"
                            >
                              <DuoImages
                                adcImage={row.oppAdcImage}
                                supImage={row.oppSupImage}
                                adcName={row.oppAdcName}
                                supName={row.oppSupName}
                              />
                              <span className="text-xs sm:text-sm">
                                {row.oppAdcName}{" "}
                                <span className="text-muted-foreground">+</span>{" "}
                                {row.oppSupName}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPercent(row.pickRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPercent(row.winRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.games}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                매치업
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm">
                이 듀오가 마주친 상대 바텀 조합별 승률·픽률입니다.
              </p>
            </div>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-14 rounded-full" />
                    ))}
                  </div>
                </div>
              }
            >
              <MatchupSortFilter
                key={matchupSort}
                sort={matchupSort}
                duoPath={duoPath}
              />
            </Suspense>
          </div>
          <Card className="brand-card overflow-hidden">
            <CardContent className="px-2 pt-6 sm:px-6">
              <div className="-mx-2 overflow-x-auto sm:mx-0">
                <Table className="min-w-[560px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>상대 듀오</TableHead>
                      <TableHead className="text-right">픽률</TableHead>
                      <TableHead className="text-right">승률</TableHead>
                      <TableHead className="text-right">게임</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {matchups.items.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-muted-foreground py-10 text-center"
                        >
                          매치업 데이터가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      matchups.items.map((row) => (
                        <TableRow key={`${row.oppAdcId}-${row.oppSupId}`}>
                          <TableCell>
                            <Link
                              href={detailHref(
                                row.oppAdcId,
                                row.oppSupId,
                                tier,
                                resolvedPatch,
                                matchupSort,
                              )}
                              className="hover:bg-muted/50 -m-2 flex items-center gap-2 rounded-md p-2 transition-colors sm:gap-3"
                            >
                              <DuoImages
                                adcImage={row.oppAdcImage}
                                supImage={row.oppSupImage}
                                adcName={row.oppAdcName}
                                supName={row.oppSupName}
                              />
                              <span className="text-xs sm:text-sm">
                                {row.oppAdcName}{" "}
                                <span className="text-muted-foreground">+</span>{" "}
                                {row.oppSupName}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPercent(row.pickRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {formatPercent(row.winRate)}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.games}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
