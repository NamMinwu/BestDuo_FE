import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const SITE_URL = "https://bestduo.cloud"
const SITE_NAME = "BestDuo"
const SITE_ALT_NAMES = ["베스트듀오", "베스트 듀오"]
const SITE_TITLE = "BestDuo (베스트듀오) · 최고의 듀오 통계"
const SITE_DESCRIPTION =
  "베스트듀오(BestDuo)는 두 플레이어의 시너지와 데이터를 연결하여 최적의 듀오 조합을 찾아주는 서비스입니다."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · BestDuo",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "BestDuo",
    "베스트듀오",
    "베스트 듀오",
    "bestduo",
    "롤 듀오",
    "롤 듀오 통계",
    "리그 오브 레전드 듀오",
    "바텀 듀오",
    "원딜 서폿 시너지",
    "ADC Support synergy",
    "League of Legends duo stats",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "Uo9GvcsT0zmEOwK9e4gTbiP3j6iwp3pUHNS5sNnTGZM",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  themeColor: "#060816",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#organization`,
                  name: SITE_NAME,
                  alternateName: SITE_ALT_NAMES,
                  url: SITE_URL,
                  logo: `${SITE_URL}/logo.png`,
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  name: SITE_NAME,
                  alternateName: SITE_ALT_NAMES,
                  url: SITE_URL,
                  description: SITE_DESCRIPTION,
                  inLanguage: "ko-KR",
                  publisher: { "@id": `${SITE_URL}/#organization` },
                },
              ],
            }),
          }}
        />
        <ThemeProvider>
          <div className="relative flex min-h-svh flex-col bg-background">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
