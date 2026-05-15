import { Metadata } from 'next';
import { getMovieBySlug } from '@/lib/tmdb';
import { getMoviePosterUrl, getMovieBackdropUrl } from '@/lib/tmdb-image';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await getMovieBySlug(params.slug);
  
  if (!movie) {
    return { title: 'Movie Not Found | HollyFlixHD' };
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const title = `${movie.title} (${year}) - Cast, Plot & Rating | HollyFlixHD`;
  const description = `Discover ${movie.title} (${year}) — ${movie.tagline || movie.overview.substring(0, 50)}. Full cast, plot summary, IMDb ${movie.vote_average}/10 & where to watch.`;
  
  return {
    title,
    description,
    keywords: [
      `${movie.title} cast`,
      `${movie.title} plot`,
      `${movie.title} ${year}`,
      `${movie.title} rating`,
      `${movie.title} streaming`,
      `${movie.title} where to watch`,
    ],
    openGraph: {
      title,
      description,
      type: 'video.movie',
      images: [
        {
          url: getMovieBackdropUrl(movie.backdrop_path, 'w1280'),
          width: 1280,
          height: 720,
          alt: `${movie.title} backdrop`,
        }
      ],
      siteName: 'HollyFlixHD',
    },
    twitter: {
      card: 'summary_large_image',
    }
  };
}

export default async function MoviePage({ params }: { params: { slug: string } }) {
  const movie = await getMovieBySlug(params.slug);

  if (!movie) {
    notFound();
  }

  const posterUrl = getMoviePosterUrl(movie.poster_path, 'w500');
  const backdropUrl = getMovieBackdropUrl(movie.backdrop_path, 'original');
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const watchUrl = `https://www.123movies.com/search/${encodeURIComponent(movie.title)}`;

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full">
        <Image
          src={backdropUrl}
          alt={`${movie.title} backdrop`}
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center md:items-end pb-12">
            <div className="relative w-48 md:w-64 aspect-[2/3] flex-shrink-0 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
              <Image src={posterUrl} alt={`${movie.title} poster`} fill className="object-cover" priority />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-2">
                {movie.title} <span className="text-gray-400 font-normal">({year})</span>
              </h1>
              {movie.tagline && <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>}
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                  ⭐ IMDb {movie.vote_average?.toFixed(1)}
                </span>
                {movie.runtime && (
                  <span className="text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                )}
                {movie.genres?.map(g => (
                  <span key={g.id} className="bg-gray-800 text-sm px-3 py-1 rounded-full">{g.name}</span>
                ))}
              </div>

              <div className="flex gap-4 justify-center md:justify-start">
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
                >
                  🎬 Watch Online Free
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          {/* Plot */}
          <section>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Plot Summary</h2>
            <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
          </section>

          {/* Cast */}
          {movie.credits?.cast && movie.credits.cast.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Full Cast & Characters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.credits.cast.slice(0, 8).map(actor => (
                  <div key={actor.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800">
                    <div className="relative aspect-[2/3]">
                      <Image 
                        src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/images/no-actor.webp'}
                        alt={actor.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-sm truncate">{actor.name}</p>
                      <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Movie Details</h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-gray-500 mb-1">Release Date</dt>
                <dd className="font-semibold">{movie.release_date}</dd>
              </div>
              {movie.budget ? (
                <div>
                  <dt className="text-gray-500 mb-1">Budget</dt>
                  <dd className="font-semibold">${(movie.budget / 1000000).toFixed(1)}M</dd>
                </div>
              ) : null}
              {movie.revenue ? (
                <div>
                  <dt className="text-gray-500 mb-1">Box Office</dt>
                  <dd className="font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-gray-500 mb-1">Status</dt>
                <dd className="font-semibold">{movie.status}</dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}
