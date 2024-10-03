'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { type Watchlist, type WatchlistMedia, type WatchlistResponse, type MediaType } from "@/lib/interfaces";

type MovieStatus = 'not watched' | 'watched';

interface WatchlistContextType {
  watchlist: WatchlistMedia[];
  setWatchlist: React.Dispatch<React.SetStateAction<WatchlistMedia[]>>;
  addToWatchlist: (movieID: number, mediaType: MediaType) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  updateStatus: (movieId: number, status: MovieStatus) => Promise<void>;
  isWatchlistLoading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistMedia[]>([]);
  const [isWatchlistLoading, setisWatchlistLoading] = useState(true); // Add loading state
  const { userId } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      setisWatchlistLoading(true); // Set loading to true before fetching
      const res = await fetch(`/api/watchlist`);
      const data = await res.json() as Watchlist;
      setWatchlist(data.watchlist);
      setisWatchlistLoading(false); // Set loading to false after fetching
    };

    fetchWatchlist().catch(console.error);
  }, []);

  const addToWatchlist = async (mediaID: number, mediaType: MediaType) => {
    const res = await fetch(`/api/watchlist?movie_id=${mediaID}&media_type=${mediaType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json() as WatchlistResponse;
    if (data.success) {
    const movie: WatchlistMedia = {
      id: mediaID,
      watchlist_id: null,
      movie_id: mediaID,
      media_type: mediaType,
      user_id: userId?.toString() ?? "",
      status: "active",
      display: true,
      added_at: new Date(),
    }
    setWatchlist((prevWatchlist) => [movie, ...prevWatchlist]);
    } else {
      console.error(data.message);
    }
  };

  const removeFromWatchlist = async (movieId: number) => {
    const res = await fetch(`/api/watchlist?movie_id=${movieId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json() as WatchlistResponse;
    if (data.success) {
      setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.movie_id !== movieId));
    } else {
      console.error(data.message);
    }
  };

  const isInWatchlist = (movieId: number) => {
    return watchlist.some((movie) => movie.movie_id === movieId);
  };

  const updateStatus = async (movieId: number, status: MovieStatus) => {
    const res = await fetch(`/api/watchlist?movie_id=${movieId}&status=${status}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json() as WatchlistResponse;
    if (data.success) {
      setWatchlist((prevWatchlist) => prevWatchlist.map((movie) => {
        if (movie.movie_id === movieId) {
          return { ...movie, status: 'watched' };
        }
        return movie;
      }));
    } else {
      console.error(data.message);
    }
  };

  const isWatched = (movieId: number) => {
    return watchlist.some((movie) => movie.movie_id === movieId && movie.status === 'watched');
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, setWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, updateStatus, isWatched, isWatchlistLoading }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
