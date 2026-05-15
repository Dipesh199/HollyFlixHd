import { searchMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  return {
    title: `Search results for "${query}" | HollyFlixHD`,
    robots: { index: false, follow: false },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const query = searchParams.q || '';
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  
  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Movies</h1>
        <p className="text-gray-400">Please enter a search query.</p>
      </div>
    );
  }

  const movies = await searchMovies(query, page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Search results for: <span className="text-red-500">{query}</span>
      </h1>
      <MovieGrid movies={movies.results} />
      <Pagination currentPage={page} totalPages={movies.total_pages} basePath="/search" queryParam={`q=${query}`} />
    </div>
  );
}
