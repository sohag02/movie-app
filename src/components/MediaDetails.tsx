'use client'
import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ExternalLink,
  Eye,
  Heart,
  Calendar,
} from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";
import { MediaType, type Provider, type MediaDetails as MediaDetailsType } from "@/lib/interfaces";
import { getImage } from "@/lib/tmdb";
import { formatDuration } from "@/lib/utils";
// import { CastCard } from "@/components/CastCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { type Media } from "@/lib/interfaces";
import { MovieCard } from "@/components/movieCard";
import SeasonView from "./seasonView";
import GallerySection from "./GallerySection";
import { BackButton } from "./BackButton";

interface MediaDetailsProps {
  media: MediaDetailsType;
  providers: Provider[];
  similar: Media[];
}

const MediaDetails: React.FC<MediaDetailsProps> = ({
  media,
  providers,
  similar,
}) => {
  return (
    <div className="relative">
      {media ? (
        <div className="relative pb-20 md:pb-0">
          {/* Background image */}
          <div className="relative h-[50vh] w-full">
            <Image
              src={
                getImage(media.backdrop_path ?? "", "original") ??
                "/background.jpg"
              }
              alt={media.title ?? media.name ?? ""}
              width={800}
              height={1200}
              priority
              className="h-full w-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>

          {/* Floating back button - mobile */}
          <BackButton />

          {/* Media details - redesigned for mobile */}
          <div className="relative z-10 -mt-64 w-full px-4">
            <div className="flex flex-col md:flex-row md:items-start md:gap-6">
              {/* Poster with floating watchlist button */}
              <div className="relative mx-auto w-2/3 md:mx-0 md:w-1/3 lg:w-1/4">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-xl">
                  <Image
                    src={getImage(media.poster_path ?? "") ?? "/poster.jpg"}
                    alt={media.title ?? media.name ?? ""}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Mobile floating watchlist button */}
                <div className="absolute -bottom-5 right-0 z-20 md:hidden">
                  <WatchlistButton
                    movieId={media.id ?? 0}
                    mediaType={
                      media.first_air_date ? MediaType.TV : MediaType.Movie
                    }
                    isFloating={true}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="mt-8 flex flex-col md:mt-0 md:w-2/3">
                <h1 className="text-center text-3xl font-bold md:text-left md:text-4xl">
                  {media.title ?? media.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 text-sm text-gray-400 md:justify-start">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>
                      {media.release_date?.substring(0, 4) ??
                        media.first_air_date?.substring(0, 4)}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <Eye className="mr-1 h-4 w-4" />
                    <span>
                      {formatDuration(
                        media.runtime ?? media.episode_run_time?.[0] ?? 0,
                      )}
                    </span>
                  </div>

                  {(media.vote_average ?? 0) > 0 && (
                    <div className="flex items-center">
                      <Heart className="mr-1 h-4 w-4 text-red-500" />
                      <span>
                        {Math.round((media.vote_average ?? 0) * 10) / 10}/10
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                  {media.genres?.map((genre, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="rounded-full px-3 py-1"
                    >
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                {/* Desktop Watchlist button */}
                <div className="mt-4 hidden md:block">
                  <WatchlistButton
                    movieId={media.id ?? 0}
                    mediaType={
                      media.first_air_date ? MediaType.TV : MediaType.Movie
                    }
                  />
                </div>

                {/* IMDB button */}
                {(media.imdb_id ?? media.external_ids?.imdb_id) && (
                  <Link
                    href={`https://www.imdb.com/title/${media.imdb_id ?? media.external_ids?.imdb_id}`}
                    target="_blank"
                    className="mt-4 inline-flex items-center self-center md:self-start"
                  >
                    <Image
                      src={"/IMDB_Logo.png"}
                      alt={"IMDB logo"}
                      width={50}
                      height={50}
                      className="mr-2"
                    />
                    <span className="text-xl">
                      {Math.round((media.vote_average ?? 0) * 10) / 10}/10
                    </span>
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Link>
                )}

                {/* Overview */}
                <p className="mt-4 text-center text-sm leading-relaxed md:text-left md:text-base">
                  {media.overview}
                </p>

                {/* Director/Created By */}
                <div className="mt-4">
                  {/* Director For Movies */}
                  {!media.created_by && (
                    <div className="flex flex-col sm:flex-row sm:gap-5">
                      <p className="text-lg font-bold text-white">Director</p>
                      <div className="flex flex-row flex-wrap justify-start gap-2 text-gray-400">
                        {media.credits.crew
                          .filter((crew) => crew.job === "Director")
                          .map((crew, index, array) => (
                            <span
                              key={crew.id}
                              className="text-lg text-gray-200"
                            >
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
              </div>
            </div>

            {/* Rest of content */}
            <div className="mt-8">
              {/* Seasons section for TV shows */}
              {media.seasons && <SeasonView media={media} />}

              {/* Cast section */}
              <div className="mb-5 rounded-lg">
                <p className="mb-4 text-xl font-bold text-white">Cast</p>
                <ScrollArea className="whitespace-nowrap pb-4">
                  <div className="flex w-max space-x-4">
                    {media.credits.cast.map((cast) => (
                      <div
                        key={cast.id}
                        className="flex w-32 flex-col items-center justify-center"
                      >
                        {cast.profile_path ? (
                          <Image
                            src={
                              getImage(cast.profile_path ?? "", "w200") ??
                              "/placeholder.png"
                            }
                            alt={cast.name}
                            width={128}
                            height={128}
                            className="h-32 w-32 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-700">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        <p className="w-full truncate pt-1 text-center text-sm font-medium">
                          {cast.name}
                        </p>
                        <p className="w-full truncate text-center text-xs text-gray-500">
                          {cast.character}
                        </p>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              {/* Gallery section */}
              {media.images &&
                media.videos &&
                media.images.backdrops.length > 0 && (
                  <GallerySection videos={media.videos} images={media.images} />
                )}

              {/* Providers - where to watch */}
              {providers.length > 0 && (
                <div className="mb-5 rounded-lg">
                  <p className="mb-4 text-xl font-bold text-white">
                    Where to Watch
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {providers.map((provider, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center space-y-2"
                      >
                        <div className="overflow-hidden rounded-lg">
                          <Image
                            src={getImage(provider.logo_path, "w200")!}
                            alt={provider.provider_name}
                            width={50}
                            height={50}
                          />
                        </div>
                        <p className="text-center text-xs">
                          {provider.provider_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Similar content */}
              {similar.length > 0 && (
                <div className="mb-20 rounded-lg md:mb-5">
                  <p className="mb-4 text-xl font-bold text-white">
                    Similar {media.first_air_date ? "Shows" : "Movies"}
                  </p>
                  <ScrollArea className="whitespace-nowrap pb-4">
                    <div className="flex w-max space-x-4">
                      {similar.map((item) => (
                        <Link
                          key={item.id}
                          href={
                            item.media_type === MediaType.TV
                              ? `/tv/${item.id}`
                              : `/movie/${item.id}`
                          }
                        >
                          <div className="w-36">
                            <MovieCard
                              name={item.title ?? item.name ?? "Unknown"}
                              release={
                                item.release_date
                                  ? item.release_date.slice(0, 4)
                                  : item.first_air_date
                                    ? item.first_air_date.slice(0, 4)
                                    : "Unknown"
                              }
                              poster_url={getImage(
                                item.poster_path ?? "",
                                "w200",
                              )}
                            />
                          </div>
                        </Link>
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <p className="text-xl">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
