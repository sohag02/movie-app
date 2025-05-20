"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Plus } from "lucide-react";
import { useWatchlist } from "@/components/WatchlistProvider";
import { type MediaType } from "@/lib/interfaces";
import { motion } from "framer-motion";

interface WatchlistButtonProps {
  movieId: number;
  mediaType: MediaType;
  isFloating?: boolean;
}

const WatchlistButton = ({
  movieId,
  mediaType,
  isFloating = false,
}: WatchlistButtonProps) => {
  const {
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
  } = useWatchlist();
  const isInList = isInWatchlist(movieId);

  const handleClick = () => {
    if (isInList) {
      void removeFromWatchlist(movieId);
    } else {
      void addToWatchlist(movieId, mediaType);
    }
  };

  if (isFloating) {
    return (
      <motion.button
        whileTap={{ scale: 0.9 }}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg ${
          isInList ? "bg-primary" : "bg-white"
        }`}
        onClick={handleClick}
        aria-label={isInList ? "Remove from watchlist" : "Add to watchlist"}
      >
        <Bookmark
          className={`h-6 w-6 ${isInList ? "fill-white text-white" : "fill-transparent text-black"}`}
        />
      </motion.button>
    );
  }

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        variant={isInList ? "default" : "outline"}
        size="lg"
        className="mt-4 flex items-center gap-2"
        onClick={handleClick}
      >
        {isInList ? (
          <>
            <Bookmark className="h-5 w-5 fill-current" />
            <span>In Watchlist</span>
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            <span>Add to Watchlist</span>
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default WatchlistButton;
