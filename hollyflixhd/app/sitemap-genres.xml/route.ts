import { getGenres } from '@/lib/tmdb'
import { slugify } from '@/lib/slugify'
import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const genreData = await getGenres().catch(() => ({ genres: [] }))
  const urls: SitemapUrl[] = [
    { loc: absoluteUrl('/genre'), changefreq: 'weekly', priority: 0.7 },
    ...genreData.genres.map((genre) => ({
      loc: absoluteUrl(`/genre/${genre.id}-${slugify(genre.name)}`),
      changefreq: 'weekly' as const,
      priority: 0.7,
    })),
  ]

  return sitemapResponse(urls)
}
