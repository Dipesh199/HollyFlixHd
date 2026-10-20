import React from 'react';

interface Props {
  movieTitle?: string;
}

export function EditorialSkeleton({ movieTitle }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-2xl p-6 md:p-8 border border-gray-800 my-8 shadow-2xl">
      {/* Background glow animation */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Header with spinning/processing badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            Our Take
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Expert, independent review by the HollyFlixHD Editorial Team
          </p>
        </div>

        {/* Processing badge with spinner */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 shadow-md">
          <svg
            className="animate-spin h-3.5 w-3.5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider animate-pulse">
            Editorial Team Reviewing...
          </span>
        </div>
      </div>

      {/* Generating description callout */}
      <div className="mb-6 p-4 rounded-xl bg-gray-900/60 border border-gray-800/80 flex items-center gap-3">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
        <p className="text-sm text-gray-300">
          Analyzing cinematography, narrative pacing, and lead performances for{' '}
          <strong className="text-white">{movieTitle || 'this film'}</strong>. Writing review...
        </p>
      </div>

      {/* Shimmering text lines */}
      <div className="space-y-3 mb-8 animate-pulse">
        <div className="h-4 bg-gray-800/80 rounded w-full"></div>
        <div className="h-4 bg-gray-800/80 rounded w-11/12"></div>
        <div className="h-4 bg-gray-800/80 rounded w-4/5"></div>
        <div className="h-4 bg-gray-800/80 rounded w-3/5"></div>
      </div>

      {/* Skeleton metadata grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-800/80 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-800/60 rounded w-1/3"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-850 rounded-md w-20"></div>
            <div className="h-6 bg-gray-850 rounded-md w-24"></div>
            <div className="h-6 bg-gray-850 rounded-md w-16"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-800/60 rounded w-1/3"></div>
          <div className="h-4 bg-gray-850 rounded w-3/4"></div>
          <div className="h-4 bg-gray-850 rounded w-2/3"></div>
        </div>
      </div>
    </section>
  );
}
