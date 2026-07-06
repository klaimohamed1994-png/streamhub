import { getTrendingAnime, getPopularAnime } from '@/lib/anilist';
import { AnimeSection } from '@/components/ui/AnimeSection';
import { AdBanner } from '@/components/ads';

export const revalidate = 3600;

export default async function AnimePage() {
  const [trending, popular] = await Promise.all([
    getTrendingAnime(),
    getPopularAnime(),
  ]);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl font-bold text-white mb-12">
        Anime
      </h1>

      <AnimeSection title="🔥 Trending Anime" items={trending.media} />

      <AdBanner className="my-10" />

      <AnimeSection title="🌟 All-Time Popular" items={popular.media} />
    </div>
  );
}
