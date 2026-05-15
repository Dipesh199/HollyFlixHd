import { getTrendingMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';

export const revalidate = 3600;

export const metadata = {
  title: 'Trending Movies | HollyFlixHD',
  description: 'Browse movies trending this week.',
};

export default async function TrendingPage() {
  const movies = await getTrendingMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="text-red-600">🔥</span> Trending Movies
      </h1>
      <MovieGrid movies={movies.results} />
    </div>
  );
}
