import { type MovieDetails, type SearchResponse } from "./interfaces";

const API_KEY = process.env.TMDB_API_KEY;

const url = `https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&api_key=${API_KEY}&query=`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export const searchMovie = async (query: string): Promise<SearchResponse> => {
  const res = await fetch(url + query);
  const data = (await res.json()) as SearchResponse;
  return data;
};

export const getMovie = async (id: number): Promise<MovieDetails> => {
  const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`);
  const data = (await res.json()) as MovieDetails;
  return data;
};

export const getImage = (path: string, size = "w500"): string => {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
