import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, Star } from 'lucide-react';
import type { TMDBSearchResult } from '@/types';
import { tmdbBackdrop } from '@/lib/tmdb';

interface Props {
  item: TMDBSearchResult;
  type: 'movie' | 'tv';
}

export function HeroBanner({ item, type }: Props) {
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average.toFixed(1);
  const backdrop = tmdbBackdrop(item.backdrop_path, 'original');
  const href = `/${type}/${item.id}`;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden pt-16">
      {/* Background image */}
      <Image
        src={backdrop}
        alt={title}
        fill
        priority
        className="object-cover object-top"
        sizes="100vw"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 pb-16 px-4 md:px-8 lg:px-16 max-w-2xl animate-slide-up">
        {/* Badge */}
        <span className="inline-block bg-[#6c63ff]/20 border border-[#6c63ff]/40 text-[#8b84ff] text-xs font-semibold px-3 py-1 rounded-full mb-4">
          {type === 'movie' ? '🎬 Featured Movie' : '📺 Featured Show'}
        </span>

        {/* Title */}
        <h1
          style={{ fontFamily: 'Sora, sans-serif' }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight"
        >
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4 text-sm text-[#8888aa]">
          <span className="flex items-center gap-1 text-[#f5c518] font-semibold">
            <Star size={14} fill="currentColor" />
            {rating}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#2a2a3a]" />
          {year && <span>{year}</span>}
        </div>

        {/* Overview */}
        {item.overview && (
          <p className="text-[#8888aa] text-sm md:text-base line-clamp-3 mb-6 max-w-lg">
            {item.overview}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href={href}
            className="flex items-center gap-2 bg-[#6c63ff] hover:bg-[#8b84ff] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(108,99,255,0.4)] hover:shadow-[0_0_30px_rgba(108,99,255,0.6)] hover:-translate-y-0.5"
          >
            <Play size={16} fill="currentColor" />
            Watch Now
          </Link>
          <Link
            href={href}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 backdrop-blur-sm"
          >
            <Info size={16} />
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
