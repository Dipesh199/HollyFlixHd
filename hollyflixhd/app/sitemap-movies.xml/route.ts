import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'
export const revalidate = 3600

export async function GET() {
  const currentYear = new Date().getFullYear()
  const baseMovieUrls: SitemapUrl[] = [
    { loc: absoluteUrl('/'), changefreq: 'daily', priority: 1 },
    { loc: absoluteUrl('/movies'), changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/new-releases'), changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/top-rated'), changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/trending'), changefreq: 'daily', priority: 0.8 },
    ...Array.from({ length: currentYear - 2010 + 1 }, (_, i) => 2010 + i).map((year) => ({
      loc: absoluteUrl(`/year/${year}`),
      changefreq: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  return sitemapResponse(baseMovieUrls)
}
