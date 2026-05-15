import editorials from '@/data/editorials.json'

export type Editorial = {
  editorial: string
  worthWatching: boolean
  editorRating: 'Must Watch' | 'Worth Watching' | 'Skip It' | 'Cult Classic'
  tags: string[]
}

export function getEditorial(slug: string): Editorial | null {
  return (editorials as Record<string, Editorial>)[slug] ?? null
}
