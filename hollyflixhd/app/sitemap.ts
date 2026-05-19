import { MetadataRoute } from 'next'
import { getPopularMovies, getGenres, getPopularPersons } from '@/lib/tmdb'
import { generateMovieSlug, slugify } from '@/lib/slugify'
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
    '/trending',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // 1. Fetch movies across multiple pages (up to 25 pages = 500 movies)
    const pages = Array.from({ length: 25 }, (_, i) => i + 1);
    const popularMoviesPromises = pages.map(page => getPopularMovies(page).catch(() => null));
    const popularMoviesResults = await Promise.all(popularMoviesPromises);
    
    const allMovies = popularMoviesResults
      .filter((res): res is NonNullable<typeof res> => res !== null)
      .flatMap(res => res.results);

    // Deduplicate
    const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());

    const movieRoutes = uniqueMovies.map((movie) => {
      const year = movie.release_date ? movie.release_date.split('-')[0] : '';
      const slug = generateMovieSlug(movie.title, year)
      return {
        url: `${baseUrl}/movies/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }
    })

    // 2. Blog routes
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

    // 3. Genres
    const genreData = await getGenres().catch(() => ({ genres: [] }));
    const genreRoutes = genreData.genres.map((genre) => {
      const slug = `${genre.id}-${slugify(genre.name)}`
      return {
        url: `${baseUrl}/genre/${slug}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }
    });

    // 4. Years (2010 - 2024)
    const yearRoutes = Array.from({ length: 15 }, (_, i) => 2010 + i).map(year => ({
      url: `${baseUrl}/year/${year}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // 5. Actors & Directors (fetching popular persons)
    const popularPersonsData = await getPopularPersons(1).catch(() => null);
    let actorRoutes: any[] = [];
    let directorRoutes: any[] = [];
    if (popularPersonsData) {
      actorRoutes = popularPersonsData.results.slice(0, 10).map((person) => ({
        url: `${baseUrl}/actors/${person.id}-${slugify(person.name)}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
      // Using same for directors as a placeholder since we don't have a specific directors endpoint without scraping
      directorRoutes = popularPersonsData.results.slice(10, 20).map((person) => ({
        url: `${baseUrl}/directors/${person.id}-${slugify(person.name)}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }

    return [...routes, ...movieRoutes, ...blogRoutes, ...genreRoutes, ...yearRoutes, ...actorRoutes, ...directorRoutes]
  } catch {
    return routes
  }
}
