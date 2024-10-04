import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";
import { MediaType, type Provider, type MediaDetails } from "@/lib/interfaces";
import { getImage } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
import { CastCard } from "@/components/CastCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface MediaDetailsProps {
  media: MediaDetails;
  providers: Provider[];
}

const MediaDetails: React.FC<MediaDetailsProps> = ({ media, providers }) => {
  return (
    <div>
      {media ? (
        <div className="relative">
          {/* Background image */}
          <div className="relative h-full w-full px-2">
            <Image
              src={getImage(media.backdrop_path ?? "", "original")}
              alt={media.title ?? media.name ?? ""}
              width={800}
              height={1200}
              className="h-full w-full object-cover md:blur-md"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-50">
            {/* Media details */}
            <div className="flex flex-col items-start justify-items-start gap-5 px-4 py-5 sm:flex-row">
              <Image
                src={getImage(media.poster_path ?? "")}
                alt={media.title ?? media.name ?? ""}
                width={300}
                height={450}
                className="h-auto w-1/2 rounded-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
              />
              <div>
                <p className="mt-4 text-3xl font-bold text-white">
                  {media.title ?? media.name}
                </p>
                <p></p>
                <p className="text-sm font-semibold text-gray-300">
                  {media.release_date?.substring(0, 4) ??
                    media.first_air_date?.substring(0, 4)}{" "}
                  &bull; {formatDuration(media.runtime ?? 0)}
                </p>
                <div className="mt-4 flex flex-row flex-wrap justify-start gap-2">
                  {media.genres?.map((genre, index) => (
                    <div
                      key={index}
                      className="text-sm font-semibold text-white"
                    >
                      <Badge variant={"outline"}>{genre.name}</Badge>
                    </div>
                  ))}{" "}
                </div>

                {/* Watchlist button */}
                <WatchlistButton
                  movieId={media.id ?? 0}
                  mediaType={
                    media.first_air_date ? MediaType.TV : MediaType.Movie
                  }
                />

                {/* IMDB button */}
                {media.imdb_id && (
                  <Link href={`https://www.imdb.com/title/${media.imdb_id}`}>
                    <p className="mb-2 flex text-xl">
                      <Image
                        src={"/IMDB_Logo.png"}
                        alt={"IMDB logo"}
                        width={50}
                        height={50}
                        className="mr-2 h-auto w-auto"
                      />{" "}
                      {Math.round(media.vote_average ?? 0)}/10
                      <ExternalLink className="ml-2 h-5 w-5" />
                    </p>
                  </Link>
                )}
                <p>{media.overview}</p>

                {/* Providers */}
                {providers.length > 0 ? (
                  <div>
                    <p className="mt-4 text-xl font-bold text-white">
                      Where to watch?
                    </p>
                    <div className="flex flex-row flex-wrap justify-start gap-2">
                      {providers.map((provider, index) => (
                        <div
                          key={index}
                          className="flex text-2xl font-semibold text-white"
                        >
                          <Image
                            src={getImage(provider.logo_path, "original")}
                            alt={provider.provider_name}
                            width={50}
                            height={50}
                            className="my-2 mr-2 rounded-md"
                          />{" "}
                        </div>
                      ))}{" "}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Cast */}
            <div className="mx-4 pb-4">
              <p className="text-xl font-bold text-white">Cast</p>
              <ScrollArea className="whitespace-nowrap">
                <div className="flex flex-row items-start justify-items-start gap-5 py-5">
                  {media.credits.cast
                    .filter((cast) => cast.known_for_department === "Acting")
                    .slice(0, 10)
                    .map((cast) => {
                    // if (cast.known_for_department === "Acting") {
                      return <CastCard cast={cast} key={cast.id} />;
                    // }
                  })}
                  {media.credits.cast.filter((cast) => cast.known_for_department === "Acting").length > 10 && (
                    <div className="text-lg bg-blue-500 rounded-full w-32 h-32 flex flex-col items-center justify-center text-gray-200">
                      <span className="font-bold">+ {media.credits.cast.filter((cast) => cast.known_for_department === "Acting").length - 10}</span>
                      <span className="font-bold">Others</span>
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Director */}
              <div className="flex flex-col sm:flex-row sm:gap-5">
                <p className="text-xl font-bold text-white">Director</p>
                <div className="flex flex-row flex-wrap justify-start gap-2 text-gray-400">
                  {media.credits.crew
                    .filter((crew) => crew.job === "Director")
                    .map((crew, index, array) => (
                      <span key={crew.id} className="text-lg text-gray-200">
                        {crew.name}
                        {index < array.length - 1 && ", "}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Padding */}
            <div className="h-20"></div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MediaDetails;
