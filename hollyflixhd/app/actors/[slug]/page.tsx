import { getActorById, getActorMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Movie } from '@/types/movie';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const actorId = parseInt(params.slug.split('-')[0], 10); // Simple extraction
  if (isNaN(actorId)) return { title: 'Actor Not Found' };

  try {
    const actor = await getActorById(actorId);
    return {
      title: `${actor.name} Movies, Bio & Profile | HollyFlixHD`,
      description: `Complete list of movies starring ${actor.name}. Bio, character names, and where to watch.`,
      alternates: {
        canonical: `https://hollyflixhd.com/actors/${params.slug}`,
      },
      openGraph: {
        title: `${actor.name} Movies, Bio & Profile | HollyFlixHD`,
        description: `Complete list of movies starring ${actor.name}. Bio, character names, and where to watch.`,
        type: 'profile',
        url: `https://hollyflixhd.com/actors/${params.slug}`,
        images: actor.profile_path ? [{ url: `https://image.tmdb.org/t/p/h632${actor.profile_path}`, alt: actor.name }] : [],
        siteName: 'HollyFlixHD',
        locale: 'en_US',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${actor.name} Movies, Bio & Profile | HollyFlixHD`,
        description: `Complete list of movies starring ${actor.name}. Bio, character names, and where to watch.`,
        images: actor.profile_path ? [`https://image.tmdb.org/t/p/h632${actor.profile_path}`] : [],
      },
    };
  } catch {
    return { title: 'Actor Not Found' };
  }
}

export default async function ActorPage({ params }: { params: { slug: string } }) {
  const actorId = parseInt(params.slug.split('-')[0], 10);
  if (isNaN(actorId)) notFound();

  try {
    const [actor, movies] = await Promise.all([
      getActorById(actorId),
      getActorMovies(actorId)
    ]);

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": actor.name,
      "url": `https://hollyflixhd.com/actors/${params.slug}/`,
      "image": actor.profile_path ? `https://image.tmdb.org/t/p/h632${actor.profile_path}` : undefined,
      "jobTitle": "Actor"
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="relative w-48 h-72 flex-shrink-0 rounded-lg overflow-hidden border border-gray-800">
              <Image 
                src={actor.profile_path ? `https://image.tmdb.org/t/p/h632${actor.profile_path}` : '/images/no-actor.webp'}
                alt={`${actor.name} - Actor Profile Photo`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-4">{actor.name}</h1>
              <h2 className="text-xl text-gray-400 mb-2">Biography</h2>
              {/* Biography requires additional fields in types, fallback to minimal bio */}
              <p className="text-gray-300 leading-relaxed max-w-3xl">
                Famous for their work in {actor.department || 'Acting'}.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Known For</h2>
          {/* Sort by popularity */}
          <MovieGrid movies={movies.cast.sort((a: Movie, b: Movie) => (b.popularity || 0) - (a.popularity || 0)).slice(0, 18)} />
        </div>
      </>
    );
  } catch {
    notFound();
  }
}
