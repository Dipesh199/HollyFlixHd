import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
import ListPost, { ListPostData } from '@/components/blog/ListPost'
import EndingExplainedPost, { EndingExplainedPostData } from '@/components/blog/EndingExplainedPost'
import Link from 'next/link'

function getPostBySlug(slug: string) {
  const listPost = listsData.find(p => p.slug === slug)
  if (listPost) return { ...listPost, type: 'lists' }

  const endingPost = endingExplainedData.find(p => p.slug === slug)
  if (endingPost) return { ...endingPost, type: 'ending-explained' }

  return null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  
  if (!post) {
    return { title: 'Post Not Found | HollyFlixHD' }
  }

  const url = `https://hollyflixhd.com/blog/${params.slug}/`

  return {
    title: `${post.title} | HollyFlixHD Blog`,
    description: post.metaDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      url,
      siteName: 'HollyFlixHD',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gradient-to-b from-black/80 to-transparent pt-4 pb-4">
        <div className="container mx-auto px-4 text-sm text-gray-300">
          <Link href="/" className="hover:text-white">Home</Link> &gt;{' '}
          <Link href="/blog" className="hover:text-white">Blog</Link> &gt;{' '}
          <span className="text-white">{post.title}</span>
        </div>
      </div>

      {post.type === 'lists' ? (
        <ListPost post={post as ListPostData} />
      ) : (
        <EndingExplainedPost post={post as EndingExplainedPostData} />
      )}
    </>
  )
}
