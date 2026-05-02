import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/duo/"],
      },
    ],
    sitemap: "https://bestduo.cloud/sitemap.xml",
    host: "https://bestduo.cloud",
  }
}
