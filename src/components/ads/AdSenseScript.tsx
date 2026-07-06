/**
 * AdSenseScript — loads the AdSense JS library once in <head>.
 *
 * Place this component inside your root layout's <head> section (or directly
 * inside <html> before <body>). It renders a Next.js <Script> tag with
 * strategy="afterInteractive" so it never blocks page rendering.
 *
 * The component is a Server Component — no 'use client' needed.
 */

import Script from 'next/script';

export function AdSenseScript() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;

  // Don't inject the script at all if no publisher ID is configured.
  // This keeps dev/staging environments clean and avoids AdSense errors.
  if (!publisherId || publisherId === 'ca-pub-4337784950654838') {
    return null;
  }

  return (
    <Script
      id="adsense-init"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      // Suppress any console errors from the AdSense loader itself
      
    />
  );
}
