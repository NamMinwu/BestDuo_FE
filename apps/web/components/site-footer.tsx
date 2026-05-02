import { BrandMark } from "@/components/brand-mark"
import { ContactDialog } from "@/components/contact-dialog"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border/60 bg-background/40 mt-12 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-3 py-6 text-[11px] text-muted-foreground sm:px-4 sm:py-8 sm:text-xs md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <BrandMark className="h-6 w-auto opacity-80" />
            <p className="text-foreground/80 font-semibold tracking-tight">
              Best<span className="brand-gradient-text">Duo</span>
            </p>
            <span className="text-muted-foreground/70">
              · &copy; {year} All rights reserved.
            </span>
          </div>
          <ContactDialog
            trigger={
              <button
                type="button"
                className="hover:text-foreground transition-colors"
              >
                문의하기
              </button>
            }
          />
        </div>
        <p className="leading-relaxed text-muted-foreground/80">
          Best Duo isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the
          views or opinions of Riot Games or anyone officially involved in
          producing or managing League of Legends.
        </p>
      </div>
    </footer>
  )
}
