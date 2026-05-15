const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
  }
};

export const getMoviePosterUrl = (posterPath: string | null, size: string = TMDB_IMAGE_SIZES.poster.large): string => {
  if (!posterPath) return '/images/no-poster.webp';
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

export const getMovieBackdropUrl = (backdropPath: string | null, size: string = TMDB_IMAGE_SIZES.backdrop.large): string => {
  if (!backdropPath) return '/images/no-backdrop.webp';
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
};

export const getActorImageUrl = (profilePath: string | null, size: string = TMDB_IMAGE_SIZES.profile.medium): string => {
  if (!profilePath) return '/images/no-actor.webp';
  return `${TMDB_IMAGE_BASE_URL}/${size}${profilePath}`;
};

export const getOgImageUrl = (backdropPath: string | null): string => {
  return getMovieBackdropUrl(backdropPath, 'w1280');
};
