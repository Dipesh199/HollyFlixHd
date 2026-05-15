export const metadata = {
  title: 'Contact Us | HollyFlixHD',
  description: 'Get in touch with the HollyFlixHD team.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <div className="prose prose-invert lg:prose-xl">
        <p>Have a question or feedback? We would love to hear from you!</p>
        <p>Email us at: support@hollyflixhd.com</p>
      </div>
    </div>
  );
}
