import { MetadataRoute } from 'next'
import { getPopularMovies } from '@/lib/tmdb'
import { generateMovieSlug } from '@/lib/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hollyflixhd.com'
  
  // Base routes
  const routes = [
    '',
    '/movies',
    '/new-releases',
    '/top-rated',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const popularMovies = await getPopularMovies(1)
    const movieRoutes = popularMovies.results.map((movie) => {
      const slug = generateMovieSlug(movie.title, movie.release_date)
      return {
        url: `${baseUrl}/movies/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }
    })
    return [...routes, ...movieRoutes]
  } catch {
    return routes
  }
}
