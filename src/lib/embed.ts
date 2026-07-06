import type {
  EmbedConfig,
  EmbedOptions,
  PlayerControls,
  EmbedServer,
} from '@/types';

const BASE = process.env.NEXT_PUBLIC_VIDNEST_BASE_URL || 'https://vidnest.fun';

// ─── Control param helpers ────────────────────────────────────────────────────

const CONTROL_PARAMS: Array<keyof PlayerControls> = [
  'servericon',
  'topcaption',
  'topsettings',
  'centerseekbackward',
  'centerplay',
  'centerseekforward',
  'timeslider',
  'mute',
  'volume',
  'timegroup',
  'bottomcaption',
  'bottomsettings',
  'pip',
  'cast',
  'fullscreen',
  'prevepisode',
  'nextepisode',
];

function buildQueryParams(options?: EmbedOptions): string {
  if (!options) return '';

  const params = new URLSearchParams();

  if (options.server) params.set('server', options.server);
  if (options.startAt !== undefined) params.set('startAt', String(options.startAt));
  if (options.progress !== undefined) params.set('progress', String(options.progress));

  if (options.controls) {
    for (const key of CONTROL_PARAMS) {
      if (options.controls[key] === false) {
        params.set(key, 'hide');
      }
    }
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

// ─── URL builders ─────────────────────────────────────────────────────────────

export function buildMovieEmbedUrl(tmdbId: number, options?: EmbedOptions): string {
  return `${BASE}/movie/${tmdbId}${buildQueryParams(options)}`;
}

export function buildTVEmbedUrl(
  tmdbId: number,
  season: number,
  episode: number,
  options?: EmbedOptions
): string {
  return `${BASE}/tv/${tmdbId}/${season}/${episode}${buildQueryParams(options)}`;
}

export function buildAnimeEmbedUrl(
  anilistId: number,
  episode: number,
  subOrDub: string,
  options?: EmbedOptions
): string {
  return `${BASE}/anime/${anilistId}/${episode}/${subOrDub}${buildQueryParams(options)}`;
}

export function buildAnimePaheEmbedUrl(
  anilistId: number,
  episode: number,
  subOrDub: string,
  options?: EmbedOptions
): string {
  return `${BASE}/animepahe/${anilistId}/${episode}/${subOrDub}${buildQueryParams(options)}`;
}

// ─── Config-based builder ─────────────────────────────────────────────────────

export function buildEmbedUrl(config: EmbedConfig): string {
  switch (config.type) {
    case 'movie':
      return buildMovieEmbedUrl(config.tmdbId, config.options);
    case 'tv':
      return buildTVEmbedUrl(config.tmdbId, config.season, config.episode, config.options);
    case 'anime':
      return buildAnimeEmbedUrl(config.anilistId, config.episode, config.subOrDub, config.options);
    case 'animepahe':
      return buildAnimePaheEmbedUrl(config.anilistId, config.episode, config.subOrDub, config.options);
  }
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const EMBED_SERVERS: EmbedServer[] = [
  'lamda',
  'primesrc',
  'sigma',
  'alfa',
  'beta',
  'gama',
  'catflix',
  'hexa',
  'delta',
];
