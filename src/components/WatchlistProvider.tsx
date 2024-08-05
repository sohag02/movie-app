'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { type Watchlist, type WatchlistMovie, type WatchlistResponse } from "@/lib/interfaces";

type MovieStatus = 'not watched' | 'watched';

interface WatchlistContextType {
  watchlist: WatchlistMovie[];
  setWatchlist: React.Dispatch<React.SetStateAction<WatchlistMovie[]>>;
  addToWatchlist: (movieID: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
  isInWatchlist: (movieId: number) => boolean;
  isWatched: (movieId: number) => boolean;
  updateStatus: (movieId: number, status: MovieStatus) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<WatchlistMovie[]>([]);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchWatchlist = async () => {
      const res = await fetch(`/api/watchlist`);
      const data = await res.json() as Watchlist;
      setWatchlist(data.watchlist);
    };

    fetchWatchlist().catch(console.error);
  }, []);

  const addToWatchlist = async (movieID: number) => {
    const res = await fetch(`/api/watchlist?movie_id=${movieID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json() as WatchlistResponse;
    if (data.success) {
    const movie: WatchlistMovie = {
      id: movieID,
      watchlist_id: null,
      movie_id: movieID,
      user_id: userId?.toString() ?? "",
      status: "active",
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
    <WatchlistContext.Provider value={{ watchlist, setWatchlist, addToWatchlist, removeFromWatchlist, isInWatchlist, updateStatus, isWatched }}>
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
