import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#111] border-t border-gray-800 pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-red-600 mb-4 inline-block">
              HollyFlix<span className="text-white">HD</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Your ultimate destination for Hollywood movies. Discover trending films, top-rated classics, and new releases with full cast details, plot summaries, and more.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/movies" className="hover:text-white transition-colors">All Movies</Link></li>
              <li><Link href="/top-rated" className="hover:text-white transition-colors">Top Rated</Link></li>
              <li><Link href="/new-releases" className="hover:text-white transition-colors">New Releases</Link></li>
              <li><Link href="/trending" className="hover:text-white transition-colors">Trending Now</Link></li>
              <li><Link href="/genre" className="hover:text-white transition-colors">Browse by Genre</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} HollyFlixHD. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
            <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
              <span className="font-bold text-[#01b4e4]">TMDB</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
