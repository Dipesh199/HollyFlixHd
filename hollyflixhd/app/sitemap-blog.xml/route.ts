import listsData from '@/data/lists.json'
import endingExplainedData from '@/data/ending-explained.json'
import { absoluteUrl, sitemapResponse, SitemapUrl, today } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const lastmod = today()
  const urls: SitemapUrl[] = [
    { loc: absoluteUrl('/blog'), lastmod, changefreq: 'daily', priority: 0.8 },
    { loc: absoluteUrl('/blog/category/lists'), lastmod, changefreq: 'weekly', priority: 0.7 },
    { loc: absoluteUrl('/blog/category/ending-explained'), lastmod, changefreq: 'weekly', priority: 0.7 },
    ...listsData.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: post.publishedAt ? new Date(post.publishedAt).toISOString() : lastmod,
      changefreq: 'monthly' as const,
      priority: 0.8,
    })),
    ...endingExplainedData.map((post) => ({
      loc: absoluteUrl(`/blog/${post.slug}`),
      lastmod: post.publishedAt ? new Date(post.publishedAt).toISOString() : lastmod,
      changefreq: 'monthly' as const,
      priority: 0.8,
    })),
  ]

  return sitemapResponse(urls)
}
