export default function AdSlot({ className = '' }: { className?: string }) {
  // We rely on Google Auto Ads (injected via layout.tsx) to automatically populate ad spaces.
  // We leave this as an empty div so Auto Ads can potentially hook into it, but without dummy styles.
  return (
    <div className={`ad-container ${className}`}></div>
  );
}
