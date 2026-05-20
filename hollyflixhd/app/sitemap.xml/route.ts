import { absoluteUrl, sitemapIndexResponse, today } from '@/lib/sitemap'

export const revalidate = 3600

export async function GET() {
  const lastmod = today()

  return sitemapIndexResponse([
    { loc: absoluteUrl('/sitemap-movies.xml'), lastmod },
    { loc: absoluteUrl('/sitemap-editorials.xml'), lastmod },
    { loc: absoluteUrl('/sitemap-blog.xml'), lastmod },
    { loc: absoluteUrl('/sitemap-genres.xml'), lastmod },
    { loc: absoluteUrl('/sitemap-people.xml'), lastmod },
  ])
}
