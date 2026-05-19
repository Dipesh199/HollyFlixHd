import { getTopRatedMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';

export const revalidate = 3600;

export const metadata = {
  title: 'Top Rated Movies | HollyFlixHD',
  description: 'Browse the highest rated Hollywood movies of all time.',
  alternates: {
    canonical: 'https://hollyflixhd.com/top-rated',
  },
};

export default async function TopRatedPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getTopRatedMovies(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="text-yellow-500">⭐</span> Top Rated Movies
      </h1>
      <MovieGrid movies={movies.results} />
      <Pagination currentPage={page} totalPages={movies.total_pages} basePath="/top-rated" />
    </div>
  );
}
