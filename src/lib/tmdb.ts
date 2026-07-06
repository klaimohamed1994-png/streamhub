import type {
  TMDBMovie,
  TMDBShow,
  SeasonDetails,
  TMDBSearchResponse,
  TMDBListResponse,
  TMDBSearchResult,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

// ─── Image helpers ─────────────────────────────────────────────────────────────

export function tmdbImage(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder-poster.jpg';
  return `${IMAGE_BASE}/${size}${path}`;
}

export function tmdbBackdrop(path: string | null, size: string = 'w1280'): string {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE}/${size}${path}`;
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not set');

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'en-US');
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // cache 1h
  });

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText} (${endpoint})`);
  }

  return res.json() as Promise<T>;
}

// ─── Movies ───────────────────────────────────────────────────────────────────

export async function getMovie(id: number): Promise<TMDBMovie> {
  return tmdbFetch<TMDBMovie>(`/movie/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  });
}

export async function getTrendingMovies(): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/trending/movie/week');
}

export async function getPopularMovies(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/movie/popular', {
    page: String(page),
  });
}

export async function getTopRatedMovies(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/movie/top_rated', {
    page: String(page),
  });
}

export async function getNowPlayingMovies(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/movie/now_playing', {
    page: String(page),
  });
}

// ─── TV Shows ────────────────────────────────────────────────────────────────

export async function getShow(id: number): Promise<TMDBShow> {
  return tmdbFetch<TMDBShow>(`/tv/${id}`, {
    append_to_response: 'videos,credits,similar,recommendations',
  });
}

export async function getSeasonDetails(showId: number, season: number): Promise<SeasonDetails> {
  return tmdbFetch<SeasonDetails>(`/tv/${showId}/season/${season}`);
}

export async function getTrendingShows(): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/trending/tv/week');
}

export async function getPopularShows(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/tv/popular', {
    page: String(page),
  });
}

export async function getTopRatedShows(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/tv/top_rated', {
    page: String(page),
  });
}

export async function getAiringToday(page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/tv/airing_today', {
    page: String(page),
  });
}

// ─── Search ──────────────────────────────────────────────────────────────────

export async function searchMulti(query: string, page = 1): Promise<TMDBSearchResponse> {
  return tmdbFetch<TMDBSearchResponse>('/search/multi', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/search/movie', {
    query,
    page: String(page),
  });
}

export async function searchShows(query: string, page = 1): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/search/tv', {
    query,
    page: String(page),
  });
}

// ─── Discover ─────────────────────────────────────────────────────────────────

export async function discoverMovies(params: Record<string, string> = {}): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/discover/movie', params);
}

export async function discoverShows(params: Record<string, string> = {}): Promise<TMDBListResponse<TMDBSearchResult>> {
  return tmdbFetch<TMDBListResponse<TMDBSearchResult>>('/discover/tv', params);
}
