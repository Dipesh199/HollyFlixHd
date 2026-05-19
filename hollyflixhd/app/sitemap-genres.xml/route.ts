import { getGenres } from '@/lib/tmdb'
import { slugify } from '@/lib/slugify'
import { absoluteUrl, sitemapResponse, SitemapUrl, today } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const lastmod = today()
  const genreData = await getGenres().catch(() => ({ genres: [] }))
  const urls: SitemapUrl[] = [
    { loc: absoluteUrl('/genre'), lastmod, changefreq: 'weekly', priority: 0.7 },
    ...genreData.genres.map((genre) => ({
      loc: absoluteUrl(`/genre/${genre.id}-${slugify(genre.name)}`),
      lastmod,
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return sitemapResponse(urls)
}
