import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'
import { getAllEditorialSlugs, isValidEditorialSlug } from '@/lib/editorial'

export const dynamic = 'force-dynamic'

export async function GET() {
  let urls: SitemapUrl[] = []

  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(editorialsDir)) {
      urls = getAllEditorialSlugs().filter(slug =>
        isValidEditorialSlug(slug) && /-(?:19|20)\d{2}$/.test(slug)
      ).map(slug => {
        const file = `${slug}.json`
        return {
          loc: absoluteUrl(`/movies/${slug}`),
          lastmod: fs.statSync(path.join(editorialsDir, file)).mtime.toISOString(),
          changefreq: 'weekly',
          priority: 0.9,
        }
      })
    }
  } catch (error) {
    console.error("Error reading editorials for sitemap:", error)
  }

  return sitemapResponse(urls)
}
