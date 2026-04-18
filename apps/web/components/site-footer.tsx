const CONTACT_EMAIL = "minwu06255@gmail.com"

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-border bg-background/60 mt-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-4 text-[11px] text-muted-foreground sm:px-4 sm:py-5 sm:text-xs md:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} Best Duo. All rights reserved.</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-foreground transition-colors"
          >
            문의하기
          </a>
        </div>
        <p className="leading-relaxed">
          Best Duo isn&apos;t endorsed by Riot Games and doesn&apos;t reflect the
          views or opinions of Riot Games or anyone officially involved in
          producing or managing League of Legends.
        </p>
      </div>
    </footer>
  )
}
