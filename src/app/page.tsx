"use client";
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MediaDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import { Link, useTransitionRouter  } from 'next-view-transitions'
import { useEffect, useRef, Suspense, useMemo, useCallback } from "react";
import { MovieCardSkeleton } from "@/components/movieCard";
import React from "react";
import { Filters } from "@/components/filters";
import useSWRInfinite from 'swr/infinite';
import { slideInOut } from "@/lib/animation";

// Fetch function for SWR
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch data');
  return res.json();
};

const MovieList = () => {
  const { filteredWatchlist } = useWatchlist();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useTransitionRouter();

  // Define the key generator for SWR Infinite
  const getKey = (pageIndex: number, previousPageData: MediaDetails[] | null) => {
    if (previousPageData && !previousPageData.length) return null; // reached the end
    
    const start = pageIndex * 10;
    const end = start + 10;
    
    if (start >= filteredWatchlist.length) return null;
    
    // Return the IDs and media types for this page
    return filteredWatchlist.slice(start, end).map(item => 
      `/api/${item.media_type}?id=${item.movie_id}`
    );
  };

  // Use SWR Infinite for pagination
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    getKey,
    async (urls) => {
      // Fetch all movies for this page in parallel
      return Promise.all(
        urls.map(url => fetcher(url))
      );
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      persistSize: true,
      dedupingInterval: 60000,
      keepPreviousData: true,
      revalidateOnMount: false,
    }
  );

  // Flatten the data from all pages
  const movies = useMemo(() => {
    return data ? data.flat() as MediaDetails[] : [];
  }, [data]);

  // Reset when filteredWatchlist changes
  useEffect(() => {
    void setSize(1);
  }, [filteredWatchlist, setSize]);

  // Intersection Observer for infinite loading
  useEffect(() => {
    if (!loadMoreRef.current) return;
    
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && !isValidating && filteredWatchlist.length > size * 10) {
        void setSize(size + 1);
      }
    };

    const options = {
      rootMargin: '200px', // Load more before user reaches the end
    };

    const currentObserver = new IntersectionObserver(callback, options);
    currentObserver.observe(loadMoreRef.current);

    return () => currentObserver.disconnect();
  }, [size, setSize, isValidating, filteredWatchlist.length]);

  // Memoize the movie card rendering
  const renderMovieCards = useCallback(() => {
    return movies.map((movie, index) => (
      <a
        href={movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`}
        key={`${movie.id}-${index}`}
        className="inline-block h-auto w-auto"
        onClick={(e) => {
          e.preventDefault()
          router.push(movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`, {
            onTransitionReady: slideInOut,
          })
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

  return (
    <>
      <div className="flex flex-col gap-2 sm:mx-5 md:flex-row">
        <Filters />
        <div className="mx-1 grid grid-cols-3 gap-1 md:grid-cols-4 lg:grid-cols-5">
          {renderMovieCards()}
          {isValidating &&
            [...Array(10).keys()].map((_, i) => <MovieCardSkeleton key={`skeleton-${i}`} />)}
        </div>
      </div>
      {error && <div className="text-red-500 text-center my-4">Error loading data. Please try again.</div>}
      <div ref={loadMoreRef} id="load-more" className="h-10"></div>
    </>
  );
};

export default function HomePage() {
  return (
    <Suspense>
      <MovieList />
    </Suspense>
  );
}