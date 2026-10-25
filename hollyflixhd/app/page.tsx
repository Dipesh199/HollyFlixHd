import { getTrendingMovies, getPopularMovies, getNewReleases, getMovieBySlug } from '@/lib/tmdb';
import { getRecentEditorialSlugs, getEditorial } from '@/lib/editorial';
import MovieCard from '@/components/movie/MovieCard';
import AdSlot from '@/components/ui/AdSlot';
import Link from 'next/link';
import { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
  description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, TMDB ratings, and streaming information on HollyFlixHD.",
  alternates: { canonical: 'https://hollyflixhd.com/' },
  openGraph: {
    title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
    description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, TMDB ratings, and streaming information on HollyFlixHD.",
    type: "website",
    url: "https://hollyflixhd.com/",
    siteName: "HollyFlixHD",
    locale: "en_US",
    images: [
      {
        url: "https://hollyflixhd.com/images/og-default.png",
        width: 1200,
        height: 630,
        alt: "HollyFlixHD - Movie Database",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
    description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, TMDB ratings, and streaming information on HollyFlixHD.",
    images: ['https://hollyflixhd.com/images/og-default.png'],
  },
};

export default async function Home() {
  const recentSlugs = getRecentEditorialSlugs(6);

  const [newReleases, trendingMovies, popularMovies, recentEditorialMovies] = await Promise.all([
    getNewReleases(1).catch(() => ({ results: [] })),
    getTrendingMovies().catch(() => ({ results: [] })),
    getPopularMovies(1).catch(() => ({ results: [] })),
    Promise.all(
      recentSlugs.map(async (slug) => {
        try {
          const movie = await getMovieBySlug(slug);
          const editorial = getEditorial(slug);
          if (!movie) return null;
          return { movie, editorial };
        } catch {
          return null;
        }
      })
    ).then((items) => items.filter((item): item is NonNullable<typeof item> => item !== null))
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="sr-only">HollyFlixHD - Watch, Discover & Explore Movies Online</h1>
      
      {/* Top Banner Ad */}
      <AdSlot className="h-[90px] mb-8" />

      {/* 1. Real Latest Releases / In Theaters */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <span className="text-blue-500">New</span> Latest Releases
          </h2>
          <Link
            href="/new-releases"
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All New Releases →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {newReleases.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* 2. Newly Reviewed / Editorial Takes */}
      {recentEditorialMovies.length > 0 && (
        <section className="mb-12 bg-gradient-to-r from-red-950/30 via-transparent to-amber-950/20 border border-gray-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 text-white">
                <span className="text-red-500">★</span> Our Latest Takes
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Expert, independent editorial reviews freshly added by the HollyFlixHD team
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
            >
              Explore All Takes →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {recentEditorialMovies.map(({ movie, editorial }) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                editorialBadge={editorial?.editorRating}
              />
            ))}
          </div>
        </section>
      )}

      {/* Mid-page Ad */}
      <AdSlot className="h-[250px] md:h-[90px] mb-12" />

      {/* 3. Trending Now */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <span className="text-red-600">Hot</span> Trending Now
          </h2>
          <Link
            href="/trending"
            className="text-sm font-semibold text-red-400 hover:text-red-300 transition-colors"
          >
            View All Trending →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trendingMovies.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* 4. Top Popular Movies */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
            <span className="text-yellow-500">Top</span> Popular Movies
          </h2>
          <Link
            href="/movies"
            className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
          >
            View All Movies →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {popularMovies.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
