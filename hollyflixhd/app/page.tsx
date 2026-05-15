import { getTrendingMovies, getPopularMovies } from '@/lib/tmdb';
import MovieCard from '@/components/movie/MovieCard';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const [trendingMovies, popularMovies] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(1)
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
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
  );
}
