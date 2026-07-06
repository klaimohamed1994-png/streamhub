import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { AdSenseScript, AdStickyBottom } from '@/components/ads';

export const metadata: Metadata = {
  title: 'StreamHub — Watch Movies, TV Shows & Anime',
  description:
    'Stream movies, TV shows, and anime online for free. Powered by VidNest embed API with multiple server support.',
  keywords: ['streaming', 'movies', 'tv shows', 'anime', 'watch online', 'free'],
  openGraph: {
    type: 'website',
    title: 'StreamHub',
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
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Fixed 320×50 sticky banner shown only on mobile */}
        <AdStickyBottom />
      </body>
    </html>
  );
}
