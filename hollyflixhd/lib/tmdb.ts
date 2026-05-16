import { Movie, PaginatedResponse, Actor } from '@/types/movie';

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'dummy_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params,
  });

  const res = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from TMDB: ${res.statusText}`);
  }

  return res.json();
}

export const getPopularMovies = (page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/movie/popular', { page: page.toString() });

export const getTrendingMovies = () => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/trending/movie/week');

export const getTopRatedMovies = (page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/movie/top_rated', { page: page.toString() });

export const getNewReleases = (page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/movie/now_playing', { page: page.toString() });

export const searchMovies = (query: string, page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/search/movie', { query, page: page.toString() });

export const getMovieById = (id: number) => 
  fetchFromTMDB<Movie>(`/movie/${id}`, { append_to_response: 'credits,videos,similar' });

export const getSimilarMovies = (id: number) => 
  fetchFromTMDB<PaginatedResponse<Movie>>(`/movie/${id}/similar`);

export const getMovieBySlug = async (slug: string): Promise<Movie | null> => {
  const parts = slug.split('-');
  const idStr = parts[parts.length - 1];
  const id = parseInt(idStr, 10);
  
  if (isNaN(id)) {
    return null;
  }
  
  try {
    return await getMovieById(id);
  } catch (error) {
    return null;
  }
}

export const getMoviesByGenre = (genreId: number, page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/discover/movie', { with_genres: genreId.toString(), page: page.toString() });

export const getMoviesByYear = (year: string | number, page: number = 1) => 
  fetchFromTMDB<PaginatedResponse<Movie>>('/discover/movie', { primary_release_year: year.toString(), page: page.toString() });

export const getActorById = (actorId: number) => 
  fetchFromTMDB<Actor>(`/person/${actorId}`);

export const getActorMovies = (actorId: number) => 
  fetchFromTMDB<{cast: Movie[]}>(`/person/${actorId}/movie_credits`);

export const getGenres = () => 
  fetchFromTMDB<{genres: {id: number, name: string}[]}>('/genre/movie/list');

