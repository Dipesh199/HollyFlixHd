import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  queryParam?: string;
}

export default function Pagination({ currentPage, totalPages, basePath = '', queryParam = '' }: PaginationProps) {
  // TMDB limits standard pagination to 500 pages maximum
  const maxPages = Math.min(totalPages, 500);
  
  if (maxPages <= 1) return null;

  const getUrl = (page: number) => {
    const searchParams = new URLSearchParams(queryParam);
    searchParams.set('page', page.toString());
    return `${basePath}?${searchParams.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-12 mb-8">
      {currentPage > 1 ? (
        <Link 
          href={getUrl(currentPage - 1)}
          className="bg-[#1a1a1a] hover:bg-red-600 border border-gray-800 hover:border-red-600 text-white font-semibold px-6 py-2 rounded transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="bg-transparent text-gray-600 border border-gray-800 font-semibold px-6 py-2 rounded cursor-not-allowed">
          Previous
        </span>
      )}
      
      <span className="text-gray-400 font-medium">
        Page <span className="text-white">{currentPage}</span> of {maxPages}
      </span>

      {currentPage < maxPages ? (
        <Link 
          href={getUrl(currentPage + 1)}
          className="bg-[#1a1a1a] hover:bg-red-600 border border-gray-800 hover:border-red-600 text-white font-semibold px-6 py-2 rounded transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="bg-transparent text-gray-600 border border-gray-800 font-semibold px-6 py-2 rounded cursor-not-allowed">
          Next
        </span>
      )}
    </div>
  );
}
