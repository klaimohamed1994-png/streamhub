'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Calendar, Play, ChevronDown } from 'lucide-react';
import { tmdbImage, tmdbBackdrop } from '@/lib/tmdb';
import { TVPlayer } from '@/components/player/Player';
import { AdBanner, AdInArticle, AdRectangle } from '@/components/ads';
import type { TMDBShow, SeasonDetails, Episode } from '@/types';

interface Props {
  show: TMDBShow;
}

export function TVShowClient({ show }: Props) {
  const [selectedSeason, setSelectedSeason] = useState(
    show.seasons.find((s) => s.season_number > 0)?.season_number ?? 1
  );
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState<SeasonDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/tv/${show.id}/season/${selectedSeason}`)
      .then((r) => r.json())
      .then((data: SeasonDetails) => {
        setSeasonDetails(data);
        setSelectedEpisode(data.episodes[0]?.episode_number ?? 1);
      })
      .finally(() => setLoading(false));
  }, [show.id, selectedSeason]);

  const currentEpisode = seasonDetails?.episodes.find(
    (e) => e.episode_number === selectedEpisode
  );

  const handlePrev = () => {
    if (selectedEpisode > 1) {
      setSelectedEpisode((p) => p - 1);
    } else if (selectedSeason > 1) {
      setSelectedSeason((s) => s - 1);
    }
  };

  const handleNext = () => {
    const eps = seasonDetails?.episodes ?? [];
    const maxEp = eps[eps.length - 1]?.episode_number ?? 1;
    if (selectedEpisode < maxEp) {
      setSelectedEpisode((p) => p + 1);
    } else if (selectedSeason < show.number_of_seasons) {
      setSelectedSeason((s) => s + 1);
      setSelectedEpisode(1);
    }
  };

  const year = show.first_air_date?.slice(0, 4);
  const cast = show.credits?.cast?.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen pt-16">
      {/* Backdrop */}
      <div className="relative h-[45vh] min-h-[300px] overflow-hidden">
        <Image
          src={tmdbBackdrop(show.backdrop_path, 'original')}
          alt={show.name}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 -mt-36 relative z-10">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          <div className="w-44 md:w-52 shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-[#2a2a3a] shadow-2xl">
              <Image
                src={tmdbImage(show.poster_path, 'w500')}
                alt={show.name}
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </div>

          <div className="flex-1 md:mt-16 text-center md:text-left">
            <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl md:text-4xl font-bold text-white mb-2">
              {show.name}
            </h1>

            <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap text-sm mb-3">
              <span className="flex items-center gap-1.5 text-[#f5c518] font-semibold">
                <Star size={14} fill="currentColor" />
                {show.vote_average.toFixed(1)}
              </span>
              {year && <span className="text-[#8888aa]">{year}</span>}
              <span className="text-[#8888aa]">{show.number_of_seasons} seasons</span>
              <span className="px-2 py-0.5 text-xs rounded-full bg-[#1a1a24] border border-[#2a2a3a] text-[#8888aa]">
                {show.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-3">
              {show.genres.map((g) => (
                <span key={g.id} className="px-3 py-1 text-xs rounded-full bg-[#6c63ff]/15 border border-[#6c63ff]/30 text-[#8b84ff]">
                  {g.name}
                </span>
              ))}
            </div>

            {show.overview && (
              <p className="text-[#8888aa] text-sm leading-relaxed max-w-2xl">{show.overview}</p>
            )}
          </div>
        </div>

        {/* Ad: leaderboard above episode selector */}
        <AdBanner className="mb-6" />

        {/* ── Season selector ──────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <label className="text-sm font-medium text-[#8888aa]">Season:</label>
            <div className="relative">
              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="appearance-none bg-[#1a1a24] border border-[#2a2a3a] text-white text-sm rounded-xl px-4 py-2 pr-8 outline-none cursor-pointer focus:border-[#6c63ff] transition-colors"
              >
                {show.seasons
                  .filter((s) => s.season_number > 0)
                  .map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name}
                    </option>
                  ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8888aa] pointer-events-none" />
            </div>
          </div>
        </section>

        {/* ── Episode list ─────────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
        ) : seasonDetails && (
          <section className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {seasonDetails.episodes.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  isSelected={selectedEpisode === ep.episode_number}
                  onClick={() => setSelectedEpisode(ep.episode_number)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Player ──────────────────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Play size={18} className="text-[#6c63ff]" />
            <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white">
              {currentEpisode
                ? `S${String(selectedSeason).padStart(2, '0')}E${String(selectedEpisode).padStart(2, '0')} — ${currentEpisode.name}`
                : `Season ${selectedSeason}, Episode ${selectedEpisode}`}
            </h2>
          </div>
          <TVPlayer
            tmdbId={show.id}
            season={selectedSeason}
            episode={selectedEpisode}
            onPrevEpisode={handlePrev}
            onNextEpisode={handleNext}
          />
          {currentEpisode?.overview && (
            <p className="text-sm text-[#8888aa] mt-3 leading-relaxed">{currentEpisode.overview}</p>
          )}
        </section>

        {/* Ad: in-article between player and cast */}
        <AdInArticle className="mb-4" />

        {/* ── Cast ────────────────────────────────────────────────────────── */}
        {cast.length > 0 && (
          <section className="mb-12">
            <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white mb-4">Cast</h2>
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

        {/* Ad: rectangle at bottom of page */}
        <AdRectangle className="mb-12" />

      </div>
    </div>
  );
}

function EpisodeCard({
  episode,
  isSelected,
  onClick,
}: {
  episode: Episode;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl overflow-hidden border transition-all duration-200 ${
        isSelected
          ? 'border-[#6c63ff] bg-[#6c63ff]/10 shadow-[0_0_15px_rgba(108,99,255,0.3)]'
          : 'border-[#2a2a3a] bg-[#1a1a24] hover:border-[#6c63ff]/50'
      }`}
    >
      <div className="relative h-16 bg-[#22222f]">
        {episode.still_path ? (
          <Image
            src={tmdbImage(episode.still_path, 'w300')}
            alt={episode.name}
            fill
            className="object-cover"
            sizes="200px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
        )}
        {isSelected && (
          <div className="absolute inset-0 bg-[#6c63ff]/40 flex items-center justify-center">
            <Play size={20} fill="white" className="text-white" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-[#8888aa]">Ep {episode.episode_number}</p>
        <p className="text-xs text-white line-clamp-2 leading-snug">{episode.name}</p>
      </div>
    </button>
  );
}
