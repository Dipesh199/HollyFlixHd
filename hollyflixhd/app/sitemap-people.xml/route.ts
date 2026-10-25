import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const urls: SitemapUrl[] = [
    { loc: absoluteUrl('/actors'), changefreq: 'weekly', priority: 0.7 },
  ]

  return sitemapResponse(urls)
}
