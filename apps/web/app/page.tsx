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

import { DuoImages } from "@/components/duo-images"
import { StatsFilters } from "@/components/stats-filters"
import {
  getBottomDuoStats,
  parseStatsSort,
  parseTier,
  type Tier,
} from "@/lib/bestduo-api"
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

  const data = await getBottomDuoStats({
    tier,
    sort,
    patchVersion: patchParam,
  })

  return (
    <div className="min-h-svh bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Best Duo
          </h1>
          <p className="text-muted-foreground text-sm">
            바텀 듀오 픽률·승률 · 티어 {tier.replace(/_/g, " ")} · 패치{" "}
            {data.patchVersion}
            {data.totalGames != null ? (
              <span> · 샘플 {data.totalGames.toLocaleString()}게임</span>
            ) : null}
          </p>
        </header>

        <Suspense
          fallback={
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[200px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          }
        >
          <StatsFilters
            key={`${tier}-${sort}-${patchParam ?? ""}`}
            tier={tier}
            sort={sort}
            patchVersion={patchParam ?? ""}
          />
        </Suspense>

        <Card>
          <CardHeader>
            <CardTitle>듀오 랭킹</CardTitle>
            <CardDescription>
              ADC + 서포트 조합별 통계입니다. 행을 눌러 상세 매치업을 확인하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[52px]">순위</TableHead>
                  <TableHead>듀오</TableHead>
                  <TableHead className="text-right">픽률</TableHead>
                  <TableHead className="text-right">승률</TableHead>
                  <TableHead className="text-right">게임 수</TableHead>
                  <TableHead className="text-right">듀오 티어</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-muted-foreground py-10 text-center"
                    >
                      조건에 맞는 데이터가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.items.map((row) => (
                    <TableRow key={`${row.adcId}-${row.supId}`}>
                      <TableCell className="font-mono text-muted-foreground">
                        {row.ranking}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={detailHref(
                            row.adcId,
                            row.supId,
                            tier,
                            patchParam,
                          )}
                          className="hover:bg-muted/50 -m-2 flex items-center gap-3 rounded-md p-2 transition-colors"
                        >
                          <DuoImages
                            adcImage={row.adcImage}
                            supImage={row.supImage}
                            adcName={row.adcName}
                            supName={row.supName}
                          />
                          <span className="font-medium">
                            {row.adcName}{" "}
                            <span className="text-muted-foreground">+</span>{" "}
                            {row.supName}
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
                        {row.games.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {row.duoTier}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
