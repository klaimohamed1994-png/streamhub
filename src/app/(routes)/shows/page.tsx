import { getTrendingShows, getPopularShows, getTopRatedShows, getAiringToday } from '@/lib/tmdb';
import { MediaSection } from '@/components/ui/MediaSection';
import { AdBanner, AdInFeed } from '@/components/ads';

export const revalidate = 3600;

export default async function ShowsPage() {
  const [trending, popular, topRated, airing] = await Promise.all([
    getTrendingShows(),
    getPopularShows(),
    getTopRatedShows(),
    getAiringToday(),
  ]);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl font-bold text-white mb-12">
        TV Shows
      </h1>

      <MediaSection title="🔥 Trending This Week" items={trending.results} type="tv" />

      <AdBanner className="my-10" />

      <MediaSection title="📡 Airing Today" items={airing.results} type="tv" />

      <AdInFeed className="my-10" />

      <MediaSection title="⭐ Top Rated" items={topRated.results} type="tv" />

      <AdBanner className="my-10" />

      <MediaSection title="🌟 Popular" items={popular.results} type="tv" />
    </div>
  );
}
