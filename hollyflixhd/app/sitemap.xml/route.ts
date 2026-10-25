import { absoluteUrl, sitemapIndexResponse } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  return sitemapIndexResponse([
    { loc: absoluteUrl('/sitemap-movies.xml') },
    { loc: absoluteUrl('/sitemap-editorials.xml') },
    { loc: absoluteUrl('/sitemap-blog.xml') },
    { loc: absoluteUrl('/sitemap-genres.xml') },
  ])
}
