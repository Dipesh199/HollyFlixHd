'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input 
        type="text" 
        placeholder="Search..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#2a2a2a] text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-600"
      />
      <button type="submit" className="absolute left-3 top-2.5 text-gray-400 hover:text-white transition-colors">
        <Search size={18} />
      </button>
    </form>
  );
}
