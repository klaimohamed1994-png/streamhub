import Image from 'next/image';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import type { TMDBSearchResult } from '@/types';
import { tmdbImage } from '@/lib/tmdb';

interface Props {
  item: TMDBSearchResult;
  type: 'movie' | 'tv';
}

export function MediaCard({ item, type }: Props) {
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average.toFixed(1);
  const poster = tmdbImage(item.poster_path, 'w342');
  const href = `/${type}/${item.id}`;

  return (
    <Link href={href} className="group block w-[150px] sm:w-[160px] md:w-[180px] shrink-0">
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a24] border border-[#2a2a3a] mb-2 transition-all duration-300 group-hover:border-[#6c63ff]/60 group-hover:shadow-[0_0_20px_rgba(108,99,255,0.25)] group-hover:-translate-y-1">
        <Image
          src={poster}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="200px"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#6c63ff] flex items-center justify-center shadow-[0_0_20px_rgba(108,99,255,0.6)]">
            <Play size={18} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-md px-1.5 py-0.5">
          <Star size={10} className="text-[#f5c518]" fill="currentColor" />
          <span className="text-xs font-semibold text-white">{rating}</span>
        </div>
      </div>

      {/* Info */}
      <div>
        <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug mb-0.5 group-hover:text-[#8b84ff] transition-colors">
          {title}
        </h3>
        {year && <p className="text-xs text-[#8888aa]">{year}</p>}
      </div>
    </Link>
  );
}
