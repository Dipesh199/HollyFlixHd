import Link from 'next/link'

export interface ListPostData {
  title: string
  publishedAt: string
  movies: {
    rank: number
    movieSlug: string
    movieTitle: string
    reason: string
  }[]
}

export default function ListPost({ post }: { post: ListPostData }) {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-400">Published on {post.publishedAt}</p>
      </header>

      <div className="space-y-12">
        {post.movies.sort((a, b) => b.rank - a.rank).map((movie) => (
          <div key={movie.rank} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 md:p-8 relative">
            <div className="absolute -top-6 -left-6 bg-red-600 text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl font-bold border-4 border-black">
              #{movie.rank}
            </div>
            
            <h2 className="text-2xl font-bold mb-4 mt-2">
              <Link href={`/movies/${movie.movieSlug}`} className="hover:text-red-500 transition-colors">
                {movie.movieTitle}
              </Link>
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              {movie.reason}
            </p>
            
            <div className="mt-6">
              <Link 
                href={`/movies/${movie.movieSlug}`}
                className="inline-flex items-center text-red-500 hover:text-red-400 font-semibold"
              >
                View Full Movie Details <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
