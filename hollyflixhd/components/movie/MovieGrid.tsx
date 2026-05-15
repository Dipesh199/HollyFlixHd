import { Movie } from '@/types/movie';
import MovieCard from '@/components/movie/MovieCard';

export default function MovieGrid({ movies }: { movies: Movie[] }) {
  if (!movies || movies.length === 0) {
    return <div className="text-gray-400 py-10 text-center">No movies found.</div>;
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
