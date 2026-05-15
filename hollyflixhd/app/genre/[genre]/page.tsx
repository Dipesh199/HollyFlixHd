import { getMoviesByGenre, getGenres } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { genre: string } }) {
  const genreId = parseInt(params.genre.split('-')[0], 10);
  if (isNaN(genreId)) return { title: 'Genre Not Found' };
  
  const data = await getGenres();
  const genreName = data.genres.find(g => g.id === genreId)?.name || 'Genre';

  return {
    title: `${genreName} Movies | HollyFlixHD`,
    description: `Browse the best ${genreName} movies.`,
  };
}

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: { genre: string };
  searchParams: { page?: string };
}) {
  const genreId = parseInt(params.genre.split('-')[0], 10);
  if (isNaN(genreId)) notFound();

  const data = await getGenres();
  const genreName = data.genres.find(g => g.id === genreId)?.name || 'Genre';

  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getMoviesByGenre(genreId, page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {genreName} Movies
      </h1>
      <MovieGrid movies={movies.results} />
      <Pagination currentPage={page} totalPages={movies.total_pages} basePath={`/genre/${params.genre}`} />
    </div>
  );
}
