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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (maxPages <= 5) {
      for (let i = 1; i <= maxPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', maxPages);
      } else if (currentPage >= maxPages - 2) {
        pages.push(1, '...', maxPages - 2, maxPages - 1, maxPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', maxPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-12 mb-8">
      {currentPage > 1 && (
        <Link 
          href={getUrl(currentPage - 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Prev
        </Link>
      )}
      
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className="text-gray-400 font-medium px-2">
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        
        return (
          <Link
            key={`page-${page}`}
            href={getUrl(page as number)}
            className={`font-medium px-4 py-2 rounded-md transition-colors ${
              isCurrent 
                ? 'bg-blue-600 text-white' 
                : 'bg-[#e2e8f0] hover:bg-[#cbd5e1] text-gray-800'
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < maxPages && (
        <Link 
          href={getUrl(currentPage + 1)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors"
        >
          Next
        </Link>
      )}
    </div>
  );
}
