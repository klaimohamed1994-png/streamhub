import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getTrendingMovies } from '@/lib/tmdb';
import { MediaSection } from '@/components/ui/MediaSection';
import { AdBanner, AdInFeed } from '@/components/ads';

export const revalidate = 3600;

export default async function MoviesPage() {
  const [popular, topRated, nowPlaying, trending] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getTrendingMovies(),
  ]);

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-4xl font-bold text-white mb-12">
        Movies
      </h1>

      <MediaSection title="🔥 Trending This Week" items={trending.results} type="movie" />

      <AdBanner className="my-10" />

      <MediaSection title="🎬 Now Playing" items={nowPlaying.results} type="movie" />

      <AdInFeed className="my-10" />

      <MediaSection title="⭐ Top Rated" items={topRated.results} type="movie" />

      <AdBanner className="my-10" />

      <MediaSection title="🌟 Popular" items={popular.results} type="movie" />
    </div>
  );
}
