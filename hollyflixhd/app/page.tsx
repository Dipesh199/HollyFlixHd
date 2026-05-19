import { getTrendingMovies, getPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/movie/MovieCard';
import AdSlot from '@/components/ui/AdSlot';

import { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
  description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, IMDb ratings, and streaming information on HollyFlixHD.",
  openGraph: {
    title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
    description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, IMDb ratings, and streaming information on HollyFlixHD.",
    type: "website",
    url: "https://hollyflixhd.com/",
    siteName: "HollyFlixHD",
    locale: "en_US",
    images: [
      {
        url: "https://hollyflixhd.com/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "HollyFlixHD - Movie Database",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HollyFlixHD - Watch, Discover & Explore Movies Online",
    description: "Explore the best Hollywood movies, latest releases, top-rated films, and trending hits. Full cast details, plot summaries, IMDb ratings, and streaming information on HollyFlixHD.",
  },
};

export default async function Home() {
  const [trendingMovies, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(1)
  ]);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="sr-only">HollyFlixHD - Watch, Discover & Explore Movies Online</h1>
        {/* Banner Ad */}
        <AdSlot className="h-[90px] mb-8" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <span className="text-red-600">Hot</span> Trending Now
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {trendingMovies.results.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>

        {/* Mid-page Ad */}
        <AdSlot className="h-[250px] md:h-[90px] mb-12" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <span className="text-red-600">Top</span> Popular Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {popularMovies.results.slice(0, 12).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
