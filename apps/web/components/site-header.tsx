import Link from "next/link"

import { BrandWordmark } from "@/components/brand-mark"

export function SiteHeader() {
  return (
    <header className="bg-background/55 supports-[backdrop-filter]:bg-background/35 sticky top-0 z-40 border-b border-border/60 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-3 sm:h-16 sm:px-4 md:px-8">
        <Link
          href="/"
          aria-label="Best Duo 홈"
          className="group inline-flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <BrandWordmark />
        </Link>
        <nav className="ml-auto flex items-center gap-1 text-xs sm:gap-2 sm:text-sm">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground rounded-full px-3 py-1.5 transition-colors hover:bg-white/5"
          >
            랭킹
          </Link>
        </nav>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-[#4F7BFF]/40 to-transparent"
      />
    </header>
  )
}
