import { MetadataRoute } from 'next'
import { getPopularMovies } from '@/lib/tmdb'
import { generateMovieSlug } from '@/lib/slugify'
import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
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

    const blogRoutes = [
      ...listsData.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
      ...endingExplainedData.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    ]

    return [...routes, ...movieRoutes, ...blogRoutes]
  } catch {
    return routes
  }
}
