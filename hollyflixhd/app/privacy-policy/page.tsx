export const metadata = {
  title: 'Privacy Policy | HollyFlixHD',
  description: 'Privacy Policy for HollyFlixHD. Learn about how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl text-gray-300">
      <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
      
      <div className="prose prose-invert lg:prose-xl space-y-6">
        <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></p>
        
        <p>
          Welcome to HollyFlixHD ("we", "our", or "us"). We respect your privacy and are committed to protecting it through our compliance with this Privacy Policy. 
          This policy describes the types of information we may collect from you or that you may provide when you visit the website <strong>hollyflixhd.com</strong> and our practices for collecting, using, maintaining, protecting, and disclosing that information.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We do not require you to create an account, log in, or provide direct personal identifying information (such as your name, email address, or phone number) to use HollyFlixHD. However, when you visit our site, we automatically collect certain technical data through third-party services:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>Usage Details:</strong> Information about your interaction with our website, including pages visited, time spent on the site, referring/exit pages, and clickstream data.</li>
          <li><strong>Device Information:</strong> Data regarding your device, browser type, operating system, and IP address (which is anonymized by our analytics providers).</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Cookies and Tracking Technologies</h2>
        <p>
          Our website utilizes "cookies" (small data files placed on your device) and similar tracking technologies to enhance user experience, analyze site traffic, and serve targeted advertisements.
        </p>
        <p><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors engage with our site. Google Analytics uses cookies to collect anonymous traffic data. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Learn more about how Google uses data</a>.</p>
        <p><strong>Google AdSense:</strong> We use Google AdSense to serve advertisements. Google and its third-party vendors use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://myadcenter.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Google's Ads Settings</a>.</p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Third-Party Links & Services</h2>
        <p>
          HollyFlixHD acts as a movie information directory. We utilize the <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">TMDB API</a> to display movie data. 
          We also provide outbound links to third-party search engines or streaming platforms (e.g., via "Watch Online" buttons). We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. Once you leave our site, our Privacy Policy no longer applies.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Children's Privacy</h2>
        <p>
          Our website is a general audience site and is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us, and we will take immediate steps to remove such data from our analytics systems.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Your Choices and Rights</h2>
        <p>
          Depending on your location (such as the GDPR in Europe or CCPA in California), you may have specific rights regarding your data. Since we do not collect direct personal identifying information, your primary method of controlling your data is through cookie management:
        </p>
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li>You can configure your browser to refuse all or some browser cookies or to alert you when cookies are being sent.</li>
          <li>You can use browser extensions to block Google Analytics tracking.</li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Changes to Our Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
        </p>

        <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Contact Information</h2>
        <p>
          If you have any questions, concerns, or comments about this Privacy Policy, please contact us at: <strong>support@hollyflixhd.com</strong>.
        </p>
      </div>
    </div>
  );
}
