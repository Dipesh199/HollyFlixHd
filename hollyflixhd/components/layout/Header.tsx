import Link from 'next/link';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link prefetch={false} href="/" className="text-2xl font-bold text-red-600 tracking-wider uppercase font-bebas">
          HollyFlix<span className="text-white">HD</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium items-center mr-4">
          <Link prefetch={false} href="/" className="hover:text-red-500 transition-colors">Home</Link>
          <Link prefetch={false} href="/movies" className="hover:text-red-500 transition-colors">Movies</Link>
          <Link prefetch={false} href="/genre" className="hover:text-red-500 transition-colors">Genre</Link>
          <Link prefetch={false} href="/top-rated" className="hover:text-red-500 transition-colors">Top Rated</Link>
          <Link prefetch={false} href="/trending" className="hover:text-red-500 transition-colors">Trending</Link>
          <Link prefetch={false} href="/blog" className="hover:text-red-500 transition-colors">Blog</Link>
        </nav>
        <div className="flex-1 max-w-xs">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
