import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-red-600 tracking-wider uppercase font-bebas">
          HollyFlix<span className="text-white">HD</span>
        </Link>
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for any movie..." 
              className="w-full bg-[#2a2a2a] text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/movies" className="hover:text-red-500 transition-colors">Movies</Link>
          <Link href="/new-releases" className="hover:text-red-500 transition-colors">New Releases</Link>
          <Link href="/top-rated" className="hover:text-red-500 transition-colors">Top Rated</Link>
          <Link href="/blog" className="hover:text-red-500 transition-colors">Blog</Link>
        </nav>
      </div>
    </header>
  );
}
