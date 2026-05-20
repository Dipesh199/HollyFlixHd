import React from 'react'
import { Editorial } from '@/lib/editorial'
import Link from 'next/link'

export function EditorialSection({ data, movieTitle }: { data: Editorial, movieTitle: string }) {
  const ratingColors = {
    'Must Watch': 'from-amber-400 to-yellow-500 text-black shadow-amber-500/20',
    'Worth Watching': 'from-emerald-500 to-green-600 text-white shadow-emerald-500/20',
    'Cult Classic': 'from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
    'Skip It': 'from-rose-500 to-red-600 text-white shadow-rose-500/20'
  }

  // Parse tone and pace tags if they exist
  const tonePaceTags = data.toneAndPace
    ? data.toneAndPace.split(',').map(s => s.trim())
    : [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-2xl p-6 md:p-8 border border-gray-800 my-8 shadow-2xl">
      {/* Absolute background accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Our Take
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Expert, independent review by the HollyFlixHD Editorial Team</p>
        </div>
        <span className={`self-start sm:self-center px-4.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r ${ratingColors[data.editorRating] || 'from-gray-700 to-gray-800 text-gray-300'} shadow-md`}>
          {data.editorRating}
        </span>
      </div>

      {/* The main editorial review block */}
      <div className="relative mb-8">
        <svg className="absolute -top-4 -left-3 h-10 w-10 text-gray-800 opacity-50 transform -scale-x-100 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 10.014-10.479l.411.929c-4.793.985-6.76 3.766-6.76 7.479h5.318v9.462h-9v-.001zm-13.017 0v-7.391c0-5.704 3.748-9.57 10.016-10.479l.409.929c-4.79.985-6.76 3.766-6.76 7.479h5.32v9.462h-8.985v-.001z" />
        </svg>
        <p className="relative z-10 text-gray-100 leading-relaxed text-lg font-medium italic pl-6 pr-4">
          {data.editorial}
        </p>
      </div>

      {/* Secondary Metadatas (Grid layout) */}
      {(data.toneAndPace || data.targetAudience || data.watchReasons) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-800/80">

          {/* Left Column: Tone, Pace, Audience */}
          <div className="space-y-6">
            {/* Tone and Pace */}
            {data.toneAndPace && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2.5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Tone & Atmosphere
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tonePaceTags.map(tone => (
                    <span key={tone} className="bg-gray-900/60 text-gray-300 text-xs px-2.5 py-1 rounded-md border border-gray-800 capitalize">
                      {tone}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {data.targetAudience && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Ideal For
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed bg-gray-900/40 rounded-xl p-3 border border-gray-800/60">
                  {data.targetAudience}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Why We Recommend */}
          {data.watchReasons && data.watchReasons.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Highlights
              </h3>
              <ul className="space-y-2.5">
                {data.watchReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-gray-300 text-sm">
                    <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

      {/* Similar Movie Recommendations row */}
      {data.similarMovies && data.similarMovies.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-800/80">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            What To Watch Next
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {data.similarMovies.map((simMovie) => (
              <Link
                prefetch={false}
                key={simMovie}
                href={`/search?q=${encodeURIComponent(simMovie)}`}
                className="bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white text-xs px-3.5 py-2 rounded-full border border-gray-800 hover:border-gray-700 transition-all font-medium flex items-center gap-1.5"
              >
                <span>{simMovie}</span>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-gray-800/40">
        {data.tags.map(tag => (
          <span key={tag} className="bg-gray-950 text-gray-400 text-xs px-2.5 py-1 rounded-full border border-gray-800 font-semibold tracking-wide">
            #{tag}
          </span>
        ))}
      </div>
    </section>
  )
}
