import { getPopularMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';

export const revalidate = 3600;

export const metadata = {
  title: 'All Movies | HollyFlixHD',
  description: 'Browse the latest and most popular Hollywood movies.',
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getPopularMovies(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Movies</h1>
      <MovieGrid movies={movies.results} />
    </div>
  );
}
