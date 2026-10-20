import React from 'react';

export default function MovieLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Skeleton */}
      <div className="bg-[#111] border-b border-gray-800 py-3">
        <div className="container mx-auto px-4">
          <div className="h-4 bg-gray-800 rounded w-64 animate-pulse"></div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="relative h-[55vh] min-h-[400px] w-full bg-[#141414] animate-pulse">
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row gap-8 items-center md:items-end pb-12 pt-16">
          <div className="w-48 md:w-64 aspect-[2/3] bg-gray-800 rounded-lg shadow-2xl flex-shrink-0"></div>
          <div className="flex-1 space-y-4 w-full">
            <div className="h-10 bg-gray-800 rounded w-3/4"></div>
            <div className="h-5 bg-gray-800/80 rounded w-1/2"></div>
            <div className="flex gap-3">
              <div className="h-8 bg-gray-800 rounded w-24"></div>
              <div className="h-8 bg-gray-800 rounded w-28"></div>
              <div className="h-8 bg-gray-800 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 bg-gray-800 rounded w-40"></div>
            <div className="h-4 bg-gray-800/60 rounded w-full"></div>
            <div className="h-4 bg-gray-800/60 rounded w-5/6"></div>
          </div>
          <div className="h-48 bg-[#1a1a1a] rounded-2xl border border-gray-800 p-6"></div>
        </div>
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-800 rounded w-32"></div>
          <div className="h-64 bg-[#1a1a1a] rounded-lg border border-gray-800"></div>
        </div>
      </div>
    </div>
  );
}
