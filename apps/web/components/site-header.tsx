import Link from "next/link"

export function SiteHeader() {
  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 border-b border-border backdrop-blur">
      <div className="mx-auto flex h-12 max-w-7xl items-center gap-4 px-3 sm:h-14 sm:px-4 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight sm:text-base"
        >
          <span
            aria-hidden
            className="bg-primary/15 text-primary flex h-6 w-6 items-center justify-center rounded-md text-[11px] font-bold sm:h-7 sm:w-7 sm:text-xs"
          >
            BD
          </span>
          <span>Best Duo</span>
        </Link>
        <nav className="text-muted-foreground ml-auto flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
          <Link
            href="/"
            className="hover:text-foreground transition-colors"
          >
            랭킹
          </Link>
        </nav>
      </div>
    </header>
  )
}
