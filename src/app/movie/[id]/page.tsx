import React from "react";
import { Suspense } from "react";
import MovieContent from "./content";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const Loading = <p>Loading...</p>;

  return (
    <Suspense fallback={Loading}>
      <MovieContent id={parseInt(params.id)} />
    </Suspense>
  );
}
