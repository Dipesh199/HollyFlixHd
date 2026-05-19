import Image from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/movie';
import { getMoviePosterUrl } from '@/lib/tmdb-image';
import { generateMovieSlug } from '@/lib/slugify';

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const slug = generateMovieSlug(movie.title, year);
  const posterUrl = getMoviePosterUrl(movie.poster_path, 'w342');

  return (
    <Link prefetch={false} href={`/movies/${slug}`} className="group flex flex-col bg-[#1a1a1a] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 shadow-lg">
      <div className="relative aspect-[2/3] w-full bg-gray-800">
        <Image 
          src={posterUrl} 
          alt={`${movie.title} (${year}) poster`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-xs px-2 py-1 rounded">
          IMDb {movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-gray-400 text-sm mt-1">{year}</p>
      </div>
    </Link>
  );
}
