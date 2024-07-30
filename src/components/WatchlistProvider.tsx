'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from "@clerk/nextjs";
import { type Watchlist, type WatchlistMovie } from "@/lib/interfaces";

interface WatchlistContextType {
  watchlist: WatchlistMovie[];
  setWatchlist: React.Dispatch<React.SetStateAction<WatchlistMovie[]>>;
  addToWatchlist: (movieID: number) => Promise<void>;
  removeFromWatchlist: (movieId: number) => Promise<void>;
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
    const movie: WatchlistMovie = {
      id: movieID,
      watchlist_id: null,
      movie_id: movieID,
      user_id: userId?.toString() ?? "",
      status: "active",
      added_at: new Date(),
    }
    setWatchlist((prevWatchlist) => [...prevWatchlist, movie]);
  };

  const removeFromWatchlist = async (movieId: number) => {
    const res = await fetch(`/api/watchlist`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movie_id: movieId,
      }),
    });
    setWatchlist((prevWatchlist) => prevWatchlist.filter((movie) => movie.id !== movieId));
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, setWatchlist, addToWatchlist, removeFromWatchlist }}>
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
