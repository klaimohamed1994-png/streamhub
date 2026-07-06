import { NextRequest, NextResponse } from 'next/server';
import { searchMulti, searchMovies, searchShows } from '@/lib/tmdb';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  const type = searchParams.get('type') || 'multi';

  if (!q.trim()) {
    return NextResponse.json({ results: [], total_pages: 0, total_results: 0, page: 1 });
  }

  try {
    let data;
    if (type === 'movie') {
      data = await searchMovies(q, page);
      // Add media_type for uniform handling
      data.results = data.results.map((r) => ({ ...r, media_type: 'movie' as const }));
    } else if (type === 'tv') {
      data = await searchShows(q, page);
      data.results = data.results.map((r) => ({ ...r, media_type: 'tv' as const }));
    } else {
      data = await searchMulti(q, page);
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
