import { getPopularMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Pagination from '@/components/ui/Pagination';
import { generateMovieSlug } from '@/lib/slugify';

export const revalidate = 3600;

export const metadata = {
  title: 'All Movies | HollyFlixHD',
  description: 'Browse the latest and most popular Hollywood movies.',
  alternates: {
    canonical: 'https://hollyflixhd.com/movies',
  },
};

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const movies = await getPopularMovies(page);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": movies.results.map((m, i) => {
      const year = m.release_date ? m.release_date.split('-')[0] : '';
      return {
        "@type": "ListItem",
        "position": i + 1,
        "url": `https://hollyflixhd.com/movies/${generateMovieSlug(m.title, year)}`
      };
    })
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Movies</h1>
        <MovieGrid movies={movies.results} />
        <Pagination currentPage={page} totalPages={movies.total_pages} basePath="/movies" />
      </div>
    </>
  );
}
