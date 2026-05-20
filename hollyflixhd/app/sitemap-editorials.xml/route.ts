import { absoluteUrl, sitemapResponse, SitemapUrl, today } from '@/lib/sitemap'
import fs from 'fs'
import path from 'path'

export const revalidate = 3600

export async function GET() {
  const lastmod = today()
  let urls: SitemapUrl[] = []

  try {
    const editorialsDir = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(editorialsDir)) {
      const files = fs.readdirSync(editorialsDir).filter(f => f.endsWith('.json'))
      urls = files.map(file => {
        const slug = file.replace('.json', '')
        return {
          loc: absoluteUrl(`/movies/${slug}`),
          lastmod,
          changefreq: 'weekly',
          priority: 1.0, // Give editorials highest priority
        }
      })
    }
  } catch (error) {
    console.error("Error reading editorials for sitemap:", error)
  }

  return sitemapResponse(urls)
}
