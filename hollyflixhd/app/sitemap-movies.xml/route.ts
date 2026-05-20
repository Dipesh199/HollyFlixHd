import { getPopularMovies } from '@/lib/tmdb'
import { generateMovieSlug } from '@/lib/slugify'
import { absoluteUrl, sitemapResponse, SitemapUrl, today } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'

export const revalidate = 3600

const MOVIE_PAGES = 500
const TMDB_BATCH_SIZE = 10

async function getMovieSitemapUrls(lastmod: string): Promise<SitemapUrl[]> {
  const pages = Array.from({ length: MOVIE_PAGES }, (_, i) => i + 1)
  const results = []

  for (let i = 0; i < pages.length; i += TMDB_BATCH_SIZE) {
    const batch = pages.slice(i, i + TMDB_BATCH_SIZE)
    const batchResults = await Promise.all(batch.map((page) => getPopularMovies(page).catch(() => null)))
    results.push(...batchResults)
  }

  const movies = results
    .filter((res): res is NonNullable<typeof res> => res !== null)
    .flatMap((res) => res.results)

  const uniqueMovies = Array.from(new Map(movies.map((movie) => [movie.id, movie])).values())

  return uniqueMovies.map((movie) => {
    const year = movie.release_date ? movie.release_date.split('-')[0] : ''
    return {
      loc: absoluteUrl(`/movies/${generateMovieSlug(movie.title, year)}`),
      lastmod,
      changefreq: 'weekly',
      priority: 0.9,
    }
  })
}

function getEditorialSitemapUrls(lastmod: string): SitemapUrl[] {
  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (!fs.existsSync(editorialsDir)) return []
    
    const files = fs.readdirSync(editorialsDir).filter(f => f.endsWith('.json'))
    return files.map(file => {
      const slug = file.replace('.json', '')
      return {
        loc: absoluteUrl(`/movies/${slug}`),
        lastmod,
        changefreq: 'weekly',
        priority: 1.0, // Give editorials highest priority
      }
    })
  } catch (error) {
    console.error("Error reading editorials for sitemap:", error)
    return []
  }
}

export async function GET() {
  const lastmod = today()
  const currentYear = new Date().getFullYear()
  const baseMovieUrls: SitemapUrl[] = [
    { loc: absoluteUrl('/'), lastmod, changefreq: 'daily', priority: 1 },
    { loc: absoluteUrl('/movies'), lastmod, changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/new-releases'), lastmod, changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/top-rated'), lastmod, changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/trending'), lastmod, changefreq: 'daily', priority: 0.8 },
    ...Array.from({ length: currentYear - 2010 + 1 }, (_, i) => 2010 + i).map((year) => ({
      loc: absoluteUrl(`/year/${year}`),
      lastmod,
      changefreq: 'weekly' as const,
      priority: 0.6,
    })),
  ]

  const movieUrls = await getMovieSitemapUrls(lastmod)
  const editorialUrls = getEditorialSitemapUrls(lastmod)

  // Combine and deduplicate URLs (in case popular movies already includes the editorial)
  const allUrls = [...baseMovieUrls, ...editorialUrls, ...movieUrls]
  
  return sitemapResponse(allUrls)
}
