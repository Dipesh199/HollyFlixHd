export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hollyflixhd.com'

export type SitemapUrl = {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export type SitemapIndexEntry = {
  loc: string
  lastmod?: string
}

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

export const absoluteUrl = (path: string) => `${SITE_URL}${path}`

export const today = () => new Date().toISOString()

export const uniqueUrls = (urls: SitemapUrl[]) =>
  Array.from(new Map(urls.map((url) => [url.loc, url])).values())

export function sitemapResponse(urls: SitemapUrl[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueUrls(urls).map((url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
${url.lastmod ? `    <lastmod>${xmlEscape(url.lastmod)}</lastmod>\n` : ''}${url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>\n` : ''}${url.priority !== undefined ? `    <priority>${url.priority.toFixed(1)}</priority>\n` : ''}  </url>`).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

export function sitemapIndexResponse(entries: SitemapIndexEntry[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((entry) => `  <sitemap>
    <loc>${xmlEscape(entry.loc)}</loc>
${entry.lastmod ? `    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>\n` : ''}  </sitemap>`).join('\n')}
</sitemapindex>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
