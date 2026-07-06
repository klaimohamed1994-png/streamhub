import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Calendar, Globe, Play } from 'lucide-react';
import { getMovie, tmdbImage, tmdbBackdrop } from '@/lib/tmdb';
import { MoviePlayer } from '@/components/player/Player';
import { MediaSection } from '@/components/ui/MediaSection';
import { PlayerSkeleton } from '@/components/ui/Skeletons';
import { AdBanner, AdRectangle, AdInArticle } from '@/components/ads';
import type { TMDBSearchResult } from '@/types';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const movie = await getMovie(Number(params.id));
    return {
      title: `${movie.title} — StreamHub`,
      description: movie.overview,
      openGraph: { images: [tmdbBackdrop(movie.backdrop_path)] },
    };
  } catch {
    return { title: 'Movie — StreamHub' };
  }
}

export default async function MoviePage({ params }: Props) {
  let movie;
  try {
    movie = await getMovie(Number(params.id));
  } catch {
    notFound();
  }

  const year = movie.release_date?.slice(0, 4);
  const runtimeHr = movie.runtime ? Math.floor(movie.runtime / 60) : null;
  const runtimeMin = movie.runtime ? movie.runtime % 60 : null;
  const director = movie.credits?.crew?.find((c) => c.job === 'Director');
  const cast = movie.credits?.cast?.slice(0, 8) ?? [];
  const similar = (movie.recommendations?.results ?? movie.similar?.results ?? []).slice(0, 12) as TMDBSearchResult[];

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <div className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src={tmdbBackdrop(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-40 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Poster */}
          <div className="w-44 md:w-56 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#2a2a3a] shadow-2xl">
              <Image
                src={tmdbImage(movie.poster_path, 'w500')}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-20">
            <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-[#8888aa] italic mb-3 text-sm">{movie.tagline}</p>
            )}

            {/* Meta row */}
            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-sm mb-4">
              <span className="flex items-center gap-1.5 text-[#f5c518] font-semibold">
                <Star size={14} fill="currentColor" />
                {movie.vote_average.toFixed(1)}
                <span className="text-[#8888aa] font-normal">({movie.vote_count.toLocaleString()})</span>
              </span>
              {year && (
                <span className="flex items-center gap-1 text-[#8888aa]">
                  <Calendar size={13} />
                  {year}
                </span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1 text-[#8888aa]">
                  <Clock size={13} />
                  {runtimeHr ? `${runtimeHr}h ` : ''}{runtimeMin}m
                </span>
              )}
              {movie.status && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa]">
                  {movie.status}
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {movie.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs rounded-full bg-[#6c63ff]/15 border border-[#6c63ff]/30 text-[#8b84ff]">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            {movie.overview && (
              <p className="text-[#8888aa] leading-relaxed text-sm md:text-base mb-4 max-w-2xl">
                {movie.overview}
              </p>
            )}

            {director && (
              <p className="text-sm text-[#8888aa]">
                <span className="text-white font-medium">Director:</span> {director.name}
              </p>
            )}
          </div>
        </div>

        {/* Ad: leaderboard above player */}
        <AdBanner className="mb-8" />

        {/* ── Player ──────────────────────────────────────────────────────── */}
        <section className="mb-8">
          <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Play size={18} className="text-[#6c63ff]" />
            Watch Now
          </h2>
          <Suspense fallback={<PlayerSkeleton />}>
            <MoviePlayer tmdbId={movie.id} />
          </Suspense>
        </section>

        {/* Ad: in-article between player and cast */}
        <AdInArticle className="mb-4" />

        {/* ── Cast ────────────────────────────────────────────────────────── */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white mb-4">
              Cast
            </h2>
            <div className="scroll-row">
              {cast.map((member) => (
                <div key={member.id} className="shrink-0 w-28 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-[#1a1a24] border border-[#2a2a3a] mx-auto mb-2">
                    {member.profile_path ? (
                      <Image
                        src={tmdbImage(member.profile_path, 'w185')}
                        alt={member.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">👤</div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-white line-clamp-2">{member.name}</p>
                  <p className="text-xs text-[#8888aa] line-clamp-1">{member.character}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Ad: rectangle before recommendations */}
        <AdRectangle className="mb-8" />

        {/* ── Similar / Recommended ────────────────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mb-12">
            <MediaSection
              title="More Like This"
              items={similar}
              type="movie"
            />
          </section>
        )}
      </div>
    </div>
  );
}
