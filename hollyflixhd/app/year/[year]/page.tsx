import { getMoviesByYear } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: { year: string } }) {
  return {
    title: `Best Movies of ${params.year} | HollyFlixHD`,
    description: `Discover the best and most popular movies released in ${params.year}.`,
  };
}

export default async function YearPage({
  params,
  searchParams,
}: {
  params: { year: string };
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getMoviesByYear(params.year, page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Movies from {params.year}
      </h1>
      <MovieGrid movies={movies.results} />
    </div>
  );
}
