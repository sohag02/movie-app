"use client";
import { type MediaDetails, type WatchlistEpisode } from "@/lib/interfaces";
import { useState, useEffect } from "react";
import { type Episode, type SeasonResponse } from "@/lib/interfaces";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useSWR from "swr";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <SelectTrigger className="w-[180px] border-b-4 border-blue-500">
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

      {/* Episodes */}
      <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2 md:grid-cols-4 md:overflow-x-auto">
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
              className="flex flex-col gap-2 md:h-20 md:rounded-sm md:bg-secondary md:p-2"
            >
              <div className="flex flex-row items-center justify-between">
                <div>
                  <span className="text-sm font-bold">
                    E{episode.episode_number}
                  </span>
                  <span> {episode.name}</span>
                </div>
                <div>
                  <Button
                    className={`h-8 w-8 rounded-full ${
                      data.some(
                        (item) =>
                          item.episode_number === episode.episode_number &&
                          item.season_number === episode.season_number,
                      )
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    } px-2 py-1 text-white`}
                    onClick={() => handleClick(episode)}
                  >
                    <Check />
                  </Button>
                </div>
              </div>
              <hr className="md:hidden" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

function EpisodeSkeleton() {
  return (
    <div className="flex flex-col gap-2 md:h-20 md:rounded-sm md:bg-slate-300 md:p-2">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <Skeleton className="h-4 w-5" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-8 rounded-full py-1" />
      </div>
      <Skeleton className="h-px w-full md:hidden" />
    </div>
  );
}

export default SeasonView;
