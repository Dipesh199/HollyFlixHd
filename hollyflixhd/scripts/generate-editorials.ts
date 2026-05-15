import fs from 'fs'
import path from 'path'
import { getMovieBySlug } from '../lib/tmdb'

const EDITORIALS_PATH = path.join(__dirname, '../data/editorials.json')
const OLLAMA_URL = 'http://localhost:11434/api/generate'

// Example slugs if none provided
const DEFAULT_SLUGS = [
  'inception-2010',
  'the-dark-knight-2008',
  'interstellar-2014',
  'dunkirk-2017',
  'tenet-2020'
]

async function generateEditorial(slug: string, current: number, total: number) {
  try {
    const movie = await getMovieBySlug(slug)
    if (!movie) {
      console.warn(`⚠️  Movie not found for slug: ${slug}`)
      return false
    }

    const year = movie.release_date ? movie.release_date.split('-')[0] : 'Unknown'
    const genres = movie.genres?.map(g => g.name).join(', ') || 'Unknown'
    const director = movie.credits?.crew.find(c => c.job === 'Director')?.name || 'Unknown'

    const prompt = `Write a 2-3 sentence editorial about the movie "${movie.title} (${year})".
Genre: ${genres}. Director: ${director}.
Rules:
- Be specific about what makes this movie unique
- Mention who should watch it
- Keep it under 60 words
- Do not start with the word "I" or "This movie"
- Write in second person, addressing the reader as "you"
- Also return: worthWatching (true/false), editorRating (one of: Must Watch, Worth Watching, Skip It, Cult Classic), tags (array of 3-4 short lowercase strings)
- Respond in raw JSON only. No explanation. No markdown.

JSON format:
{
  "editorial": "...",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["mind-bending", "rewatch-worthy"]
}`

    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3.6:35b',
        prompt: prompt,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`Ollama HTTP Error: ${response.statusText}`)
    }

    const data = await response.json()
    let rawText = data.response.trim()
    
    // Clean up potential markdown blocks if the model didn't listen
    if (rawText.startsWith('```json')) {
      rawText = rawText.replace(/^```json/, '').replace(/```$/, '').trim()
    } else if (rawText.startsWith('```')) {
      rawText = rawText.replace(/^```/, '').replace(/```$/, '').trim()
    }

    const parsed = JSON.parse(rawText)
    
    // Basic validation
    if (!parsed.editorial || typeof parsed.worthWatching !== 'boolean' || !parsed.editorRating || !Array.isArray(parsed.tags)) {
      throw new Error('Invalid JSON structure returned by Ollama')
    }

    return parsed
  } catch (error: any) {
    console.warn(`⚠️  Skipping ${slug}: ${error.message}`)
    return null
  }
}

async function main() {
  const inputArgs = process.argv.slice(2)
  const slugsToProcess = inputArgs.length > 0 ? inputArgs : DEFAULT_SLUGS

  let editorials: Record<string, any> = {}
  
  if (fs.existsSync(EDITORIALS_PATH)) {
    const fileContent = fs.readFileSync(EDITORIALS_PATH, 'utf-8')
    editorials = JSON.parse(fileContent || '{}')
  }

  let count = 0

  for (const slug of slugsToProcess) {
    count++
    if (editorials[slug]) {
      console.log(`⏩ ${slug} already exists (${count}/${slugsToProcess.length})`)
      continue
    }

    const result = await generateEditorial(slug, count, slugsToProcess.length)
    if (result) {
      editorials[slug] = result
      fs.writeFileSync(EDITORIALS_PATH, JSON.stringify(editorials, null, 2))
      console.log(`✅ ${slug} done (${count}/${slugsToProcess.length})`)
    }
  }
}

main().catch(console.error)
