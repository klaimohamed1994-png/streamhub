import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { AdSenseScript, AdStickyBottom } from '@/components/ads';
import { Analytics } from "@vercel/analytics/next"
export const metadata: Metadata = {
  title: 'StreamTN — Watch Movies, TV Shows & Anime',
  description:
    'Stream movies, TV shows, and anime online for free. Powered by VidNest embed API with multiple server support.',
  keywords: ['streaming', 'movies', 'tv shows', 'anime', 'watch online', 'free'],
  openGraph: {
    type: 'website',
    title: 'StreamTN',
    description: 'Watch Movies, TV Shows & Anime Online',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense — loaded after interactive, never blocks rendering */}
        <AdSenseScript />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4337784950654838"
     crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-4337784950654838"></meta>
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Analytics/>
        <Footer />
        {/* Fixed 320×50 sticky banner shown only on mobile */}
        <AdStickyBottom />
      </body>
    </html>
  );
}
