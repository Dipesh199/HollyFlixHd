export const metadata = {
  title: 'About Us | HollyFlixHD',
  description: 'Learn more about HollyFlixHD, your ultimate movie information database.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">About HollyFlixHD</h1>
      <div className="prose prose-invert lg:prose-xl">
        <p>Welcome to HollyFlixHD, the ultimate destination for movie lovers.</p>
        <p>Our mission is to provide comprehensive, up-to-date information on the latest Hollywood releases, top-rated classics, and trending films. We leverage the extensive TMDB database to bring you accurate cast lists, plot summaries, ratings, and more.</p>
        <p>Please note that HollyFlixHD is an information platform only. We do not host any copyrighted video content or streams on our servers.</p>
      </div>
    </div>
  );
}
