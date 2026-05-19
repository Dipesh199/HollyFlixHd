import React from 'react'
import { Editorial } from '@/lib/editorial'

export function EditorialSection({ data, movieTitle }: { data: Editorial, movieTitle: string }) {
  const ratingColors = {
    'Must Watch': 'bg-yellow-500 text-black',
    'Worth Watching': 'bg-green-600 text-white',
    'Cult Classic': 'bg-purple-600 text-white',
    'Skip It': 'bg-red-600 text-white'
  }

  return (
    <section className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800 my-8">
      <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-2xl font-bold">Our Take</h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${ratingColors[data.editorRating]}`}>
          {data.editorRating}
        </span>
      </div>
      
      <p className="text-gray-300 leading-relaxed text-lg italic mb-6">
        "{data.editorial}"
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.tags.map(tag => (
          <span key={tag} className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded-md border border-gray-700">
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500 text-right mt-4 pt-4 border-t border-gray-800/50">
        -- HollyFlixHD Editorial Team
      </div>
    </section>
  )
}
