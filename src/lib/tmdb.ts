
import { type SeriesDetails, type MovieDetails, type SearchResponse, type SeasonResponse } from "./interfaces";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = `https://api.themoviedb.org/3`;

const buildURL = (path: string): string => {
  if (path.includes("?")) {
    return `${BASE_URL}${path}&api_key=${API_KEY}`;
  } else {
    return `${BASE_URL}${path}?api_key=${API_KEY}`;
  }
};

export const searchMovie = async (query: string): Promise<SearchResponse> => {
  const res = await fetch(
    buildURL(
      `/search/multi?include_adult=false&language=en-US&page=1&query=${query}`,
    ),
  );
  return (await res.json()) as SearchResponse;
};

export const getMovie = async (id: number): Promise<MovieDetails> => {
  const res = await fetch(buildURL(`/movie/${id}?append_to_response=watch/providers,credits,videos,images&include_image_language=en,null`));
  return (await res.json()) as MovieDetails;
};

export const getSeries = async (id: number): Promise<SeriesDetails> => {
  const res = await fetch(buildURL(`/tv/${id}?append_to_response=watch/providers,credits,external_ids,videos,images&include_image_language=en,null`));
  return (await res.json()) as SeriesDetails;
};

export const getPopularMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/movie/popular?page=1`));
  return (await res.json()) as SearchResponse;
};

export const getTopRatedMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/top_rated/movie`));
  return (await res.json()) as SearchResponse;
};

export const getUpcomingMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/movie/upcoming`));
  return (await res.json()) as SearchResponse;
};

export interface ProviderResponse {
  IN?: {
    link?: string;
    rent?: Provider[];
    flatrate?: Provider[];
    buy?: Provider[];
  };
}

export interface Provider {
  logo_path?: string;
  provider_id?: number;
  provider_name?: string;
  display_priority?: number;
}

export const getProviders = async (
  movie_id: number,
): Promise<Provider[]> => {
  const res = await fetch(buildURL(`/movie/${movie_id}/watch/providers`));
  const data = await res.json() as ProviderResponse;
  return data.IN?.flatrate ?? [];
};

export const getSimilarMovies = async (movie_id: number): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/movie/${movie_id}/recommendations`));
  return (await res.json()) as SearchResponse;
};

export const getSimilarSeries = async (series_id: number): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/tv/${series_id}/recommendations`));
  return (await res.json()) as SearchResponse;
};

export const getEpisodes = async (series_id: number, season_number: number): Promise<SeasonResponse> => {
  const res = await fetch(buildURL(`/tv/${series_id}/season/${season_number}`));
  return (await res.json()) as SeasonResponse;
};

export const getImage = (path: string, size = "w500"): string | null => {
  // if (path === "") return null;
  return `https://image.tmdb.org/t/p/${size}${path}`; // example https://image.tmdb.org/t/p/w500/r6q3u0x0q0u7p0p7s0s7t0t7.jpg
};
