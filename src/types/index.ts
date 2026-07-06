// ─── TMDB Types ───────────────────────────────────────────────────────────────

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: Genre[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  popularity: number;
  adult: boolean;
  videos?: { results: Video[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: TMDBMovie[] };
  recommendations?: { results: TMDBMovie[] };
}

export interface TMDBShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  status: string;
  tagline: string;
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: Season[];
  episode_run_time: number[];
  networks: Network[];
  popularity: number;
  videos?: { results: Video[] };
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  similar?: { results: TMDBShow[] };
  recommendations?: { results: TMDBShow[] };
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  runtime: number | null;
}

export interface SeasonDetails {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episodes: Episode[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type: 'movie' | 'tv' | 'person';
  popularity: number;
}

export interface TMDBSearchResponse {
  results: TMDBSearchResult[];
  total_results: number;
  total_pages: number;
  page: number;
}

export interface TMDBListResponse<T> {
  results: T[];
  total_results: number;
  total_pages: number;
  page: number;
}

// ─── Anilist Types ─────────────────────────────────────────────────────────────

export interface AnilistMedia {
  id: number;
  title: {
    romaji: string;
    english: string | null;
    native: string;
  };
  description: string | null;
  coverImage: {
    large: string;
    medium: string;
    color: string | null;
  };
  bannerImage: string | null;
  episodes: number | null;
  duration: number | null;
  status: string;
  averageScore: number | null;
  genres: string[];
  season: string | null;
  seasonYear: number | null;
  startDate: { year: number; month: number; day: number };
  endDate: { year: number; month: number; day: number } | null;
  format: string;
  studios: { nodes: { id: number; name: string }[] };
}

// ─── Player / Embed Types ──────────────────────────────────────────────────────

export type MediaType = 'movie' | 'tv' | 'anime' | 'animepahe';

export type EmbedServer =
  | 'lamda'
  | 'primesrc'
  | 'sigma'
  | 'alfa'
  | 'beta'
  | 'gama'
  | 'catflix'
  | 'hexa'
  | 'delta';

export interface PlayerControls {
  servericon?: boolean;
  topcaption?: boolean;
  topsettings?: boolean;
  centerseekbackward?: boolean;
  centerplay?: boolean;
  centerseekforward?: boolean;
  timeslider?: boolean;
  mute?: boolean;
  volume?: boolean;
  timegroup?: boolean;
  bottomcaption?: boolean;
  bottomsettings?: boolean;
  pip?: boolean;
  cast?: boolean;
  fullscreen?: boolean;
  prevepisode?: boolean; // TV only
  nextepisode?: boolean; // TV only
}

export interface EmbedOptions {
  server?: EmbedServer;
  startAt?: number;
  progress?: number;
  controls?: PlayerControls;
}

export interface MovieEmbedConfig {
  type: 'movie';
  tmdbId: number;
  options?: EmbedOptions;
}

export interface TVEmbedConfig {
  type: 'tv';
  tmdbId: number;
  season: number;
  episode: number;
  options?: EmbedOptions;
}

export interface AnimeEmbedConfig {
  type: 'anime';
  anilistId: number;
  episode: number;
  subOrDub: 'sub' | 'dub' | string;
  options?: EmbedOptions;
}

export interface AnimePaheEmbedConfig {
  type: 'animepahe';
  anilistId: number;
  episode: number;
  subOrDub: 'sub' | 'dub' | string;
  options?: EmbedOptions;
}

export type EmbedConfig =
  | MovieEmbedConfig
  | TVEmbedConfig
  | AnimeEmbedConfig
  | AnimePaheEmbedConfig;
