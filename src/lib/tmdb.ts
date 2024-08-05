import { type MovieDetails, type SearchResponse } from "./interfaces";

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
  console.log(buildURL(`/search/multi?include_adult=false&language=en-US&page=1&query=${query}`));
  const res = await fetch(
    buildURL(
      `/search/multi?include_adult=false&language=en-US&page=1&query=${query}`,
    ),
  );
  const data = (await res.json()) as SearchResponse;
  return data;
};

export const getMovie = async (id: number): Promise<MovieDetails> => {
  console.log(buildURL(`/movie/${id}?append_to_response=watch/providers`));
  const res = await fetch(buildURL(`/movie/${id}?append_to_response=watch/providers`));
  const data = (await res.json()) as MovieDetails;
  return data;
};

export const getPopularMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/movie/popular?page=1`));
  const data = (await res.json()) as SearchResponse;
  return data;
};

export const getTopRatedMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/top_rated/movie`));
  const data = (await res.json()) as SearchResponse;
  return data;
};

export const getUpcomingMovies = async (): Promise<SearchResponse> => {
  const res = await fetch(buildURL(`/movie/upcoming`));
  const data = (await res.json()) as SearchResponse;
  return data;
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

export const getImage = (path: string, size = "w500"): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
};
