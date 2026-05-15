import { getActorById, getActorMovies } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const directorId = parseInt(params.slug.split('-')[0], 10);
  if (isNaN(directorId)) return { title: 'Director Not Found' };

  try {
    const director = await getActorById(directorId); // directors use the person API too
    return {
      title: `Movies Directed by ${director.name} | HollyFlixHD`,
      description: `Complete list of movies directed by ${director.name}.`,
    };
  } catch {
    return { title: 'Director Not Found' };
  }
}

export default async function DirectorPage({ params }: { params: { slug: string } }) {
  const directorId = parseInt(params.slug.split('-')[0], 10);
  if (isNaN(directorId)) notFound();

  try {
    const [director, movies] = await Promise.all([
      getActorById(directorId),
      getActorMovies(directorId) // In real world we fetch crew credits for directors, using cast for fallback in this MVP
    ]);

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": director.name,
      "url": `https://hollyflixhd.com/directors/${params.slug}/`,
      "image": director.profile_path ? `https://image.tmdb.org/t/p/h632${director.profile_path}` : undefined,
      "jobTitle": "Director"
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">{director.name}</h1>
          <p className="text-gray-400 mb-8">Director Profile</p>
          
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-800 pb-2">Filmography</h2>
          <MovieGrid movies={movies.cast} />
        </div>
      </>
    );
  } catch {
    notFound();
  }
}
