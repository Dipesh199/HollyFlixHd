import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HollyFlixHD - Movie Database, Cast, Reviews & Streaming Info",
  description: "Your ultimate destination for Hollywood movies. Discover the latest releases, top-rated classics, full cast details, IMDb ratings, and where to stream online.",
  twitter: {
    site: "@hollyflixhd",
    creator: "@hollyflixhd",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://hollyflixhd.com/#organization",
                  "name": "HollyFlixHD",
                  "url": "https://hollyflixhd.com/",
                  "logo": {
                    "@type": "ImageObject",
                    "url": "https://hollyflixhd.com/icon.svg"
                  },
                  "sameAs": [
                    "https://twitter.com/hollyflixhd"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://hollyflixhd.com/#website",
                  "url": "https://hollyflixhd.com/",
                  "name": "HollyFlixHD",
                  "publisher": {
                    "@id": "https://hollyflixhd.com/#organization"
                  },
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://hollyflixhd.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <SpeedInsights />
      </body>
    </html>
  );
}
