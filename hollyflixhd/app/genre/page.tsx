import { getGenres } from '@/lib/tmdb';
import Link from 'next/link';

export const revalidate = 86400; // Daily

export const metadata = {
  title: 'Movie Genres | HollyFlixHD',
  description: 'Browse movies by genre.',
};

export default async function GenreListPage() {
  const data = await getGenres();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse by Genre</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.genres.map((genre) => (
          <Link prefetch={false} 
            key={genre.id} 
            href={`/genre/${genre.id}-${genre.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="bg-[#1a1a1a] border border-gray-800 hover:border-red-500 transition-colors p-6 rounded-lg text-center font-semibold text-lg"
          >
            {genre.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
