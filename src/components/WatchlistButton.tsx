"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { useWatchlist } from "@/components/WatchlistProvider";
import { type MediaType } from "@/lib/interfaces";
import { Bookmark } from "lucide-react";

export default function WatchlistButton({ movieId, mediaType }: { movieId: number, mediaType: MediaType }) {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isWatched,
    updateStatus,
  } = useWatchlist();

  return (
    <div>
      {/* Add to watchlist button */}
      {isInWatchlist(movieId) ? (
        <Button
          className="my-4 w-full cursor-pointer text-xl md:w-1/4 lg:w-1/2 xl:w-1/3"
          onClick={() => removeFromWatchlist(movieId)}
        >
          <Bookmark className="mx-2 h-5 w-5" fill="white" /> In Watchlist
        </Button>
      ) : (
        <Button
          className="my-4 w-full cursor-pointer text-xl md:w-1/4 lg:w-1/2 xl:w-1/3"
          onClick={() => addToWatchlist(movieId, mediaType)}
        >
          <Bookmark className="mx-2 h-5 w-5" /> Add To Watchlist
        </Button>
      )}
      {/* Mark as watched button */}
      {isWatched(movieId) ? (
        <Button
          variant="secondary"
          className="mb-4 w-full cursor-pointer text-xl md:mx-4 md:w-1/4 lg:w-1/2 xl:w-1/3"
          onClick={() => updateStatus(movieId, "not watched")}
        >
          <Check className="mx-2 h-5 w-5" /> Watched
        </Button>
      ) : (
        <Button
          variant="secondary"
          className="mb-4 w-full cursor-pointer text-xl md:mx-4 md:w-1/4 lg:w-1/2 xl:w-1/3"
          onClick={() => updateStatus(movieId, "watched")}
        >
          Mark as watched
        </Button>
      )}
    </div>
  );
}
