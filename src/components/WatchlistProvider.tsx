"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  type Watchlist,
  type WatchlistMedia,
  type WatchlistResponse,
  type MediaType,
} from "@/lib/interfaces";
import useSWR from "swr";

type MovieStatus = "not watched" | "watched";

interface WatchlistContextType {
  watchlist: WatchlistMedia[];
  setWatchlist: (newWatchlist:WatchlistMedia[]) => Promise<void>;
  filteredWatchlist: WatchlistMedia[];
  addToWatchlist: (movieID: number, mediaType: MediaType) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  updateStatus: (movieId: number, status: MovieStatus) => Promise<void>;
  setMediaTypeFilter: (mediaType: MediaType | null) => void;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined,
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: watchlist = [], mutate } = useSWR<WatchlistMedia[]>("/api/watchlist", fetcher);
  console.log(watchlist)
  const [filteredWatchlist, setFilteredWatchlist] = useState<WatchlistMedia[]>(
    [],
  );
  const [mediaTypeFilter, setMediaTypeFilter] = useState<MediaType | null>(
    null,
  );
  const { userId } = useAuth();

  // useeffect for filter
  useEffect(() => {
    if (mediaTypeFilter) {
      const filtered = watchlist.filter(
        (movie) => movie.media_type === mediaTypeFilter,
      );
      setFilteredWatchlist(filtered);
    } else {
      setFilteredWatchlist(watchlist);
    }
  }, [mediaTypeFilter, watchlist]);
  // useEffect(() => {
  //   const fetchWatchlist = async () => {
  //     const res = await fetch(`/api/watchlist`);
  //     const data = (await res.json()) as Watchlist;
  //     setWatchlist(data.watchlist);
  //     setFilteredWatchlist(data.watchlist);
  //   };
  //   fetchWatchlist().catch(console.error);
  // }, []);
  const addToWatchlist = async (mediaID: number, mediaType: MediaType) => {
    // Create the new movie object for optimistic update
    const newMovie: WatchlistMedia = {
      id: mediaID,
      watchlist_id: null,
      movie_id: mediaID,
      media_type: mediaType,
      user_id: userId?.toString() ?? "",
      status: "active",
      added_at: new Date(),
    };
    
    // Optimistically update the UI
    await mutate(
      async (currentWatchlist: WatchlistMedia[] = []) => {
        return [newMovie, ...currentWatchlist];
      },
      false
    );
    // Make the actual API request
    try {
      const res = await fetch(
        `/api/watchlist?movie_id=${mediaID}&media_type=${mediaType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = (await res.json()) as WatchlistResponse;
      
      if (!data.success) {
        console.error(data.message);
        // Revert the optimistic update if the API call fails
        await mutate();
      }
    } catch (error) {
      console.error("Failed to add to watchlist:", error);
      // Revert the optimistic update if the API call fails
      await mutate();
    }
  };
  const removeFromWatchlist = async (movieId: number) => {
    // Optimistically update the UI
    await mutate(
      async (currentWatchlist: WatchlistMedia[] = []) => {
        return currentWatchlist.filter((movie) => movie.movie_id !== movieId);
      },
      false
    );
    // Make the actual API request
    try {
      const res = await fetch(`/api/watchlist?movie_id=${movieId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = (await res.json()) as WatchlistResponse;
      
      if (!data.success) {
        console.error(data.message);
        // Revert the optimistic update if the API call fails
        await mutate();
      }
    } catch (error) {
      console.error("Failed to remove from watchlist:", error);
      // Revert the optimistic update if the API call fails
      await mutate();
    }
  };
  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.movie_id === movieId);
  };
  const updateStatus = async (movieId: number, status: MovieStatus) => {
    // Optimistically update the UI
    await mutate(
      async (currentWatchlist: WatchlistMedia[] = []) => {
        return currentWatchlist.map((movie) => {
          if (movie.movie_id === movieId) {
            return { ...movie, status: status === "watched" ? "watched" : "active" };
          }
          return movie;
        });
      },
      false
    );
    // Make the actual API request
    try {
      const res = await fetch(
        `/api/watchlist?movie_id=${movieId}&status=${status}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = (await res.json()) as WatchlistResponse;
      
      if (!data.success) {
        console.error(data.message);
        // Revert the optimistic update if the API call fails
        await mutate();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert the optimistic update if the API call fails
      await mutate();
    }
  };
  const isWatched = (movieId: number) => {
    return watchlist.some(
      (movie) => movie.movie_id === movieId && movie.status === "watched",
    );
  };
  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        setWatchlist: async (newWatchlist) => {
          await mutate(newWatchlist);
        },
        filteredWatchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        updateStatus,
        isWatched,
        setMediaTypeFilter,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};
