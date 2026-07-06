'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Film, Tv, Star, Loader2 } from 'lucide-react';
import { tmdbImage } from '@/lib/tmdb';
import { AdBanner, AdRectangle } from '@/components/ads';
import type { TMDBSearchResult } from '@/types';

type Tab = 'all' | 'movie' | 'tv';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<TMDBSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const doSearch = useCallback(async (q: string, p: number) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const endpoint = tab === 'all' ? 'multi' : tab;
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${p}&type=${endpoint}`);
      const data = await res.json();
      setResults(p === 1 ? data.results : (prev: TMDBSearchResult[]) => [...prev, ...data.results]);
      setTotalPages(data.total_pages);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      if (query.trim()) {
        router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
      }
      doSearch(query, 1);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, tab, doSearch, router]);

  const filtered = tab === 'all'
    ? results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv')
    : results;

  // Split results into two halves so we can inject an ad mid-grid
  const firstHalf = filtered.slice(0, Math.ceil(filtered.length / 2));
  const secondHalf = filtered.slice(Math.ceil(filtered.length / 2));

  return (
    <div className="min-h-screen pt-24 px-4 md:px-8 max-w-[1200px] mx-auto">

      {/* ── Search input ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 style={{ fontFamily: 'Sora, sans-serif' }} className="text-3xl font-bold text-white mb-6">
          Search
        </h1>
        <div className="flex items-center gap-3 bg-[#1a1a24] border border-[#2a2a3a] rounded-2xl px-5 py-4 focus-within:border-[#6c63ff] transition-colors max-w-2xl">
          <Search size={20} className="text-[#8888aa] shrink-0" />
          <input
            type="text"
            placeholder="Search movies, TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="bg-transparent text-white text-lg placeholder-[#8888aa] outline-none flex-1"
          />
          {loading && <Loader2 size={18} className="text-[#6c63ff] animate-spin shrink-0" />}
        </div>
      </div>

      {/* Ad: banner below search input */}
      {query.trim() && <AdBanner className="mb-8" />}

      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="flex gap-1 mb-6 bg-[#1a1a24] border border-[#2a2a3a] rounded-xl p-1 w-fit">
          {([['all', 'All'], ['movie', 'Movies'], ['tv', 'TV Shows']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? 'bg-[#6c63ff] text-white'
                  : 'text-[#8888aa] hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty states ─────────────────────────────────────────────────── */}
      {!query.trim() && (
        <div className="text-center py-20 text-[#8888aa]">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Search for movies and TV shows</p>
        </div>
      )}

      {query.trim() && !loading && filtered.length === 0 && (
        <div className="text-center py-20 text-[#8888aa]">
          <p className="text-lg">No results for <span className="text-white">{query}</span></p>
        </div>
      )}

      {/* ── Results — first half ─────────────────────────────────────────── */}
      {firstHalf.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
          {firstHalf.map((item) => (
            <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}

      {/* Ad: rectangle injected mid-results */}
      {filtered.length > 5 && <AdRectangle className="mb-6" />}

      {/* ── Results — second half ────────────────────────────────────────── */}
      {secondHalf.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {secondHalf.map((item) => (
            <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </div>
      )}

      {/* ── Load more ────────────────────────────────────────────────────── */}
      {page < totalPages && (
        <div className="text-center pb-12">
          <button
            onClick={() => {
              const next = page + 1;
              setPage(next);
              doSearch(query, next);
            }}
            disabled={loading}
            className="btn-accent disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

function SearchCard({ item }: { item: TMDBSearchResult }) {
  const title = item.title || item.name || 'Unknown';
  const type = item.media_type as 'movie' | 'tv';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);

  return (
    <Link href={`/${type}/${item.id}`} className="group block">
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[#1a1a24] border border-[#2a2a3a] mb-2 group-hover:border-[#6c63ff]/60 group-hover:-translate-y-1 transition-all duration-300">
        <Image
          src={tmdbImage(item.poster_path, 'w342')}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="200px"
        />

        {/* Type badge */}
        <div className="absolute top-2 left-2">
          <span className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/70 text-white">
            {type === 'movie' ? <Film size={9} /> : <Tv size={9} />}
            {type === 'movie' ? 'Movie' : 'TV'}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 rounded-md px-1.5 py-0.5">
          <Star size={9} className="text-[#f5c518]" fill="currentColor" />
          <span className="text-[10px] font-semibold text-white">{item.vote_average.toFixed(1)}</span>
        </div>
      </div>

      <h3 className="text-sm font-medium text-white line-clamp-2 mb-0.5 group-hover:text-[#8b84ff] transition-colors">
        {title}
      </h3>
      {year && <p className="text-xs text-[#8888aa]">{year}</p>}
    </Link>
  );
}
