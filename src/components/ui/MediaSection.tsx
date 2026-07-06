import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { TMDBSearchResult } from '@/types';
import { MediaCard } from './MediaCard';

interface Props {
  title: string;
  items: TMDBSearchResult[];
  type: 'movie' | 'tv';
  viewAllHref?: string;
}

export function MediaSection({ title, items, type, viewAllHref }: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ fontFamily: 'Sora, sans-serif' }} className="text-xl font-bold text-white">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm text-[#6c63ff] hover:text-[#8b84ff] transition-colors font-medium"
          >
            View all <ChevronRight size={14} />
          </Link>
        )}
      </div>

      <div className="scroll-row">
        {items.map((item) => (
          <MediaCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </section>
  );
}
