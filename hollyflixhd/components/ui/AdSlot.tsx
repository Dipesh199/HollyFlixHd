export default function AdSlot({ className = '' }: { className?: string }) {
  // Mock ad component. In reality, you'd integrate Google AdSense via NEXT_PUBLIC_ADSENSE_ID.
  return (
    <div className={`w-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-500 text-sm overflow-hidden ${className}`}>
      <span>Advertisement</span>
    </div>
  );
}
