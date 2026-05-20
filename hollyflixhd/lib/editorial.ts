import fs from 'fs'
import path from 'path'

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


export function getEditorial(slug: string): Editorial | null {
  try {
    const filePath = path.join(process.cwd(), 'data', 'editorials', `${slug}.json`)
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(fileContents) as Editorial
    }
  } catch (error) {
    console.error(`Error reading editorial for ${slug}:`, error)
  }
  return null
}

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
