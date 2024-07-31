"use client";
import React, { useEffect, useState } from "react";
import { type MovieDetails } from "@/lib/interfaces";
import Image from "next/image";
import { getImage } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useWatchlist } from "@/components/WatchlistProvider";

export default function MoviePage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

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
          <div className="absolute inset-0 flex flex-col items-start justify-items-start gap-5 bg-black bg-opacity-50 p-5 md:flex-row">
            <Image
              src={getImage(movie.poster_path ?? "")}
              alt={movie.title ?? ""}
              width={300}
              height={450}
              className="h-auto w-1/2 rounded-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
              // layout="responsive"
            />
            <div>
              <p className="mt-4 text-3xl font-bold text-white">
                {movie.title}
              </p>
              <p></p>
              <p className="text-sm font-semibold text-gray-300">
                {movie.release_date?.substring(0, 4)} &bull;{" "}
                {formatDuration(movie.runtime ?? 0)}
              </p>
              <div className="mt-4 flex flex-row flex-wrap justify-start gap-2">
                {movie.genres?.map((genre, index) => (
                  <p key={index} className="text-sm font-semibold text-white">
                    <Badge variant={"outline"}>{genre.name}</Badge>
                  </p>
                ))}{" "}
              </div>
              {isInWatchlist(movie.id ?? 0) ? (
                <Button
                  className="my-4 w-full cursor-pointer text-xl md:w-1/4 lg:w-1/2 xl:w-1/3"
                  onClick={() => removeFromWatchlist(movie.id ?? 0)}
                >
                  <Check className="mx-2 h-5 w-5" /> In Watchlist
                </Button>
              ) : (
                <Button
                  className="my-4 w-full cursor-pointer text-xl md:w-1/4 lg:w-1/2 xl:w-1/3"
                  onClick={() => addToWatchlist(movie.id ?? 0)}
                >
                  <Plus className="mx-2 h-5 w-5" /> Add To Watchlist
                </Button>
              )}
              <p className="flex text-xl">
                <Image
                  src={"/IMDB_logo.png"}
                  alt={"IMDB logo"}
                  width={50}
                  height={50}
                  className="h-auto w-auto mr-2"
                />{" "}
                {Math.round(movie.vote_average ?? 0)}/10
              </p>
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
