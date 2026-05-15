import { getNewReleases } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';

export const revalidate = 3600;

export const metadata = {
  title: 'New Releases | HollyFlixHD',
  description: 'Browse the newest Hollywood movies currently in theaters or recently released.',
};

export default async function NewReleasesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getNewReleases(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <span className="text-blue-500">🆕</span> New Releases
      </h1>
      <MovieGrid movies={movies.results} />
      <Pagination currentPage={page} totalPages={movies.total_pages} basePath="/new-releases" />
    </div>
  );
}
