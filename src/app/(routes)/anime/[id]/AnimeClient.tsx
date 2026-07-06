'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, Calendar, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimePlayer } from '@/components/player/Player';
import { AdBanner, AdInArticle, AdRectangle } from '@/components/ads';
import type { AnilistMedia } from '@/types';

interface Props {
  anime: AnilistMedia;
}

export function AnimeClient({ anime }: Props) {
  const title = anime.title.english || anime.title.romaji;
  const totalEpisodes = anime.episodes ?? 24;
  const [episode, setEpisode] = useState(1);
  const [subOrDub, setSubOrDub] = useState<'sub' | 'dub'>('sub');

  const EPISODES_PER_PAGE = 24;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(totalEpisodes / EPISODES_PER_PAGE);
  const pageEpisodes = Array.from(
    { length: Math.min(EPISODES_PER_PAGE, totalEpisodes - page * EPISODES_PER_PAGE) },
    (_, i) => page * EPISODES_PER_PAGE + i + 1
  );

  return (
    <div className="min-h-screen pt-16">
      {/* Banner */}
      <div className="relative h-[40vh] min-h-[280px] overflow-hidden">
        {anime.bannerImage ? (
          <Image
            src={anime.bannerImage}
            alt={title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${anime.coverImage.color || '#6c63ff'}44, #0a0a0f)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/50 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-32 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="w-44 md:w-52 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a3a]">
              <Image
                src={anime.coverImage.large}
                alt={title}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </div>

          <div className="flex-1 md:mt-16 text-center md:text-left">
            <div className="mb-2">
              <span className="text-xs font-semibold text-[#6c63ff] uppercase tracking-widest">
                {anime.format}
              </span>
            </div>

            <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl md:text-4xl font-bold text-white mb-1">
              {title}
            </h1>
            {anime.title.romaji !== title && (
              <p className="text-[#8888aa] text-sm mb-2">{anime.title.romaji}</p>
            )}

            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-sm mb-3">
              {anime.averageScore && (
                <span className="flex items-center gap-1.5 text-[#f5c518] font-semibold">
                  <Star size={14} fill="currentColor" />
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
              )}
              {anime.seasonYear && (
                <span className="flex items-center gap-1 text-[#8888aa]">
                  <Calendar size={13} />
                  {anime.season} {anime.seasonYear}
                </span>
              )}
              {anime.episodes && <span className="text-[#8888aa]">{anime.episodes} episodes</span>}
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa]">
                {anime.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
              {anime.genres.map((g) => (
                <span key={g} className="px-3 py-1 text-xs rounded-full bg-[#6c63ff]/15 border border-[#6c63ff]/30 text-[#8b84ff]">
                  {g}
                </span>
              ))}
            </div>

            {anime.description && (
              <p
                className="text-[#8888aa] text-sm leading-relaxed max-w-2xl"
                dangerouslySetInnerHTML={{
                  __html: anime.description.replace(/<br>/g, ' ').replace(/<[^>]*>/g, ''),
                }}
              />
            )}
          </div>
        </div>

        {/* Ad: leaderboard above episode picker */}
        <AdBanner className="mb-6" />

        {/* ── Episode Picker ───────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white">
              Episodes
            </h2>
            {totalPages > 1 && (
              <div className="flex items-center gap-1 ml-auto">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="p-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa] disabled:opacity-40 hover:text-white hover:border-[#6c63ff]/60 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <span className="text-xs text-[#8888aa] px-2">
                  {page * EPISODES_PER_PAGE + 1}–{Math.min((page + 1) * EPISODES_PER_PAGE, totalEpisodes)}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="p-1.5 rounded-lg bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa] disabled:opacity-40 hover:text-white hover:border-[#6c63ff]/60 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {pageEpisodes.map((ep) => (
              <button
                key={ep}
                onClick={() => setEpisode(ep)}
                className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                  episode === ep
                    ? 'bg-[#6c63ff] text-white shadow-[0_0_12px_rgba(108,99,255,0.5)]'
                    : 'bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa] hover:border-[#6c63ff]/50 hover:text-white'
                }`}
              >
                {ep}
              </button>
            ))}
          </div>
        </section>

        {/* ── Player ──────────────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Play size={18} className="text-[#6c63ff]" />
            <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white">
              Episode {episode}
            </h2>
          </div>
          <AnimePlayer
            anilistId={anime.id}
            episode={episode}
            subOrDub={subOrDub}
          />
        </section>

        {/* Ad: in-article after player */}
        <AdInArticle className="mb-4" />

        {/* Ad: rectangle at bottom */}
        <AdRectangle className="mb-12" />

      </div>
    </div>
  );
}
