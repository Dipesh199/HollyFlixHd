import Link from 'next/link'

export interface EndingExplainedPostData {
  title: string
  publishedAt: string
  movieSlug: string
  movieTitle: string
  content: {
    heading: string
    body: string
  }[]
}

export default function EndingExplainedPost({ post }: { post: EndingExplainedPostData }) {
  return (
    <article className="max-w-4xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-400 mb-6">Published on {post.publishedAt}</p>
        <Link 
          href={`/movies/${post.movieSlug}`}
          className="inline-block bg-[#1a1a1a] border border-gray-800 hover:border-red-500 text-white px-6 py-2 rounded-full transition-colors"
        >
          View Full Details for {post.movieTitle}
        </Link>
      </header>

      <div className="space-y-10 bg-[#1a1a1a] border border-gray-800 rounded-xl p-8 md:p-12">
        {post.content.map((section, idx) => (
          <section key={idx}>
            <h2 className="text-2xl font-bold mb-4 text-white border-b border-gray-800 pb-2">
              {section.heading}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </article>
  )
}
