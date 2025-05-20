"use client";
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MediaDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import { Link, useTransitionRouter } from "next-view-transitions";
import {
  useEffect,
  useRef,
  Suspense,
  useMemo,
  useCallback,
  useState,
} from "react";
import { MovieCardSkeleton } from "@/components/movieCard";
import React from "react";
import { Filters } from "@/components/filters";
import useSWRInfinite from "swr/infinite";
import { slideInOut } from "@/lib/animation";
import { motion, AnimatePresence } from "framer-motion";

// Fetch function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

const MovieList = () => {
  const { filteredWatchlist } = useWatchlist();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useTransitionRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullStartY, setPullStartY] = useState(0);
  const [pullMoveY, setPullMoveY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  // Define the key generator for SWR Infinite
  const getKey = (
    pageIndex: number,
    previousPageData: MediaDetails[] | null,
  ) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end

    const start = pageIndex * 10;
    const end = start + 10;

    if (start >= filteredWatchlist.length) return null;

    // Return the IDs and media types for this page
    return filteredWatchlist
      .slice(start, end)
      .map((item) => `/api/${item.media_type}?id=${item.movie_id}`);
  };

  // Use SWR Infinite for pagination
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    getKey,
    async (urls) => {
      // Fetch all movies for this page in parallel
      return Promise.all(urls.map((url) => fetcher(url)));
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      persistSize: true,
      dedupingInterval: 60000,
      keepPreviousData: true,
      revalidateOnMount: false,
    },
  );

  // Flatten the data from all pages
  const movies = useMemo(() => {
    return data ? (data.flat() as MediaDetails[]) : [];
  }, [data]);

  // Reset when filteredWatchlist changes
  useEffect(() => {
    void setSize(1);
  }, [filteredWatchlist, setSize]);

  // Intersection Observer for infinite loading
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (
        entries[0]?.isIntersecting &&
        !isValidating &&
        filteredWatchlist.length > size * 10
      ) {
        void setSize(size + 1);
      }
    };

    const options = {
      rootMargin: "200px", // Load more before user reaches the end
    };

    const currentObserver = new IntersectionObserver(callback, options);
    currentObserver.observe(loadMoreRef.current);

    return () => currentObserver.disconnect();
  }, [size, setSize, isValidating, filteredWatchlist.length]);

  // Pull to refresh
  const handleTouchStart = (e: React.TouchEvent) => {
    const touchObj = e.touches?.[0];
    if (touchObj) {
      setPullStartY(touchObj.clientY);
      setPullMoveY(touchObj.clientY);
      setIsPulling(window.scrollY <= 0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isPulling) return;

    const touchObj = e.touches?.[0];
    if (touchObj) {
      setPullMoveY(touchObj.clientY);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    const pullDistance = pullMoveY - pullStartY;

    if (pullDistance > 100) {
      // Activate refresh
      setIsRefreshing(true);
      await mutate();
      setIsRefreshing(false);
    }

    setIsPulling(false);
    setPullStartY(0);
    setPullMoveY(0);
  };

  // Memoize the movie card rendering
  const renderMovieCards = useCallback(() => {
    return movies.map((movie, index) => (
      <a
        href={movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`}
        key={`${movie.id}-${index}`}
        className="h-full w-full"
        onClick={(e) => {
          e.preventDefault();
          router.push(
            movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`,
            {
              onTransitionReady: slideInOut,
            },
          );
        }}
      >
        <MovieCard
          name={movie.title ? movie.title : (movie.name ?? "Unknown")}
          release={
            movie.release_date
              ? movie.release_date.toString().slice(0, 4)
              : movie.first_air_date
                ? movie.first_air_date.toString().slice(0, 4)
                : "Unknown"
          }
          poster_url={getImage(movie.poster_path ?? "", "w200")}
        />
      </a>
    ));
  }, [movies, router]);

  // Determine pull distance for refresh indicator
  const pullDistance = isPulling ? Math.min(pullMoveY - pullStartY, 120) : 0;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="w-full"
    >
      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isRefreshing ? 50 : pullDistance,
              opacity: isRefreshing ? 1 : pullDistance / 100,
            }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center overflow-hidden bg-transparent"
          >
            <motion.div
              animate={{ rotate: isRefreshing ? 360 : 0 }}
              transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-1 pb-20 sm:px-5">
        <Filters />
        <div className="mx-1 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {renderMovieCards()}
          {isValidating &&
            [...Array(10).keys()].map((_, i) => (
                <MovieCardSkeleton key={`skeleton-${i}`} />
            ))}
        </div>
      </div>
      {error && (
        <div className="my-4 text-center text-red-500">
          Error loading data. Please try again.
        </div>
      )}
      <div ref={loadMoreRef} id="load-more" className="h-10"></div>
    </div>
  );
};

export default function HomePage() {
  return (
    <Suspense>
      <MovieList />
    </Suspense>
  );
}
