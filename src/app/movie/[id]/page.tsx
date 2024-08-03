import React from "react";
import Image from "next/image";
import { getImage, getMovie } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import WatchlistButton from "@/components/WatchlistButton";
import { Button } from "@/components/ui/button";

export default async function MoviePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const movie = await getMovie(parseInt(id));

  return (
    <div>
      {movie ? (
        <div className="relative">
          <div className="relative h-full w-full">
            <Image
              src={getImage(movie.backdrop_path ?? "", "original")}
              alt={movie.title ?? ""}
              width={800}
              height={1200}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div className="absolute inset-0 flex flex-col items-start justify-items-start gap-5 bg-black bg-opacity-50 p-5 md:flex-row">
            <Image
              src={getImage(movie.poster_path ?? "")}
              alt={movie.title ?? ""}
              width={300}
              height={450}
              className="h-auto w-1/2 rounded-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
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
                  <div key={index} className="text-sm font-semibold text-white">
                    <Badge variant={"outline"}>{genre.name}</Badge>
                  </div>
                ))}{" "}
              </div>

              {/* Watchlist button */}
              <WatchlistButton movieId={movie.id ?? 0} />

              {/* Mark as watched button : TODO */}
              <Button className="mb-4 w-full cursor-pointer text-xl md:w-1/4 lg:w-1/2 xl:w-1/3">
                Mark as watched
              </Button>

              {/* IMDB button */}
              <Link href={`https://www.imdb.com/title/${movie.imdb_id}`}>
                <p className="mb-2 flex text-xl">
                  <Image
                    src={"/IMDB_Logo.png"}
                    alt={"IMDB logo"}
                    width={50}
                    height={50}
                    className="mr-2 h-auto w-auto"
                  />{" "}
                  {Math.round(movie.vote_average ?? 0)}/10
                  <ExternalLink className="ml-2 h-5 w-5" />
                </p>
              </Link>
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
