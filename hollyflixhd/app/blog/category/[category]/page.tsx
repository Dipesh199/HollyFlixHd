import { Metadata } from 'next'
import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
import BlogCard from '@/components/blog/BlogCard'
import BlogGrid from '@/components/blog/BlogGrid'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Movie Blogs Categories | HollyFlixHD',
  description: 'Browse our movie blogs by category.',
}

export default function BlogCategoryPage({ params }: { params: { category: string } }) {
  const { category } = params

  if (category !== 'lists' && category !== 'ending-explained') {
    notFound()
  }

  const posts = category === 'lists' 
    ? listsData 
    : endingExplainedData

  const sortedPosts = [...posts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const categoryName = category === 'lists' ? 'Best Of Lists' : 'Ending Explained'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 border-b border-gray-800 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Browsing all posts in {categoryName.toLowerCase()}.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <Link href="/blog" className="px-6 py-2 rounded-full bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors">
          All
        </Link>
        <Link 
          href="/blog/category/lists" 
          className={`px-6 py-2 rounded-full ${category === 'lists' ? 'bg-red-600 text-white font-bold' : 'bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors'}`}
        >
          Best Of Lists
        </Link>
        <Link 
          href="/blog/category/ending-explained" 
          className={`px-6 py-2 rounded-full ${category === 'ending-explained' ? 'bg-red-600 text-white font-bold' : 'bg-[#1a1a1a] text-gray-300 hover:bg-gray-800 transition-colors'}`}
        >
          Ending Explained
        </Link>
      </div>

      <BlogGrid>
        {sortedPosts.map(post => (
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
