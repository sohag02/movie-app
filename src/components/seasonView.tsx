"use client";
import { type MediaDetails, type WatchlistEpisode } from "@/lib/interfaces";
import { useState, useEffect } from "react";
import { type Episode, type SeasonResponse } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";
import Image from "next/image";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getImage } from "@/lib/tmdb";

interface SeasonViewProps {
  media: MediaDetails;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SeasonView: React.FC<SeasonViewProps> = ({ media }) => {
  const [season, setSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { data = [], mutate } = useSWR<WatchlistEpisode[]>(
    `/api/episode-watchlist?series_id=${media.id}`,
    fetcher,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "/api/season?id=" + media.id + "&season=" + season,
        );
        const data: SeasonResponse = (await res.json()) as SeasonResponse;
        setEpisodes(data.episodes);
      } catch (error) {
        console.error("Error fetching season data:", error);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [season, media.id]);

  const toggleData = (episode: WatchlistEpisode, isWatched: boolean) => {
    if (isWatched) {
      return data.filter(
        (item) =>
          item.episode_number !== episode.episode_number ||
          item.season_number !== episode.season_number,
      );
    } else {
      return [...data, episode];
    }
  };

  const addToWatchlist = async (episode: WatchlistEpisode) => {
    console.log("adding");
    await fetch(
      `/api/episode-watchlist?series_id=${media.id}&episode_number=${episode.episode_number}&season_number=${episode.season_number}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return [...data, episode];
  };

  const removeFromWatchlist = async (episode: WatchlistEpisode) => {
    console.log("removing");
    await fetch(
      `/api/episode-watchlist?series_id=${media.id}&episode_number=${episode.episode_number}&season_number=${episode.season_number}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return data.filter(
      (item) =>
        item.episode_number !== episode.episode_number ||
        item.season_number !== episode.season_number,
    );
  };

  const handleClick = async (episode: Episode) => {
    // Get current watched status
    const isWatched = data.some(
      (item) =>
        item.episode_number === episode.episode_number &&
        item.season_number === episode.season_number,
    );

    const ep: WatchlistEpisode = {
      episode_number: episode.episode_number,
      season_number: episode.season_number,
      series_id: media.id!,
      user_id: "1",
      id: 1,
      added_at: new Date(),
    };

    const OptimisticData = toggleData(ep, isWatched);

    const toggleResponse = () => {
      return isWatched ? removeFromWatchlist(ep) : addToWatchlist(ep);
    };

    await mutate(toggleResponse(), {
      optimisticData: OptimisticData,
      rollbackOnError: true,
      populateCache: false,
      revalidate: false,
    });
  };

  return (
    <div>
      {/* Seasons Selector */}
      <Select
        defaultValue={season.toString()}
        onValueChange={(value) => setSeason(parseInt(value))}
      >
        <SelectTrigger className="mb-4 hidden w-full max-w-xs border-b-4 border-blue-500 md:block">
          <SelectValue placeholder="Select a season" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {media.seasons
              ?.filter((season) => season.season_number !== 0)
              ?.map((season, index) => (
                <SelectItem key={index} value={season.season_number.toString()}>
                  <SelectLabel>{season.name}</SelectLabel>
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Season tabs for mobile */}
      <div className="mb-4 overflow-x-auto md:hidden">
        <div className="flex min-w-max space-x-2">
          {media.seasons
            ?.filter((s) => s.season_number !== 0)
            ?.map((s) => (
              <button
                key={s.season_number}
                onClick={() => setSeason(s.season_number)}
                className={`whitespace-nowrap px-4 py-2 ${
                  season === s.season_number
                    ? "border-b-2 border-blue-500 font-bold"
                    : "text-gray-400"
                }`}
              >
                Season {s.season_number}
              </button>
            ))}
        </div>
      </div>

      {/* Episodes */}
      <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
        {loading ? (
          <>
            {[...Array(10).keys()].map((_, i) => (
              <EpisodeSkeleton key={i} />
            ))}
          </>
        ) : (
          episodes.map((episode) => (
            <div
              key={episode.episode_number}
              className="mb-4 flex flex-row overflow-hidden shadow-md transition-all hover:shadow-lg md:mb-0 md:flex-col md:rounded-lg md:bg-secondary"
            >
              {/* Mobile view (list view) */}
              <div className="flex w-full flex-row md:hidden">
                <div
                  className="relative flex-shrink-0"
                  style={{ width: "130px" }}
                >
                  <Image
                    src={
                      getImage(episode.still_path, "w500") ??
                      "/episode-placeholder.png"
                    }
                    alt={`${episode.name} thumbnail`}
                    width={130}
                    height={80}
                    className="h-[80px] w-[130px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 bg-black/70 px-1 py-0.5">
                    <span className="text-xs font-medium text-white">
                      {episode.runtime ? `${episode.runtime}m` : ""}
                    </span>
                  </div>
                </div>
                <div className="flex flex-grow flex-col justify-between p-2">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold">
                          {episode.name}
                        </h3>
                        <div className="mb-0.5 text-xs text-gray-400">
                          S{episode.season_number} E{episode.episode_number} •{" "}
                          {episode.air_date
                            ? new Date(episode.air_date).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : ""}
                        </div>
                      </div>
                      <Button
                        className={`ml-2 h-7 w-7 flex-shrink-0 rounded-full ${
                          data.some(
                            (item) =>
                              item.episode_number === episode.episode_number &&
                              item.season_number === episode.season_number,
                          )
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-500/70 hover:bg-gray-600"
                        } flex items-center justify-center p-0 text-white transition-colors`}
                        onClick={() => handleClick(episode)}
                        aria-label={`Mark episode ${episode.episode_number} as ${
                          data.some(
                            (item) =>
                              item.episode_number === episode.episode_number &&
                              item.season_number === episode.season_number,
                          )
                            ? "unwatched"
                            : "watched"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-gray-300/90">
                      {episode.overview || "No description available."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop view (card view) - hidden on mobile */}
              <div className="hidden group md:block hover:cursor-pointer">
                <div className="relative">
                  <Image
                    src={
                      getImage(episode.still_path, "w500") ??
                      "/episode-placeholder.png"
                    }
                    alt={`${episode.name} thumbnail`}
                    width={500}
                    height={280}
                    className="h-40 w-full object-cover sm:h-48 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-500/80 px-2.5 py-0.5 text-xs font-medium text-white">
                        Episode {episode.episode_number}
                      </span>
                      <Button
                        className={`h-8 w-8 rounded-full ${
                          data.some(
                            (item) =>
                              item.episode_number === episode.episode_number &&
                              item.season_number === episode.season_number,
                          )
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-gray-500/70 hover:bg-gray-600"
                        } flex items-center justify-center p-0 text-white transition-colors`}
                        onClick={() => handleClick(episode)}
                        aria-label={`Mark episode ${episode.episode_number} as ${
                          data.some(
                            (item) =>
                              item.episode_number === episode.episode_number &&
                              item.season_number === episode.season_number,
                          )
                            ? "unwatched"
                            : "watched"
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex h-full flex-col p-3">
                  <h3 className="mb-1 line-clamp-1 text-base font-bold">
                    {episode.name}
                  </h3>
                  <p className="line-clamp-3 text-sm text-gray-300/90">
                    {episode.overview || "No description available."}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                    <span>
                      {episode.air_date
                        ? new Date(episode.air_date).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )
                        : ""}
                    </span>
                    <span>
                      {episode.runtime ? `${episode.runtime} min` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Only show divider for mobile view */}
              <hr className="mt-2 md:hidden" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function EpisodeSkeleton() {
  return (
    <>
      {/* Mobile skeleton */}
      <div className="mb-4 flex flex-row md:hidden">
        <Skeleton className="h-[80px] w-[130px]" />
        <div className="flex flex-grow flex-col p-2">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="mb-1 h-3 w-24" />
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      {/* Desktop skeleton */}
      <div className="hidden overflow-hidden rounded-lg bg-secondary/50 shadow-md md:flex md:flex-col">
        <Skeleton className="h-40 w-full sm:h-48" />
        <div className="flex flex-col p-3">
          <Skeleton className="mb-2 h-5 w-3/4" />
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="mt-2 flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SeasonView;
