import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { DuoImages } from "@/components/duo-images"
import { MatchupSortFilter } from "@/components/matchup-sort-filter"
import {
  getBottomDuoCounters,
  getBottomDuoMatchups,
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

  const [matchups, counters] = await Promise.all([
    getBottomDuoMatchups({
      tier,
      adcChampionId: adcId,
      supChampionId: supId,
      patchVersion: patchParam,
      sort: matchupSort,
    }),
    getBottomDuoCounters({
      tier,
      adcChampionId: adcId,
      supChampionId: supId,
      patchVersion: patchParam,
      size: 50,
    }),
  ])

  const { myDuo } = matchups

  return (
    <div className="min-h-svh bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={mainHref(tier, patchParam)}
            className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
          >
            ← 랭킹으로
          </Link>
        </div>

        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <DuoImages
            adcImage={myDuo.adcImage}
            supImage={myDuo.supImage}
            adcName={myDuo.adcName}
            supName={myDuo.supName}
            size={56}
          />
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
              {myDuo.adcName}{" "}
              <span className="text-muted-foreground font-normal">+</span>{" "}
              {myDuo.supName}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              티어 {tier.replace(/_/g, " ")} · 패치 {matchups.patchVersion} ·
              표본 {matchups.totalGames.toLocaleString()}게임
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Suspense fallback={<Skeleton className="h-10 w-[200px]" />}>
            <MatchupSortFilter
              key={matchupSort}
              sort={matchupSort}
              duoPath={duoPath}
            />
          </Suspense>
        </div>

        <Tabs defaultValue="matchups" className="w-full">
          <TabsList>
            <TabsTrigger value="matchups">상대 듀오 매치업</TabsTrigger>
            <TabsTrigger value="counters">
              카운터 ({counters.counterSize})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="matchups" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>매치업</CardTitle>
                <CardDescription>
                  이 듀오가 마주친 상대 바텀 조합별 승률·픽률입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                        <TableRow
                          key={`${row.oppAdcId}-${row.oppSupId}`}
                        >
                          <TableCell>
                            <Link
                              href={detailHref(
                                row.oppAdcId,
                                row.oppSupId,
                                tier,
                                patchParam,
                                matchupSort,
                              )}
                              className="hover:bg-muted/50 -m-2 flex items-center gap-3 rounded-md p-2 transition-colors"
                            >
                              <DuoImages
                                adcImage={row.oppAdcImage}
                                supImage={row.oppSupImage}
                                adcName={row.oppAdcName}
                                supName={row.oppSupName}
                              />
                              <span>
                                {row.oppAdcName}{" "}
                                <span className="text-muted-foreground">
                                  +
                                </span>{" "}
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="counters" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>카운터</CardTitle>
                <CardDescription>
                  이 듀오에게 불리한 상대 조합입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
                        <TableRow
                          key={`${row.oppAdcId}-${row.oppSupId}`}
                        >
                          <TableCell>
                            <Link
                              href={detailHref(
                                row.oppAdcId,
                                row.oppSupId,
                                tier,
                                patchParam,
                                matchupSort,
                              )}
                              className="hover:bg-muted/50 -m-2 flex items-center gap-3 rounded-md p-2 transition-colors"
                            >
                              <DuoImages
                                adcImage={row.oppAdcImage}
                                supImage={row.oppSupImage}
                                adcName={row.oppAdcName}
                                supName={row.oppSupName}
                              />
                              <span>
                                {row.oppAdcName}{" "}
                                <span className="text-muted-foreground">
                                  +
                                </span>{" "}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
