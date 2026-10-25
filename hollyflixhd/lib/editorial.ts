import fs from 'fs'
import path from 'path'
import { PUBLISHED_EDITORIAL_SLUGS } from './published-editorial-slugs'

export type Editorial = {
  editorial: string
  worthWatching: boolean
  editorRating: 'Must Watch' | 'Worth Watching' | 'Skip It' | 'Cult Classic'
  tags: string[]
  toneAndPace?: string
  targetAudience?: string
  similarMovies?: string[]
  watchReasons?: string[]
}

const inFlightGenerations = new Map<string, Promise<Editorial | null>>()
const publishedEditorialSlugs = new Set<string>(PUBLISHED_EDITORIAL_SLUGS)
export const isValidEditorialSlug = (slug: string) => /^[a-z0-9_]+(?:-[a-z0-9_]+)*$/.test(slug)
export const isPublishedEditorialSlug = (slug: string) => publishedEditorialSlugs.has(slug)

function readEditorial(slug: string, includeArchive = false): Editorial | null {
  if (!isValidEditorialSlug(slug)) return null
  try {
    const directories = includeArchive ? ['editorials', 'editorials_archive'] : ['editorials']
    for (const directory of directories) {
      const filePath = path.join(process.cwd(), 'data', directory, `${slug}.json`)
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContents) as Editorial
      }
    }
  } catch (error) {
    console.error(`Error reading editorial for ${slug}:`, error)
  }
  return null
}

export function getEditorial(slug: string): Editorial | null {
  return isPublishedEditorialSlug(slug) ? readEditorial(slug) : null
}

export function hasEditorialDraft(slug: string): boolean {
  return readEditorial(slug, true) !== null
}

export function saveEditorial(slug: string, editorial: Editorial): boolean {
  if (!isValidEditorialSlug(slug)) return false
  let tempPath: string | undefined
  try {
    const dirPath = path.join(process.cwd(), 'data', 'editorials')
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
    const filePath = path.join(dirPath, `${slug}.json`)
    tempPath = path.join(dirPath, `.${slug}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`)
    fs.writeFileSync(tempPath, JSON.stringify(editorial, null, 2), 'utf8')
    fs.renameSync(tempPath, filePath)
    return true
  } catch (error) {
    if (tempPath) {
      try { fs.unlinkSync(tempPath) } catch { /* Nothing to clean up. */ }
    }
    console.error(`Error saving editorial for ${slug}:`, error)
    return false
  }
}

export { PUBLISHED_EDITORIAL_SLUGS }

export function getAllEditorialSlugs(): string[] {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
    }
  } catch (error) {
    console.error('Error reading editorials directory:', error)
  }
  return []
}

export function getRecentEditorialSlugs(limit: number = 6): string[] {
  try {
    const dirPath = path.join(process.cwd(), 'data', 'editorials')
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.json'))
        .filter(file => isPublishedEditorialSlug(file.replace('.json', '')))
        .map(file => {
          const fullPath = path.join(dirPath, file)
          return {
            slug: file.replace('.json', ''),
            mtime: fs.statSync(fullPath).mtime.getTime()
          }
        })
        .sort((a, b) => b.mtime - a.mtime)
        .slice(0, limit)
        .map(item => item.slug)
      return files
    }
  } catch (error) {
    console.error('Error reading recent editorials:', error)
  }
  return []
}

export async function getOrGenerateEditorial(
  slug: string,
  context?: {
    title: string
    year?: string
    overview?: string
    genres?: string[]
    director?: string
  }
): Promise<Editorial | null> {
  // 1. Fast path: check local disk
  const existing = readEditorial(slug, true)
  if (existing) {
    return existing
  }

  // 2. Prevent duplicate in-flight requests for the same slug
  if (inFlightGenerations.has(slug)) {
    return inFlightGenerations.get(slug)!
  }

  const apiKey = process.env.OLLAMA_API_KEY
  const cloudModel = process.env.OLLAMA_MODEL || 'gemma4:31b'
  if (!apiKey && !process.env.ENABLE_LOCAL_OLLAMA) {
    return null
  }

  const generationPromise = (async (): Promise<Editorial | null> => {
    try {
      const movieTitle = context?.title || slug.replace(/-(\d{4})$/, '').replace(/-/g, ' ')
      const movieYear = context?.year || (slug.match(/-(\d{4})$/)?.[1] || '')
      const overview = context?.overview || 'Plot synopsis not available.'
      const genres = context?.genres?.join(', ') || 'Drama, Cinema'
      const director = context?.director || 'Unknown'

      const prompt = `You are a senior movie critic and editorial writer for HollyFlixHD — a premium movie database.
Write an authentic, punchy editorial review for the movie:
Title: ${movieTitle} (${movieYear})
Genre: ${genres}
Director: ${director}
Overview: ${overview}

EDITORIAL RULES:
- Write 4-6 sentences structured as: hook -> what makes it unique -> one standout element -> who it's for.
- Be specific, honest, and focus on the watching experience.
- Write in second person, addressing the reader as "you".
- Do not start with "I", "This movie", or the movie title.
- Do not include emojis or markdown inside JSON string values.

OUTPUT JSON FORMAT ONLY:
{
  "editorial": "4-6 sentence engaging, spoiler-free editorial review.",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["mood-tag", "genre-tag", "audience-tag"],
  "toneAndPace": "slow-burn, cerebral, visually intense",
  "targetAudience": "Ideal for fans of...",
  "similarMovies": ["Movie 1", "Movie 2", "Movie 3"],
  "watchReasons": ["standout acting", "gripping atmosphere", "unpredictable twist"]
}
FIELD CONSTRAINTS:
- editorRating must be exactly one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic"
- worthWatching must be true if editorRating is "Must Watch", "Worth Watching", or "Cult Classic", false only for "Skip It"
- tags: 3-4 lowercase strings
- similarMovies: 2-3 well-known real movies with similar vibe`

      const url = apiKey ? 'https://ollama.com/api/generate' : 'http://localhost:11434/api/generate'
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: apiKey ? cloudModel : 'gemma4',
          prompt,
          stream: false,
          format: 'json',
          options: { num_predict: 1000 }
        }),
        signal: AbortSignal.timeout(90000)
      })

      if (!res.ok) {
        console.error(`[HollyFlixHD] Ollama API error (${res.status}): ${res.statusText}`)
        return null
      }

      const data = await res.json()
      let rawText = (data.response || '').trim()

      const firstBrace = rawText.indexOf('{')
      const lastBrace = rawText.lastIndexOf('}')
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
        rawText = rawText.substring(firstBrace, lastBrace + 1)
      }

      const parsed = JSON.parse(rawText) as Editorial

      if (parsed.editorial && parsed.editorRating) {
        if (!Array.isArray(parsed.tags)) parsed.tags = ['movie', 'hollywood']
        if (typeof parsed.worthWatching !== 'boolean') parsed.worthWatching = parsed.editorRating !== 'Skip It'

        if (!saveEditorial(slug, parsed)) return null
        console.log(`[HollyFlixHD] Dynamically generated and saved editorial for: ${slug}`)
        return parsed
      }
    } catch (err) {
      console.error(`[HollyFlixHD] On-demand editorial generation failed for ${slug}:`, err)
    } finally {
      inFlightGenerations.delete(slug)
    }
    return null
  })()

  inFlightGenerations.set(slug, generationPromise)
  return generationPromise
}
