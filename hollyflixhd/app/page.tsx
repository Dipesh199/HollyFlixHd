import { getTrendingMovies, getPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/movie/MovieCard';
import AdSlot from '@/components/ui/AdSlot';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [trendingMovies, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(1)
  ]);

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HollyFlixHD",
    "url": "https://hollyflixhd.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://hollyflixhd.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        <AdSlot className="h-[90px] mb-8" />

        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <span className="text-red-600">🔥</span> Trending Now
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
            <span className="text-red-600">⭐</span> Popular Movies
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
