import { Metadata } from 'next';
import { getMovieBySlug } from '@/lib/tmdb';
import { getMoviePosterUrl, getMovieBackdropUrl } from '@/lib/tmdb-image';
import { slugify } from '@/lib/slugify';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MovieGrid from '@/components/movie/MovieGrid';
import { getEditorial } from '@/lib/editorial';
import { EditorialContainer } from '@/components/blog/EditorialContainer';

export const dynamicParams = true;
// Movie slugs are unbounded; caching every rendered page fills the server disk.
export const revalidate = 0;

export async function generateStaticParams() {
  // Movie data needs a runtime-only TMDB key; render movie slugs on demand.
  return [];
}
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const movie = await getMovieBySlug(params.slug);
  const editorial = getEditorial(params.slug);
  
  if (!movie) {
    return { title: 'Movie Not Found | HollyFlixHD' };
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const shouldIndex = true;

  const title = `${movie.title} (${year}) - Cast, Plot, Rating & Streaming | HollyFlixHD`;
  const description = `Discover ${movie.title} (${year}) - ${movie.tagline || movie.overview.substring(0, 50)}. Full cast, plot summary, TMDB ${movie.vote_average?.toFixed(1)}/10 rating & where to stream. | HollyFlixHD`;
  const url = `https://hollyflixhd.com/movies/${params.slug}`;

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
      ...(editorial?.endingExplained ? [`${movie.title} ending explained`, `${movie.title} ending breakdown`] : []),
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      type: 'video.movie',
      url,
      images: [
        {
          url: getMovieBackdropUrl(movie.backdrop_path, 'w1280'),
          width: 1280,
          height: 720,
          alt: `${movie.title} ${year} movie backdrop`,
        }
      ],
      siteName: 'HollyFlixHD',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [getMovieBackdropUrl(movie.backdrop_path, 'w1280')],
    },
    robots: {
      index: shouldIndex,
      follow: true,
      googleBot: {
        index: shouldIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function MoviePage({ params }: { params: { slug: string } }) {
  const movie = await getMovieBySlug(params.slug);
  const editorial = getEditorial(params.slug);
  
  if (!movie) {
    notFound();
  }

  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const director = movie.credits?.crew.find(c => c.job === 'Director');

  const similarMovies = movie.similar;

  const posterUrl = getMoviePosterUrl(movie.poster_path, 'w500');
  const backdropUrl = getMovieBackdropUrl(movie.backdrop_path, 'original');
  const watchUrl = `https://www.justwatch.com/us/search?q=${encodeURIComponent(movie.title)}`;
  const url = `https://hollyflixhd.com/movies/${params.slug}`;

  // TMDB Watch Providers (US)
  const usProviders = movie['watch/providers']?.results?.US;
  const streamProviders = usProviders?.flatrate || [];
  const freeProviders = [...(usProviders?.free || []), ...(usProviders?.ads || [])];
  const rentProviders = usProviders?.rent || [];
  const hasProviders = streamProviders.length > 0 || freeProviders.length > 0 || rentProviders.length > 0;
  const primaryWatchLink = usProviders?.link || watchUrl;
  
  // JSON-LD Schemas
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "alternateName": `${movie.title} (${year})`,
    "url": url,
    "description": movie.overview,
    "image": posterUrl,
    "datePublished": movie.release_date,
    "duration": movie.runtime ? `PT${Math.floor(movie.runtime / 60)}H${movie.runtime % 60}M` : undefined,
    "genre": movie.genres?.map(g => g.name),
    "inLanguage": "en",
    "director": director ? {
      "@type": "Person",
      "name": director.name,
      "url": `https://hollyflixhd.com/directors/${director.id}-${slugify(director.name)}`
    } : undefined,
    "actor": movie.credits?.cast.slice(0, 5).map(a => ({
      "@type": "Person",
      "name": a.name,
      "url": `https://hollyflixhd.com/actors/${a.id}-${slugify(a.name)}`
    })),
    "aggregateRating": movie.vote_average ? {
      "@type": "AggregateRating",
      "ratingValue": movie.vote_average.toFixed(1),
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": movie.vote_count.toString(),
      "reviewCount": movie.vote_count.toString()
    } : undefined
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://hollyflixhd.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Movies",
        "item": "https://hollyflixhd.com/movies"
      },
      ...(movie.genres && movie.genres.length > 0 ? [{
        "@type": "ListItem",
        "position": 3,
        "name": movie.genres[0].name,
        "item": `https://hollyflixhd.com/genre/${movie.genres[0].id}-${slugify(movie.genres[0].name)}`
      }] : []),
      {
        "@type": "ListItem",
        "position": movie.genres && movie.genres.length > 0 ? 4 : 3,
        "name": `${movie.title} (${year})`,
        "item": url
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Where can I watch ${movie.title} online?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": streamProviders.length > 0
            ? `${movie.title} (${year}) is currently streaming on ${streamProviders.map(p => p.provider_name).slice(0, 3).join(', ')}. You can also rent or buy it on digital platforms.`
            : freeProviders.length > 0
            ? `${movie.title} (${year}) is currently available to watch for free with ads on ${freeProviders.map(p => p.provider_name).slice(0, 2).join(', ')}.`
            : `${movie.title} (${year}) is available to stream or rent online on major digital platforms.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the TMDB rating of ${movie.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `It has a TMDB rating of ${movie.vote_average?.toFixed(1)}/10 based on ${movie.vote_count} votes.`
        }
      },
      ...(director ? [{
        "@type": "Question",
        "name": `Who directed ${movie.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${movie.title} was directed by ${director.name} and released in ${year}.`
        }
      }] : []),
      {
        "@type": "Question",
        "name": `How long is ${movie.title}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": movie.runtime ? `${movie.title} has a runtime of ${Math.floor(movie.runtime / 60)} hours and ${movie.runtime % 60} minutes.` : `The runtime of ${movie.title} is not available.`
        }
      },
      ...(editorial?.endingExplained ? [{
        "@type": "Question",
        "name": `How does ${movie.title} end? (Ending Explained)`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": editorial.endingExplained
        }
      }] : [])
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="relative">
        {/* Breadcrumb Visual */}
        <div className="absolute top-0 left-0 w-full z-20 bg-gradient-to-b from-black/80 to-transparent pt-4 pb-12">
          <div className="container mx-auto px-4 text-sm text-gray-300">
            <Link prefetch={false} href="/" className="hover:text-white">Home</Link> &gt;{' '}
            <Link prefetch={false} href="/movies" className="hover:text-white">Movies</Link> &gt;{' '}
            {movie.genres && movie.genres[0] && (
              <>
                <Link prefetch={false} href={`/genre/${movie.genres[0].id}-${slugify(movie.genres[0].name)}`} className="hover:text-white">
                  {movie.genres[0].name}
                </Link> &gt;{' '}
              </>
            )}
            <span className="text-white">{movie.title} ({year})</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] max-h-[600px] w-full">
          <Image
            src={backdropUrl}
            alt={`${movie.title} ${year} movie scene`}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 items-center md:items-end pb-12 pt-16">
              <div className="relative w-48 md:w-64 aspect-[2/3] flex-shrink-0 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
                <Image src={posterUrl} alt={`${movie.title} ${year} official movie poster`} fill className="object-cover" priority />
              </div>
              
              <div className="text-center md:text-left flex-1">
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  {movie.title} <span className="text-gray-400 font-normal">({year})</span>
                </h1>
                {movie.tagline && <p className="text-xl text-gray-300 italic mb-4">{movie.tagline}</p>}
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded font-bold">
                    TMDB {movie.vote_average?.toFixed(1)}
                  </span>
                  {movie.runtime && (
                    <span className="text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                  )}
                  {movie.genres?.map(g => (
                    <Link prefetch={false} key={g.id} href={`/genre/${g.id}-${slugify(g.name)}`} className="bg-gray-800 hover:bg-gray-700 text-sm px-3 py-1 rounded-full transition-colors">
                      {g.name}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  {streamProviders.length > 0 ? (
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-full px-4 py-2">
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">Stream on:</span>
                      <div className="flex items-center gap-2">
                        {streamProviders.slice(0, 3).map(p => (
                          <a
                            key={p.provider_id}
                            href={primaryWatchLink}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            title={`Stream ${movie.title} on ${p.provider_name}`}
                            className="relative w-8 h-8 rounded-lg overflow-hidden border border-gray-700 hover:scale-110 transition-transform shadow-md"
                          >
                            {p.logo_path ? (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                alt={p.provider_name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-red-600 flex items-center justify-center text-[10px] font-bold">
                                {p.provider_name.slice(0, 3)}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                      <a
                        href="#where-to-watch"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-colors flex items-center gap-1 shadow-md ml-1"
                      >
                        All Platforms
                      </a>
                    </div>
                  ) : freeProviders.length > 0 ? (
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm border border-emerald-900/60 rounded-full px-4 py-2">
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Watch Free:</span>
                      <div className="flex items-center gap-2">
                        {freeProviders.slice(0, 2).map(p => (
                          <a
                            key={p.provider_id}
                            href={primaryWatchLink}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            title={`Watch free on ${p.provider_name}`}
                            className="relative w-8 h-8 rounded-lg overflow-hidden border border-emerald-600 hover:scale-110 transition-transform shadow-md"
                          >
                            {p.logo_path && (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                alt={p.provider_name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </a>
                        ))}
                      </div>
                      <a
                        href="#where-to-watch"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-full text-xs transition-colors shadow-md ml-1"
                      >
                        Free Options
                      </a>
                    </div>
                  ) : (
                    <a
                      href="#where-to-watch"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
                    >
                      Where to Watch
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            {/* Where to Watch */}
            <section id="where-to-watch" className="scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Where to Watch {movie.title} Online</h2>
              
              <div className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-800 space-y-6">
                {hasProviders ? (
                  <>
                    {/* Subscription Streaming */}
                    {streamProviders.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                            Subscription Streaming
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {streamProviders.map(p => (
                            <a
                              key={p.provider_id}
                              href={primaryWatchLink}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-red-500/60 rounded-xl p-3 flex items-center gap-3 transition-all group shadow-sm"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-950 border border-gray-800">
                                {p.logo_path ? (
                                  <Image
                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                    alt={p.provider_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-red-600 flex items-center justify-center text-[10px] font-bold">
                                    {p.provider_name.slice(0, 3)}
                                  </div>
                                )}
                              </div>
                              <div className="truncate min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{p.provider_name}</p>
                                <span className="text-[10px] text-emerald-400 font-medium">Stream</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Free with Ads */}
                    {freeProviders.length > 0 && (
                      <div className="pt-4 border-t border-gray-800/60">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-yellow-400">
                            Watch Free (With Ads)
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {freeProviders.map(p => (
                            <a
                              key={p.provider_id}
                              href={primaryWatchLink}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-yellow-500/60 rounded-xl p-3 flex items-center gap-3 transition-all group shadow-sm"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-950 border border-gray-800">
                                {p.logo_path ? (
                                  <Image
                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                    alt={p.provider_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : null}
                              </div>
                              <div className="truncate min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{p.provider_name}</p>
                                <span className="text-[10px] text-yellow-400 font-medium">Free</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rent & Buy */}
                    {rentProviders.length > 0 && (
                      <div className="pt-4 border-t border-gray-800/60">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                            Rent or Buy (Digital VOD)
                          </h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {rentProviders.slice(0, 8).map(p => (
                            <a
                              key={p.provider_id}
                              href={primaryWatchLink}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="bg-gray-900/90 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/60 rounded-xl p-3 flex items-center gap-3 transition-all group shadow-sm"
                            >
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-950 border border-gray-800">
                                {p.logo_path ? (
                                  <Image
                                    src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                                    alt={p.provider_name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform"
                                  />
                                ) : null}
                              </div>
                              <div className="truncate min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{p.provider_name}</p>
                                <span className="text-[10px] text-gray-400 font-medium">Rent / Buy</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Attribution & JustWatch link */}
                    <div className="pt-4 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                      <span>Streaming data for United States region.</span>
                      <a
                        href={primaryWatchLink}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-red-400 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        <span>Check all options on JustWatch</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-4 text-sm">
                      {movie.release_date && new Date(movie.release_date) > new Date()
                        ? `${movie.title} is currently scheduled for cinema release and not yet streaming.`
                        : `Streaming platforms for ${movie.title} are updated regularly. Check availability on JustWatch.`}
                    </p>
                    <a
                      href={primaryWatchLink}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-colors inline-flex items-center gap-2"
                    >
                      Find Where to Stream
                    </a>
                  </div>
                )}
              </div>
            </section>

            {/* Plot */}
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Plot Summary</h2>
              <p className="text-gray-300 leading-relaxed text-lg">{movie.overview}</p>
            </section>

            <EditorialContainer
              slug={params.slug}
              movie={movie}
              initialEditorial={editorial}
            />

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Full Cast & Characters</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 12).map(actor => (
                    <Link prefetch={false} href={`/actors/${actor.id}-${slugify(actor.name)}`} key={actor.id} className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-gray-800 hover:border-red-500 transition-colors group">
                      <div className="relative aspect-[2/3]">
                        <Image 
                          src={actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : '/images/no-actor.png'}
                          alt={`${actor.name} as ${actor.character} in ${movie.title} ${year}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-sm truncate">{actor.name}</p>
                        <p className="text-xs text-gray-400 truncate">{actor.character}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Director & Crew */}
            {director && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Director & Crew</h2>
                <Link prefetch={false} href={`/directors/${director.id}-${slugify(director.name)}`} className="inline-block bg-[#1a1a1a] border border-gray-800 rounded-lg p-4 hover:border-red-500 transition-colors">
                  <p className="font-semibold">{director.name}</p>
                  <p className="text-sm text-gray-400">Director</p>
                </Link>
              </section>
            )}

            {/* Trailer */}
            {movie.videos?.results && movie.videos.results.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Official Trailer</h2>
                <div className="aspect-video w-full bg-[#1a1a1a] rounded-lg overflow-hidden flex items-center justify-center border border-gray-800 relative group cursor-pointer">
                  <Image 
                    src={`https://img.youtube.com/vi/${movie.videos.results[0].key}/maxresdefault.jpg`}
                    alt={`${movie.title} Trailer`}
                    fill
                    className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                  />
                  <div className="absolute z-10 w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-[12px] border-t-transparent border-b-transparent border-l-white ml-1"></div>
                  </div>
                </div>
              </section>
            )}
            
            {/* Similar Movies */}
            {similarMovies && similarMovies.results.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Movies Similar to {movie.title}</h2>
                <MovieGrid movies={similarMovies.results.slice(0, 6)} />
              </section>
            )}

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-2">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((q, idx) => (
                  <div key={idx} className="bg-[#1a1a1a] rounded-lg p-4 border border-gray-800">
                    <h3 className="font-bold text-lg mb-2 text-white">{q.name}</h3>
                    <p className="text-gray-400">{q.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="bg-[#1a1a1a] p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Movie Details</h2>
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-gray-500 mb-1">Release Date</dt>
                  <dd className="font-semibold">
                    <Link prefetch={false} href={`/year/${year}`} className="hover:text-red-500">{movie.release_date}</Link>
                  </dd>
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
    </>
  );
}
