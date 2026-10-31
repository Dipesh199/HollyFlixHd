import { absoluteUrl, sitemapResponse, SitemapUrl } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'
import { isValidEditorialSlug, PUBLISHED_EDITORIAL_SLUGS } from '@/lib/editorial'

export const dynamic = 'force-dynamic'

// Maximum number of curated movie editorials to expose to Google in the sitemap.
// Prevents crawl-budget exhaustion and low-quality indexation penalties on large programmatic libraries.
const SITEMAP_EDITORIAL_LIMIT = 250

export async function GET() {
  let urls: SitemapUrl[] = []

  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(editorialsDir)) {
      const featuredSet = new Set(PUBLISHED_EDITORIAL_SLUGS)
      const allFiles = fs.readdirSync(editorialsDir).filter(f => f.endsWith('.json'))

      // 1. Featured flagship reviews (highest priority)
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

      // 2. High-priority modern releases (2024-2026), sorted by newest update
      const modernCandidates: { slug: string; mtime: number; iso: string }[] = []
      for (const file of allFiles) {
        const slug = file.replace('.json', '')
        if (featuredSet.has(slug as any)) continue
        if (!isValidEditorialSlug(slug)) continue

        // Focus on recent modern releases
        if (/-(?:202[4-6])$/.test(slug)) {
          try {
            const stat = fs.statSync(path.join(editorialsDir, file))
            modernCandidates.push({
              slug,
              mtime: stat.mtimeMs,
              iso: stat.mtime.toISOString(),
            })
          } catch { /* skip unreadable file */ }
        }
      }

      modernCandidates.sort((a, b) => b.mtime - a.mtime)
      const slotsRemaining = Math.max(0, SITEMAP_EDITORIAL_LIMIT - urls.length)
      const additional = modernCandidates.slice(0, slotsRemaining)

      for (const item of additional) {
        urls.push({
          loc: absoluteUrl(`/movies/${item.slug}`),
          lastmod: item.iso,
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
