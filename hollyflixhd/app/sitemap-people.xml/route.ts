import { getPopularPersons } from '@/lib/tmdb'
import { slugify } from '@/lib/slugify'
import { absoluteUrl, sitemapResponse, SitemapUrl, today } from '@/lib/sitemap'

export const revalidate = 3600

const PERSON_PAGES = 5

export async function GET() {
  const lastmod = today()
  const personResults = await Promise.all(
    Array.from({ length: PERSON_PAGES }, (_, i) => getPopularPersons(i + 1).catch(() => null))
  )
  const people = personResults
    .filter((res): res is NonNullable<typeof res> => res !== null)
    .flatMap((res) => res.results)
  const uniquePeople = Array.from(new Map(people.map((person) => [person.id, person])).values())

  const urls: SitemapUrl[] = [
    { loc: absoluteUrl('/actors'), lastmod, changefreq: 'weekly', priority: 0.7 },
    ...uniquePeople.map((person) => ({
      loc: absoluteUrl(`/actors/${person.id}-${slugify(person.name)}`),
      lastmod,
      changefreq: 'monthly' as const,
      priority: 0.7,
    })),
    ...uniquePeople.map((person) => ({
      loc: absoluteUrl(`/directors/${person.id}-${slugify(person.name)}`),
      lastmod,
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  return sitemapResponse(urls)
}
