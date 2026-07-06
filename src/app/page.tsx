import { Suspense } from 'react';
import { getTrendingMovies, getTrendingShows, getTopRatedMovies, getNowPlayingMovies } from '@/lib/tmdb';
import { getTrendingAnime } from '@/lib/anilist';
import { HeroBanner } from '@/components/ui/HeroBanner';
import { MediaSection } from '@/components/ui/MediaSection';
import { AnimeSection } from '@/components/ui/AnimeSection';
import { SectionSkeleton } from '@/components/ui/Skeletons';
import { AdBanner, AdInFeed } from '@/components/ads';

export const revalidate = 3600; // ISR every hour

export default async function HomePage() {
  const [trendingMovies, trendingShows, topRated, nowPlaying, trendingAnime] =
    await Promise.all([
      getTrendingMovies(),
      getTrendingShows(),
      getTopRatedMovies(),
      getNowPlayingMovies(),
      getTrendingAnime(),
    ]);

  const hero = trendingMovies.results[0];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Suspense fallback={<div className="h-[70vh] skeleton" />}>
        <HeroBanner item={hero} type="movie" />
      </Suspense>

      {/* Sections */}
      <div className="space-y-12 py-12 px-4 md:px-8 max-w-[1600px] mx-auto">

        <Suspense fallback={<SectionSkeleton />}>
          <MediaSection
            title="🔥 Trending Movies"
            items={trendingMovies.results.slice(1)}
            type="movie"
            viewAllHref="/movies"
          />
        </Suspense>

        {/* Ad: leaderboard / mobile banner between first two sections */}
        <AdBanner />

        <Suspense fallback={<SectionSkeleton />}>
          <MediaSection
            title="📺 Trending TV Shows"
            items={trendingShows.results}
            type="tv"
            viewAllHref="/shows"
          />
        </Suspense>

        {/* Ad: native in-feed mid-page */}
        <AdInFeed />

        <Suspense fallback={<SectionSkeleton />}>
          <MediaSection
            title="⭐ Top Rated Movies"
            items={topRated.results}
            type="movie"
            viewAllHref="/movies?sort=top_rated"
          />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <MediaSection
            title="🎬 Now Playing"
            items={nowPlaying.results}
            type="movie"
            viewAllHref="/movies?sort=now_playing"
          />
        </Suspense>

        {/* Ad: leaderboard before anime section */}
        <AdBanner />

        <Suspense fallback={<SectionSkeleton />}>
          <AnimeSection
            title="🌸 Trending Anime"
            items={trendingAnime.media}
            viewAllHref="/anime"
          />
        </Suspense>

      </div>
    </div>
  );
}
