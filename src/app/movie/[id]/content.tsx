import React from "react";
import { getMovie, getSimilarMovies } from "@/lib/tmdb";
import MediaDetails from "@/components/MediaDetails";

export default async function MovieContent({ id }: { id: number }) {
  const movie = await getMovie(id);
  const providers = movie["watch/providers"]?.results?.IN?.flatrate ?? [];
  const similarMovies = await getSimilarMovies(id);

  return (
    <MediaDetails
      // media={{
      //   ...movie,
      //   external_ids: { imdb_id: movie.imdb_id! },
      //   // videos: { results: [] },
      // }}
      media={movie}
      providers={providers}
      similar={similarMovies.results!}
    />
  );
}
