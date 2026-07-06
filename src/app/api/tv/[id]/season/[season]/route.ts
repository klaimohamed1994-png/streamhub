import { NextRequest, NextResponse } from 'next/server';
import { getSeasonDetails } from '@/lib/tmdb';

interface Params {
  params: { id: string; season: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const data = await getSeasonDetails(Number(params.id), Number(params.season));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Season not found' }, { status: 404 });
  }
}
