import { getPopularMovies } from '@/lib/tmdb';

export const revalidate = 86400;

export const metadata = {
  title: 'Popular Actors | HollyFlixHD',
  description: 'Browse popular Hollywood actors and their movies.',
};

export default async function ActorsPage() {
  // Simple fallback: Get popular movies and extract their cast to show popular actors
  await getPopularMovies(1);
  // Ideally, there would be a getPopularActors API method from TMDB /person/popular
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Actors</h1>
      <p className="text-gray-400 mb-8">
        (Actor directory currently requires further integration with the TMDB Person API)
      </p>
    </div>
  );
}
