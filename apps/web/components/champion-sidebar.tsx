"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"

import { cn } from "@workspace/ui/lib/utils"

export interface ChampionOption {
  id: string
  name: string
  image: string
}

interface ChampionSidebarProps {
  adcId: string | undefined
  supId: string | undefined
  champions: ChampionOption[]
}

type Role = "adc" | "sup"

const CHOSEONG = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
]

function getInitial(name: string): string {
  const first = name[0] ?? ""
  const code = first.charCodeAt(0)
  if (code >= 0xac00 && code <= 0xd7a3) {
    return CHOSEONG[Math.floor((code - 0xac00) / 588)] ?? first
  }
  return first.toUpperCase()
}

function groupChampions(
  champions: ChampionOption[],
): { letter: string; items: ChampionOption[] }[] {
  const map = new Map<string, ChampionOption[]>()
  for (const c of champions) {
    const letter = getInitial(c.name)
    const bucket = map.get(letter) ?? []
    bucket.push(c)
    map.set(letter, bucket)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b, "ko"))
    .map(([letter, items]) => ({ letter, items }))
}

export function ChampionSidebar({
  adcId,
  supId,
  champions,
}: ChampionSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState("")
  const [role, setRole] = useState<Role>("adc")
  const [mobileOpen, setMobileOpen] = useState(false)
  const scrollerRef = useRef<HTMLDivElement>(null)

  const pushPatch = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(patch)) {
        if (!v) next.delete(k)
        else next.set(k, v)
      }
      const q = next.toString()
      startTransition(() => {
        router.push(q ? `/?${q}` : "/")
      })
    },
    [router, searchParams],
  )

  const pool = champions
  const selectedId = role === "adc" ? adcId : supId
  const paramKey = role === "adc" ? "adcId" : "supId"

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return pool
    return pool.filter((c) => c.name.toLowerCase().includes(q))
  }, [pool, query])

  const groups = useMemo(() => groupChampions(filtered), [filtered])
  const availableLetters = useMemo(
    () => new Set(groups.map((g) => g.letter)),
    [groups],
  )

  const selectedAdc = champions.find((c) => c.id === adcId)
  const selectedSup = champions.find((c) => c.id === supId)
  const hasSelection = Boolean(adcId || supId)

  const scrollToLetter = (letter: string) => {
    const el = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-letter="${letter}"]`,
    )
    el?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="bg-card/30 overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between gap-2 p-3">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="champion-filter-panel"
            className="flex flex-1 items-center justify-between gap-2 lg:pointer-events-none lg:cursor-default"
          >
            <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
              챔피언 필터
            </span>
            <span className="flex items-center gap-1.5 lg:hidden">
              {selectedAdc ? (
                <Image
                  src={selectedAdc.image}
                  alt={selectedAdc.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              ) : null}
              {selectedSup ? (
                <Image
                  src={selectedSup.image}
                  alt={selectedSup.name}
                  width={20}
                  height={20}
                  className="rounded-sm"
                />
              ) : null}
              <span
                aria-hidden
                className={cn(
                  "text-muted-foreground text-xs transition-transform",
                  mobileOpen && "rotate-180",
                )}
              >
                ▾
              </span>
            </span>
          </button>
          {hasSelection ? (
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                pushPatch({ adcId: undefined, supId: undefined })
              }
              className="text-muted-foreground hover:text-foreground shrink-0 text-[11px] underline-offset-2 hover:underline"
            >
              초기화
            </button>
          ) : null}
        </div>

        <div
          id="champion-filter-panel"
          className={cn(
            "border-t border-border/60 lg:block",
            mobileOpen ? "block" : "hidden",
          )}
        >
          <div className="space-y-2 p-3">
            <div className="space-y-1">
              <SelectedRow
                label="Bottom"
                champion={selectedAdc}
                disabled={pending}
                onClear={() => pushPatch({ adcId: undefined })}
              />
              <SelectedRow
                label="Support"
                champion={selectedSup}
                disabled={pending}
                onClear={() => pushPatch({ supId: undefined })}
              />
            </div>

            <div className="bg-muted/50 grid grid-cols-2 gap-0.5 rounded-md p-0.5">
              <RoleTab
                active={role === "adc"}
                onClick={() => setRole("adc")}
              >
                Bottom
              </RoleTab>
              <RoleTab
                active={role === "sup"}
                onClick={() => setRole("sup")}
              >
                Support
              </RoleTab>
            </div>

            <input
              type="search"
              placeholder="챔피언 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={cn(
                "bg-background text-foreground placeholder:text-muted-foreground h-8 w-full rounded-md border border-border px-2 text-xs",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
              )}
            />

            <div className="-mx-0.5 flex flex-wrap items-center gap-0.5">
              {CHOSEONG.map((l) => {
                const has = availableLetters.has(l)
                return (
                  <button
                    key={l}
                    type="button"
                    disabled={!has}
                    onClick={() => scrollToLetter(l)}
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded text-[10px] transition-colors",
                      has
                        ? "text-muted-foreground hover:bg-muted hover:text-foreground"
                        : "text-muted-foreground/30 cursor-not-allowed",
                    )}
                  >
                    {l}
                  </button>
                )
              })}
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="max-h-[70vh] space-y-2 overflow-y-auto px-3 pb-3 lg:max-h-[560px]"
          >
            {groups.length === 0 ? (
              <div className="text-muted-foreground px-2 py-6 text-center text-xs">
                결과 없음
              </div>
            ) : (
              groups.map(({ letter, items }) => (
                <div
                  key={letter}
                  data-letter={letter}
                  className="space-y-1"
                >
                  <div className="text-muted-foreground bg-card/95 supports-[backdrop-filter]:bg-card/70 supports-[backdrop-filter]:backdrop-blur sticky top-0 z-10 px-0.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                    {letter}
                  </div>
                  <div className="grid grid-cols-6 gap-1 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-4">
                    {items.map((c) => {
                      const isActive = selectedId === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          disabled={pending}
                          title={c.name}
                          aria-pressed={isActive}
                          onClick={() =>
                            pushPatch({
                              [paramKey]: isActive ? undefined : c.id,
                            })
                          }
                          className={cn(
                            "group relative flex aspect-square items-center justify-center overflow-hidden rounded-md border transition-all",
                            isActive
                              ? "border-primary ring-2 ring-primary ring-offset-1 ring-offset-background"
                              : "border-border/60 hover:border-primary/60",
                            pending && "cursor-not-allowed opacity-50",
                          )}
                        >
                          <Image
                            src={c.image}
                            alt={c.name}
                            width={40}
                            height={40}
                            className={cn(
                              "h-full w-full object-cover transition-transform",
                              isActive
                                ? "scale-110"
                                : "group-hover:scale-105",
                            )}
                          />
                          {isActive ? (
                            <span className="bg-primary/20 absolute inset-0" />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}

function RoleTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-7 rounded text-[11px] font-semibold transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function SelectedRow({
  label,
  champion,
  disabled,
  onClear,
}: {
  label: string
  champion: ChampionOption | undefined
  disabled: boolean
  onClear: () => void
}) {
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-muted-foreground w-[52px] shrink-0 text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </span>
      {champion ? (
        <>
          <Image
            src={champion.image}
            alt={champion.name}
            width={18}
            height={18}
            className="rounded-sm"
          />
          <span className="text-foreground flex-1 truncate font-medium">
            {champion.name}
          </span>
          <button
            type="button"
            disabled={disabled}
            onClick={onClear}
            aria-label={`${label} 선택 해제`}
            className="text-muted-foreground hover:text-foreground shrink-0 rounded px-1 text-[10px] leading-none"
          >
            ✕
          </button>
        </>
      ) : (
        <span className="text-muted-foreground/70 flex-1">전체</span>
      )}
    </div>
  )
}
