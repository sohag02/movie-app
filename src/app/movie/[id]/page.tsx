import React from "react";
import { getMovie } from "@/lib/tmdb";
import MediaDetails from "@/components/MediaDetails";
import { getSimilarMovies } from "@/lib/tmdb";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const movie = await getMovie(parseInt(id));
  const providers = movie["watch/providers"]?.results?.IN?.flatrate ?? [];

  const similarMovies = await getSimilarMovies(parseInt(id));

  return (
    <div>
      {movie ? (
        <MediaDetails media={movie} providers={providers} similar={similarMovies.results!} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
