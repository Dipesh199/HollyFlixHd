import { getMoviesByGenre, getGenres } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { genre: string } }) {
  const genreId = parseInt(params.genre.split('-')[0], 10);
  if (isNaN(genreId)) return { title: 'Genre Not Found' };
  
  const data = await getGenres();
  const genreName = data.genres.find(g => g.id === genreId)?.name || 'Genre';

  const title = `${genreName} Movies | HollyFlixHD`;
  const description = `Explore the best ${genreName} movies of all time. Find top-rated ${genreName} films, new releases, cast details and more on HollyFlixHD.`;
  const url = `https://hollyflixhd.com/genre/${params.genre}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url,
      siteName: 'HollyFlixHD',
      locale: 'en_US',
    },
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
