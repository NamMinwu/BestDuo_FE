import type { ChampionOption } from "@/components/champion-sidebar"

const DDRAGON_BASE = "https://ddragon.leagueoflegends.com"
const FALLBACK_VERSION = "15.23.1"

interface DDragonChampionEntry {
  key: string
  name: string
  image: { full: string }
}

interface DDragonChampionResponse {
  data: Record<string, DDragonChampionEntry>
}

async function fetchLatestVersion(): Promise<string> {
  try {
    const res = await fetch(`${DDRAGON_BASE}/api/versions.json`, {
      next: { revalidate: 60 * 60 * 24 },
    })
    if (!res.ok) return FALLBACK_VERSION
    const versions = (await res.json()) as string[]
    return versions[0] ?? FALLBACK_VERSION
  } catch {
    return FALLBACK_VERSION
  }
}

export async function getAllChampions(): Promise<ChampionOption[]> {
  const version = await fetchLatestVersion()
  const url = `${DDRAGON_BASE}/cdn/${version}/data/ko_KR/champion.json`
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } })
  if (!res.ok) {
    throw new Error(`DDragon champion.json ${res.status}`)
  }
  const json = (await res.json()) as DDragonChampionResponse
  const items = Object.values(json.data).map<ChampionOption>((c) => ({
    id: c.key,
    name: c.name,
    image: `${DDRAGON_BASE}/cdn/${version}/img/champion/${c.image.full}`,
  }))
  return items.sort((a, b) => a.name.localeCompare(b.name, "ko"))
}
