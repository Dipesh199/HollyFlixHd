export const metadata = {
  title: 'Terms of Service | HollyFlixHD',
  description: 'Terms of Service for HollyFlixHD.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-invert lg:prose-xl">
        <p>Last updated: [Date]</p>
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing HollyFlixHD, you agree to be bound by these Terms of Service.</p>
        <h2>2. Content Disclaimer</h2>
        <p>All movie data, posters, and backdrops are provided by TMDB. HollyFlixHD does not host any copyrighted streaming files.</p>
      </div>
    </div>
  );
}
