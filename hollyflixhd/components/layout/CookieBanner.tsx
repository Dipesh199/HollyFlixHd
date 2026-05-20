"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if the user has already consented
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-gray-800 p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-300 text-center sm:text-left">
        We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. 
        By clicking "Accept", you consent to our use of cookies. Read our{' '}
        <Link href="/privacy-policy" className="text-primary hover:underline font-medium text-red-500">
          Privacy Policy
        </Link>{' '}
        for more info.
      </div>
      <div className="flex shrink-0 gap-3">
        <button
          onClick={handleAccept}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
