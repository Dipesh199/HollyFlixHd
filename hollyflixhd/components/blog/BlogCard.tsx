import Link from 'next/link'

interface BlogCardProps {
  slug: string
  title: string
  category: string
  publishedAt: string
}

export default function BlogCard({ slug, title, category, publishedAt }: BlogCardProps) {
  const isList = category === 'lists'
  const categoryLabel = isList ? 'List' : 'Ending Explained'
  const categoryColor = isList ? 'bg-blue-600' : 'bg-red-600'

  return (
    <Link href={`/blog/${slug}`} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 hover:border-red-500 transition-colors flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <span className={`${categoryColor} text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider`}>
          {categoryLabel}
        </span>
        <span className="text-gray-500 text-sm">{publishedAt}</span>
      </div>
      <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2 line-clamp-2">
        {title}
      </h3>
      <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-gray-400 group-hover:text-gray-300">
        Read More <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </Link>
  )
}
