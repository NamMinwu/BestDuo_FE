const DEFAULT_BASE =
  "https://api-server-production-2c27.up.railway.app"

export function getApiBaseUrl(): string {
  return (
    process.env.BESTDUO_API_BASE_URL?.replace(/\/$/, "") ?? DEFAULT_BASE
  )
}

export const TIERS = [
  "CHALLENGER",
  "GRANDMASTER",
  "MASTER",
  "DIAMOND",
  "EMERALD",
] as const

export type Tier = (typeof TIERS)[number]

export const STATS_SORT = [
  "PICKRATE_DESC",
  "PICKRATE_ASC",
  "WINRATE_DESC",
  "WINRATE_ASC",
  "DUO_TIER_ASC",
  "DUO_TIER_DESC",
  "RANKING_ASC",
  "RANKING_DESC",
] as const

export type StatsSort = (typeof STATS_SORT)[number]

export const MATCHUP_SORT = [
  "PICKRATE_DESC",
  "PICKRATE_ASC",
  "WINRATE_DESC",
  "WINRATE_ASC",
] as const

export type MatchupSort = (typeof MATCHUP_SORT)[number]

export interface DuoMeta {
  adcId: string
  adcName: string
  adcImage: string
  supId: string
  supName: string
  supImage: string
}

/** List row from GET /bottom-duo/stats */
export interface BottomDuoStatItem {
  adcId: string
  adcName: string
  adcImage: string
  supId: string
  supName: string
  supImage: string
  winRate: number
  pickRate: number
  games: number
  duoTier: number
  ranking: number
  rankDelta: number | null
}

export interface BottomDuoStatisticsResponse {
  tier: string
  patchVersion: string
  totalGames: number
  items: BottomDuoStatItem[]
}

/** Matchup row from GET /bottom-duo/matchups */
export interface BottomDuoMatchupItem {
  oppAdcId: string
  oppAdcName: string
  oppAdcImage: string
  oppSupId: string
  oppSupName: string
  oppSupImage: string
  winRate: number
  pickRate: number
  games: number
}

export interface BottomDuoDetailStatisticsResponse {
  tier: string
  patchVersion: string
  totalGames: number
  myDuo: DuoMeta
  items: BottomDuoMatchupItem[]
}

export interface BottomDuoCounterResponse {
  tier: string
  patchVersion: string
  totalGames: number
  myDuo: DuoMeta
  counterSize: number
  counters: BottomDuoMatchupItem[]
}

function buildSearchParams(
  entries: Record<string, string | undefined>,
): string {
  const p = new URLSearchParams()
  for (const [k, v] of Object.entries(entries)) {
    if (v !== undefined && v !== "") p.set(k, v)
  }
  const s = p.toString()
  return s ? `?${s}` : ""
}

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getApiBaseUrl()}${path}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `BestDuo API ${res.status}: ${text.slice(0, 200)}`,
    )
  }
  return res.json() as Promise<T>
}

export async function getBottomDuoStats(params: {
  tier: Tier
  patchVersion?: string
  adcChampionId?: string
  supChampionId?: string
  sort?: StatsSort
}): Promise<BottomDuoStatisticsResponse> {
  const q = buildSearchParams({
    tier: params.tier,
    patchVersion: params.patchVersion,
    adcChampionId: params.adcChampionId,
    supChampionId: params.supChampionId,
    sort: params.sort ?? "PICKRATE_DESC",
  })
  return fetchJson<BottomDuoStatisticsResponse>(
    `/bottom-duo/stats${q}`,
  )
}

export async function getBottomDuoMatchups(params: {
  tier: Tier
  adcChampionId: string
  supChampionId: string
  patchVersion?: string
  oppAdcChampionId?: string
  oppSupChampionId?: string
  sort?: MatchupSort
}): Promise<BottomDuoDetailStatisticsResponse> {
  const q = buildSearchParams({
    tier: params.tier,
    patchVersion: params.patchVersion,
    adcChampionId: params.adcChampionId,
    supChampionId: params.supChampionId,
    oppAdcChampionId: params.oppAdcChampionId,
    oppSupChampionId: params.oppSupChampionId,
    sort: params.sort ?? "PICKRATE_DESC",
  })
  return fetchJson<BottomDuoDetailStatisticsResponse>(
    `/bottom-duo/matchups${q}`,
  )
}

export const COUNTER_DEFAULT_SIZE = 5

export async function getBottomDuoCounters(params: {
  tier: Tier
  adcChampionId: string
  supChampionId: string
  patchVersion?: string
  size?: number
}): Promise<BottomDuoCounterResponse> {
  const size = params.size ?? COUNTER_DEFAULT_SIZE
  const q = buildSearchParams({
    tier: params.tier,
    patchVersion: params.patchVersion,
    adcChampionId: params.adcChampionId,
    supChampionId: params.supChampionId,
    size: String(size),
  })
  return fetchJson<BottomDuoCounterResponse>(
    `/bottom-duo/counters${q}`,
  )
}

export function parseTier(value: string | undefined): Tier {
  if (value && (TIERS as readonly string[]).includes(value)) {
    return value as Tier
  }
  return "EMERALD"
}

export function parseStatsSort(value: string | undefined): StatsSort {
  if (value && (STATS_SORT as readonly string[]).includes(value)) {
    return value as StatsSort
  }
  return "RANKING_ASC"
}

export function parseMatchupSort(value: string | undefined): MatchupSort {
  if (value && (MATCHUP_SORT as readonly string[]).includes(value)) {
    return value as MatchupSort
  }
  return "PICKRATE_DESC"
}

interface PatchVersionResponse {
  patch: string
  releasedAt: string
}

export async function getRecentPatches(): Promise<string[]> {
  const items = await fetchJson<PatchVersionResponse[]>("/patch/recent")
  return items.map((item) => item.patch)
}
