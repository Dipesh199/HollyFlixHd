export const metadata = {
  title: 'Terms of Service | HollyFlixHD',
  description: 'Terms of Service and conditions of use for HollyFlixHD.',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
      
      <div className="prose prose-invert lg:prose-xl space-y-6">
        <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
        
        <p>
          Welcome to HollyFlixHD. By accessing or using the <strong>hollyflixhd.com</strong> website (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Nature of the Service</h2>
        <p>
          HollyFlixHD is a movie information database and directory. We provide metadata, plot summaries, cast lists, and trailers for educational and informational purposes. 
        </p>
        <p>
          <strong>Crucial Disclaimer:</strong> HollyFlixHD DOES NOT host, upload, or stream any copyrighted video content or full-length movies on our servers. Any "Watch Online" buttons or external links direct users to third-party platforms. We are not responsible for the legality, accuracy, or content of those external sites.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Intellectual Property and Data Sources</h2>
        <p>
          The movie data, posters, backdrop images, and cast information displayed on HollyFlixHD are provided by the <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">TMDB API</a>. 
          This product uses the TMDB API but is not endorsed or certified by TMDB. All movie titles, posters, and related media are the property of their respective copyright holders.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. User Conduct</h2>
        <p>
          By using our Service, you agree not to:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Use the Service in any way that violates any applicable local, national, or international law or regulation.</li>
          <li>Attempt to scrape, data-mine, or automatically extract data from our website without prior written permission.</li>
          <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Limitation of Liability</h2>
        <p>
          In no event shall HollyFlixHD, nor its developers, partners, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>Your access to or use of or inability to access or use the Service.</li>
          <li>Any conduct or content of any third party on the Service or linked websites.</li>
          <li>Any unauthorized access, use, or alteration of your transmissions or content.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Disclaimer of Warranties</h2>
        <p>
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: <strong>support@hollyflixhd.com</strong>.
        </p>
      </div>
    </div>
  );
}
