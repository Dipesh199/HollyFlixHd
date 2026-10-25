import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'
import { PUBLISHED_EDITORIAL_SLUGS } from '@/lib/published-editorial-slugs'

export const dynamic = 'force-dynamic'

export async function GET() {
  let urls: SitemapUrl[] = []

  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(editorialsDir)) {
      urls = PUBLISHED_EDITORIAL_SLUGS.filter(slug =>
        fs.existsSync(path.join(editorialsDir, `${slug}.json`))
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
