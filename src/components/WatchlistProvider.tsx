"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  type Watchlist,
  type WatchlistMedia,
  type WatchlistResponse,
  type MediaType,
} from "@/lib/interfaces";

type MovieStatus = "not watched" | "watched";

interface WatchlistContextType {
  watchlist: WatchlistMedia[];
  setWatchlist: React.Dispatch<React.SetStateAction<WatchlistMedia[]>>;
  filteredWatchlist: WatchlistMedia[];
  addToWatchlist: (movieID: number, mediaType: MediaType) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  updateStatus: (movieId: number, status: MovieStatus) => Promise<void>;
  setMediaTypeFilter: (mediaType: MediaType | null) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined,
);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [watchlist, setWatchlist] = useState<WatchlistMedia[]>([]);
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
      const filtered = watchlist.filter((movie) => movie.media_type === mediaTypeFilter);
      setFilteredWatchlist(filtered);
    } else {
      setFilteredWatchlist(watchlist);
    }
  }, [mediaTypeFilter, watchlist]);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const res = await fetch(`/api/watchlist`);
      const data = (await res.json()) as Watchlist;
      setWatchlist(data.watchlist);
      setFilteredWatchlist(data.watchlist);
    };

    fetchWatchlist().catch(console.error);
  }, []);

  const addToWatchlist = async (mediaID: number, mediaType: MediaType) => {
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
    if (data.success) {
      const movie: WatchlistMedia = {
        id: mediaID,
        watchlist_id: null,
        movie_id: mediaID,
        media_type: mediaType,
        user_id: userId?.toString() ?? "",
        status: "active",
        added_at: new Date(),
      };
      setWatchlist((prevWatchlist) => [movie, ...prevWatchlist]);
    } else {
      console.error(data.message);
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    const res = await fetch(`/api/watchlist?movie_id=${movieId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = (await res.json()) as WatchlistResponse;
    if (data.success) {
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((movie) => movie.movie_id !== movieId),
      );
    } else {
      console.error(data.message);
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.movie_id === movieId);
  };

  const updateStatus = async (movieId: number, status: MovieStatus) => {
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
    if (data.success) {
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((movie) => {
          if (movie.movie_id === movieId) {
            return { ...movie, status: "watched" };
          }
          return movie;
        }),
      );
    } else {
      console.error(data.message);
    }
  };

  const isWatched = (movieId: number) => {
    return watchlist.some(
      (movie) => movie.movie_id === movieId && movie.status === "watched",
    );
  };

  // const filteredWatchlist = watchlist.filter((movie) => {
  //   if (mediaTypeFilter) {
  //     return movie.media_type === mediaTypeFilter;
  //   }
  //   return true;
  // });

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        setWatchlist,
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
