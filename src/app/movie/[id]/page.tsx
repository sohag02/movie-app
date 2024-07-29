"use client";
import React, { useEffect, useState } from "react";
import { type MovieDetails } from "@/lib/interfaces";
import Image from "next/image";
import { getImage } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";

export default function MoviePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  useEffect(() => {
    // Define an async function inside useEffect to handle the fetch
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movie?id=${id}`);
        const data = (await res.json()) as MovieDetails;
        setMovie(data); // Assuming the API returns JSON
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    // Call the async function
    fetchMovie().catch(console.error);
  }, [id]); // Dependency array ensures this effect runs only when `id` changes

  return (
    <div>
      {movie ? (
        <div className="relative">
          <Image
            src={getImage(movie.backdrop_path ?? "", "original")}
            alt={movie.title ?? ""}
            width={800}
            height={1200}
            className="h-full w-full object-cover"
          />
          <div className="p-5 absolute inset-0 flex flex-col md:flex-row gap-5 items-start justify-items-start bg-black bg-opacity-50">
            <Image
              src={getImage(movie.poster_path ?? "")}
              alt={movie.title ?? ""}
              width={300}
              height={450}
              className="rounded-lg w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 h-auto"
              layout="responsive"
            />
            <div>
              <p className="mt-4 text-3xl font-bold text-white">
                {movie.title} {movie.release_date?.substring(0, 4)}
              </p>
              <div className="flex flex-row flex-wrap justify-center gap-2 mt-4">
                {movie.genres?.map((genre, index) => (
                  <p key={index} className="text-sm font-semibold text-white">
                    {genre.name},
                  </p>
                ))} &bull;
                <p className="text-sm font-semibold text-white">
                  {formatDuration(movie.runtime??0)}
                </p>
              </div>
                <p className="text-xl">{Math.round(movie.vote_average??0)}/10</p>
                <p>{movie.overview}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
