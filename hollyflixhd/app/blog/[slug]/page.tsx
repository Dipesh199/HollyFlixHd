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

  const url = `https://hollyflixhd.com/blog/${params.slug}`

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
      images: [
        {
          url: 'https://hollyflixhd.com/images/og-blog-default.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: ['https://hollyflixhd.com/images/og-blog-default.jpg'],
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "image": "https://hollyflixhd.com/images/og-blog-default.jpg",
    "datePublished": post.publishedAt,
    "dateModified": post.publishedAt,
    "author": {
      "@type": "Organization",
      "name": "HollyFlixHD Editorial Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "HollyFlixHD",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hollyflixhd.com/icon.svg"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hollyflixhd.com/blog/${params.slug}`
    }
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
        "name": "Blog",
        "item": "https://hollyflixhd.com/blog/"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://hollyflixhd.com/blog/${params.slug}`
      }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Breadcrumb */}
      <div className="bg-gradient-to-b from-black/80 to-transparent pt-4 pb-4">
        <div className="container mx-auto px-4 text-sm text-gray-300">
          <Link prefetch={false} href="/" className="hover:text-white">Home</Link> &gt;{' '}
          <Link prefetch={false} href="/blog" className="hover:text-white">Blog</Link> &gt;{' '}
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
