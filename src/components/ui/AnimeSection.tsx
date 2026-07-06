import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { AnilistMedia } from '@/types';
import { AnimeCard } from './AnimeCard';

interface Props {
  title: string;
  items: AnilistMedia[];
  viewAllHref?: string;
}

export function AnimeSection({ title, items, viewAllHref }: Props) {
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
          <AnimeCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
