import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-gray-800 py-12 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">HollyFlix<span className="text-red-600">HD</span></h3>
          <p className="text-gray-400 text-sm">
            Your ultimate destination for Hollywood movie information, cast details, plot summaries, and streaming guide.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/movies" className="hover:text-white transition-colors">All Movies</Link></li>
            <li><Link href="/genre" className="hover:text-white transition-colors">Genres</Link></li>
            <li><Link href="/top-rated" className="hover:text-white transition-colors">Top Rated</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Data Source</h4>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae7942f55b2778df2fd5546dcb90cfa42a12255e262c332.svg" alt="TMDB Logo" className="h-12" />
            <p>
              This product uses the TMDB API but is not endorsed or certified by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:underline">TMDB</a>.
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} HollyFlixHD. All rights reserved.
      </div>
    </footer>
  );
}
