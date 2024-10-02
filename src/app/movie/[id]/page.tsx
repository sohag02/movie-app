import React from "react";
import { getMovie } from "@/lib/tmdb";
import MediaDetails from "@/components/MediaDetails";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const movie = await getMovie(parseInt(id));
  const providers = movie["watch/providers"]?.results?.IN?.flatrate ?? [];

  return (
    <div>
      {movie ? (
        <MediaDetails media={movie} providers={providers} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
