export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  tagline?: string;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  genres?: { id: number; name: string }[];
  credits?: {
    cast: Actor[];
    crew: Crew[];
  };
  videos?: {
    results: Video[];
  };
  similar?: PaginatedResponse<Movie>;
  'watch/providers'?: WatchProvidersResponse;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority?: number;
}

export interface WatchProviderCountry {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  ads?: WatchProvider[];
  free?: WatchProvider[];
}

export interface WatchProvidersResponse {
  results?: {
    US?: WatchProviderCountry;
    [countryCode: string]: WatchProviderCountry | undefined;
  };
}

export interface Actor {
  id: number;
  name: string;
  original_name: string;
  character: string;
  profile_path: string | null;
  order: number;
  department?: string;
  known_for_department?: string;
}

export interface Crew {
  id: number;
  name: string;
  original_name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
