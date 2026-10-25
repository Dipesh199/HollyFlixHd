import { Metadata } from 'next'
import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
import BlogCard from '@/components/blog/BlogCard'
import BlogGrid from '@/components/blog/BlogGrid'
import Link from 'next/link'
import { PUBLISHED_EDITORIAL_SLUGS, getEditorial } from '@/lib/editorial'
import { getMovieBySlug } from '@/lib/tmdb'
import MovieCard from '@/components/movie/MovieCard'

// TMDB credentials are available at runtime, not during the Coolify image build.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Movie Editorials, Deep Dives & Reviews | HollyFlixHD',
  description: 'Read fact-checked movie editorials, definitively ranked lists, and ending explanations from the HollyFlixHD editorial team.',
}

export default async function BlogIndexPage() {
  const allPosts = [
    ...listsData.map(post => ({ ...post, type: 'lists' })),
    ...endingExplainedData.map(post => ({ ...post, type: 'ending-explained' }))
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const editorialMovies = await Promise.all(
    PUBLISHED_EDITORIAL_SLUGS.map(async (slug) => {
      try {
        const movie = await getMovieBySlug(slug);
        const editorial = getEditorial(slug);
        if (!movie) return null;
        return { movie, editorial };
      } catch {
        return null;
      }
    })
  ).then((items) => items.filter((item): item is NonNullable<typeof item> => item !== null))

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-800 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">The HollyFlixHD Editorial Hub</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Fact-checked movie reviews, definitive rankings, and deep narrative breakdowns from our senior film critics.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link prefetch={false} href="/blog" className="px-6 py-2 rounded-full bg-red-600 text-white font-bold text-sm">
          All
        </Link>
        <a href="#editorials" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors text-sm font-semibold">
          ★ Curated Film Reviews ({editorialMovies.length})
        </a>
        <Link prefetch={false} href="/blog/category/lists" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors text-sm font-semibold">
          Best Of Lists
        </Link>
        <Link prefetch={false} href="/blog/category/ending-explained" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors text-sm font-semibold">
          Ending Explained
        </Link>
      </div>

      {/* Published Film Reviews Section */}
      <section id="editorials" className="mb-16 bg-gradient-to-br from-red-950/20 via-[#141414] to-amber-950/20 border border-gray-800 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2">
              <span className="text-red-500">★</span> Published Film Reviews &amp; Editorials
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Independent, fact-checked verdicts on the most searched and acclaimed films to help you decide what to watch next.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-700 text-xs font-semibold text-gray-300 self-start sm:self-auto">
            {editorialMovies.length} Published
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {editorialMovies.map(({ movie, editorial }) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              editorialBadge={editorial?.editorRating}
            />
          ))}
        </div>
      </section>

      {/* In-Depth Articles & Lists */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-800 pb-2">
          Deep Dives &amp; Film Guides
        </h2>
        <BlogGrid>
          {allPosts.map(post => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              category={post.category}
              publishedAt={post.publishedAt}
            />
          ))}
        </BlogGrid>
      </section>
    </div>
  )
}
