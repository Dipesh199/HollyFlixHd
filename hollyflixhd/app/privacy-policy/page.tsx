export const metadata = {
  title: 'Privacy Policy | HollyFlixHD',
  description: 'Privacy Policy for HollyFlixHD.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-invert lg:prose-xl">
        <p>Last updated: [Date]</p>
        <p>Your privacy is important to us. This privacy policy explains what personal data we collect from you and how we use it.</p>
        <h2>Information Collection</h2>
        <p>We may collect basic analytics and usage data to improve our service.</p>
        <h2>Third-Party Services</h2>
        <p>We use TMDB for movie data. We may also use Google Analytics and third-party advertisement providers.</p>
      </div>
    </div>
  );
}
