import type { AnilistMedia } from '@/types';

const ANILIST_API = 'https://graphql.anilist.co';

const MEDIA_FRAGMENT = `
  fragment MediaFields on Media {
    id
    title { romaji english native }
    description(asHtml: false)
    coverImage { large medium color }
    bannerImage
    episodes
    duration
    status
    averageScore
    genres
    season
    seasonYear
    startDate { year month day }
    endDate { year month day }
    format
    studios(isMain: true) { nodes { id name } }
  }
`;

async function anilistQuery<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(ANILIST_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error('Anilist API error');
  };
  const json = await res.json();
  if (json.errors) {
    console.error('Anilist GraphQL errors');
  }
  return json.data as T;
}

// ─── Get anime by ID ──────────────────────────────────────────────────────────

export async function getAnimeById(id: number): Promise<AnilistMedia> {
  const query = `
    ${MEDIA_FRAGMENT}
    query ($id: Int) {
      Media(id: $id, type: ANIME) { ...MediaFields }
    }
  `;
  const data = await anilistQuery<{ Media: AnilistMedia }>(query, { id });
  return data.Media;
}

// ─── Search anime ─────────────────────────────────────────────────────────────

export async function searchAnime(search: string, page = 1): Promise<{ media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } }> {
  const query = `
    ${MEDIA_FRAGMENT}
    query ($search: String, $page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo { total currentPage hasNextPage }
        media(search: $search, type: ANIME, sort: SEARCH_MATCH) { ...MediaFields }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } } }>(query, { search, page });
  return data.Page;
}

// ─── Trending anime ───────────────────────────────────────────────────────────

export async function getTrendingAnime(page = 1): Promise<{ media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } }> {
  const query = `
    ${MEDIA_FRAGMENT}
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo { total currentPage hasNextPage }
        media(type: ANIME, sort: TRENDING_DESC, status_in: [RELEASING, FINISHED]) { ...MediaFields }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } } }>(query, { page });
  return data.Page;
}

// ─── Popular anime ────────────────────────────────────────────────────────────

export async function getPopularAnime(page = 1): Promise<{ media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } }> {
  const query = `
    ${MEDIA_FRAGMENT}
    query ($page: Int) {
      Page(page: $page, perPage: 20) {
        pageInfo { total currentPage hasNextPage }
        media(type: ANIME, sort: POPULARITY_DESC) { ...MediaFields }
      }
    }
  `;
  const data = await anilistQuery<{ Page: { media: AnilistMedia[]; pageInfo: { total: number; currentPage: number; hasNextPage: boolean } } }>(query, { page });
  return data.Page;
}
