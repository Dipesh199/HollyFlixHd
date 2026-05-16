import { Metadata } from 'next'
import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
import BlogCard from '@/components/blog/BlogCard'
import BlogGrid from '@/components/blog/BlogGrid'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Movie Blogs, Rankings & Ending Explained | HollyFlixHD',
  description: 'Read the latest movie blogs, top lists, and ending explained articles from the HollyFlixHD editorial team.',
}

export default function BlogIndexPage() {
  const allPosts = [
    ...listsData.map(post => ({ ...post, type: 'lists' })),
    ...endingExplainedData.map(post => ({ ...post, type: 'ending-explained' }))
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-800 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">The HollyFlixHD Blog</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Deep dives, ending explanations, and definitively ranked lists from our editorial team.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <Link prefetch={false} href="/blog" className="px-6 py-2 rounded-full bg-red-600 text-white font-bold">
          All
        </Link>
        <Link prefetch={false} href="/blog/category/lists" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors">
          Best Of Lists
        </Link>
        <Link prefetch={false} href="/blog/category/ending-explained" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors">
          Ending Explained
        </Link>
      </div>

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
    </div>
  )
}
