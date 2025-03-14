import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, ArrowLeft, Eye } from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";
import { MediaType, type Provider, type MediaDetails } from "@/lib/interfaces";
import { getImage } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
import { CastCard } from "@/components/CastCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type Media, Type } from "@/lib/interfaces";
import { MovieCard } from "@/components/movieCard";
import SeasonView from "./seasonView";
// import { createPortal } from "react-dom";
import GallerySection from "./GallerySection";

interface MediaDetailsProps {
  media: MediaDetails;
  providers: Provider[];
  similar: Media[];
}

const MediaDetails: React.FC<MediaDetailsProps> = ({
  media,
  providers,
  similar,
}) => {
  return (
    <div>
      {media ? (
        <div className="relative">
          {/* Background image */}
          <div className="relative h-full w-full">
            <Image
              src={
                getImage(media.backdrop_path ?? "", "original") ??
                "/background.jpg"
              }
              alt={media.title ?? media.name ?? ""}
              width={800}
              height={1200}
              priority
              className="h-full w-full object-cover md:blur-md"
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent"></div>
          </div>

          <div className="absolute inset-0 bg-black bg-opacity-50">
            {/* Back button */}
            <div className="px-4 pt-4">
              <Link href="/">
                <button className="flex items-center text-white transition-colors hover:text-gray-300">
                  <ArrowLeft className="mr-1 h-5 w-5" />
                  <span>Back to Home</span>
                </button>
              </Link>
            </div>

            {/* Media details */}
            <div className="flex flex-col items-start justify-items-start gap-5 px-4 py-5 sm:flex-row">
              <Image
                src={getImage(media.poster_path ?? "") ?? "/poster.jpg"}
                alt={media.title ?? media.name ?? ""}
                width={300}
                height={450}
                className="h-auto w-1/2 rounded-lg sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4"
                priority
              />
              <div>
                <p className="mt-4 text-3xl font-bold text-white">
                  {media.title ?? media.name}
                </p>
                <p></p>
                <p className="text-sm font-semibold text-gray-300">
                  {media.release_date?.substring(0, 4) ??
                    media.first_air_date?.substring(0, 4)}{" "}
                  &bull;{" "}
                  {formatDuration(
                    media.runtime ?? media.episode_run_time![0] ?? 0,
                  )}
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
                {(media.imdb_id ?? media.external_ids?.imdb_id) && (
                  <Link
                    href={`https://www.imdb.com/title/${media.imdb_id ?? media.external_ids?.imdb_id}`}
                    target="_blank"
                  >
                    <p className="mb-2 flex text-xl">
                      <Image
                        src={"/IMDB_Logo.png"}
                        alt={"IMDB logo"}
                        width={50}
                        height={50}
                        className="mr-2 mt-1"
                      />{" "}
                      {Math.round((media.vote_average ?? 0) * 10) / 10}/10
                      <ExternalLink className="ml-2 mt-1 h-5 w-5" />
                    </p>
                  </Link>
                )}
                <p>{media.overview}</p>

                <div className="mt-1 -mb-1">
                  {/* Director For Movies */}
                  {!media.created_by && (
                    <div className="flex flex-col sm:flex-row sm:gap-5">
                      <p className="text-lg font-bold text-white">Director</p>
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
                  )}

                  {/* Created By for TV */}
                  {media.created_by && (
                    <div className="flex flex-col sm:flex-row sm:gap-5">
                      <p className="text-lg font-bold text-white">Created By</p>
                      <div className="flex flex-row flex-wrap justify-start gap-2 text-gray-400">
                        {media.created_by.map((crew, index, array) => (
                          <span key={crew.id} className="text-lg text-gray-200">
                            {crew.name}
                            {index < array.length - 1 && ", "}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Providers */}
                {providers.length > 0 ? (
                  <div>
                    <p className="mt-4 text-lg font-bold text-white">
                      Where to watch?
                    </p>
                    <div className="flex flex-row flex-wrap justify-start gap-2">
                      {providers.map((provider, index) => (
                        <div
                          key={index}
                          className="flex text-2xl font-semibold text-white"
                        >
                          <Image
                            src={
                              getImage(provider.logo_path, "original") ??
                              "/provider.png"
                            }
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

            {/* Seasons and Episodes For TV */}
            {media.seasons && (
              <div className="mx-4 pb-4">
                <p className="pb-2 text-xl font-bold text-white">Seasons</p>
                <SeasonView media={media} />
              </div>
            )}

            {/* Gallery */}
            {media.videos.results.length > 0 && (
              <GallerySection
                videos={media.videos}
                images={media.images}
              />
            )}

            {/* Cast */}
            <div className="pb-4">
              <p className="mx-4 text-xl font-bold text-white">Cast</p>
              <ScrollArea className="whitespace-nowrap">
                <div className="flex w-max gap-4 space-x-2 px-4 py-5">
                  {media.credits.cast
                    .filter((cast) => cast.known_for_department === "Acting")
                    .slice(0, 10)
                    .map((cast) => {
                      return <CastCard cast={cast} key={cast.id} />;
                    })}
                  {media.credits.cast.filter(
                    (cast) => cast.known_for_department === "Acting",
                  ).length > 10 && (
                    <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-blue-500 text-lg text-gray-200">
                      <span className="font-bold">
                        +{" "}
                        {media.credits.cast.filter(
                          (cast) => cast.known_for_department === "Acting",
                        ).length - 10}
                      </span>
                      <span className="font-bold">Others</span>
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              
            </div>

            {/* Similar Content */}
            {similar.length > 0 && (
              <div className="pb-4">
                <p className="mx-4 text-xl font-bold text-white">Similar</p>
                <div className="flex space-x-2 overflow-x-auto px-4 py-5">
                  {similar.map((movie) => (
                    <Link
                      href={
                        movie.first_air_date
                          ? `/tv/${movie.id}`
                          : `/movie/${movie.id}`
                      }
                      key={movie.id}
                      className="w-1/3 flex-shrink-0 md:w-1/6"
                    >
                      <MovieCard
                        name={movie.title ?? movie.name ?? "Unknown"}
                        release={
                          (movie.release_date ?? movie.first_air_date)
                            ?.toString()
                            .slice(0, 4) ?? "Unknown"
                        }
                        poster_url={getImage(movie.poster_path ?? "", "w200")}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
