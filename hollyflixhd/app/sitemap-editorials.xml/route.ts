import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'
import { isValidEditorialSlug, PUBLISHED_EDITORIAL_SLUGS } from '@/lib/editorial'

export const dynamic = 'force-dynamic'

export async function GET() {
  const urls: SitemapUrl[] = []

  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(editorialsDir)) {
      const featuredSet = new Set<string>(PUBLISHED_EDITORIAL_SLUGS)
      const allFiles = fs.readdirSync(editorialsDir).filter(f => f.endsWith('.json'))

      // 1. Featured flagship reviews (highest priority 0.9)
      for (const slug of PUBLISHED_EDITORIAL_SLUGS) {
        const filePath = path.join(editorialsDir, `${slug}.json`)
        let lastmod = new Date().toISOString()
        try {
          if (fs.existsSync(filePath)) {
            lastmod = fs.statSync(filePath).mtime.toISOString()
          }
        } catch { /* use fallback date */ }

        urls.push({
          loc: absoluteUrl(`/movies/${slug}`),
          lastmod,
          changefreq: 'weekly',
          priority: 0.9,
        })
      }

      // 2. All valid movie editorials generated until now (priority 0.8)
      for (const file of allFiles) {
        const slug = file.replace('.json', '')
        if (featuredSet.has(slug)) continue
        if (!isValidEditorialSlug(slug)) continue

        let lastmod = new Date().toISOString()
        try {
          lastmod = fs.statSync(path.join(editorialsDir, file)).mtime.toISOString()
        } catch { /* use fallback date */ }

        urls.push({
          loc: absoluteUrl(`/movies/${slug}`),
          lastmod,
          changefreq: 'monthly',
          priority: 0.8,
        })
      }
    }
  } catch (error) {
    console.error("Error reading editorials for sitemap:", error)
  }

  return sitemapResponse(urls)
}
