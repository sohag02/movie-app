"use client";
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MediaDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import Link from "next/link";
import { MovieCardSkeleton } from "@/components/movieCard";
import React, { useEffect, useRef } from "react";

import { useInfiniteQuery } from "@tanstack/react-query";

import { useIntersection } from "@mantine/hooks"

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const MovieList = () => {
  const { watchlist, isWatchlistLoading } = useWatchlist();
 
  const getMovies = async (page: number) => {
    const res = await Promise.all(
      watchlist.slice((page - 1) * 10, page * 10).map(async (movie) => {
        const res = await fetch(
          `/api/${movie.media_type}?id=${movie.movie_id}`,
        );
        const fetchedMovie = (await res.json()) as MediaDetails;
        return fetchedMovie;
      }),
    );
    return res;
  };

  const { data, fetchNextPage, isFetchingNextPage, isSuccess } = useInfiniteQuery({
    queryKey: ["movies"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await getMovies(pageParam);
      return res;
    },
    initialPageParam: 1,
    getNextPageParam: (_, pages) => {
      if (pages.length === 1) {
        return 1;
      }
      return pages.length + 1;
    },
    select: (data) => {
      // Flatten the pages array
      return {
        ...data,
        pages: data.pages.flat(),
      };
    },
  });

  const lastPost = useRef<HTMLDivElement | null>(null);

  const { ref, entry} = useIntersection({
    root: lastPost.current,
    threshold: 1
  })

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    } 
  }, [entry]);


  if (isWatchlistLoading) {
    return <div>Loading watchlist...</div>;
  }

  return (
    <div className="m-2">
      {isSuccess && data.pages.length === 0 && !isFetchingNextPage &&
        <>
          <div className="text-center">
            Nothing Found in Watchlist
          </div>
          {loadBtn()}
        </>
      }
      <div className="mx-1 grid grid-cols-3 gap-1 md:grid-cols-4 lg:grid-cols-5">
        {isSuccess && data.pages.length > 0 && data.pages.map((movie) => (
          <Link
            href={
              movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`
            }
            key={data.pages.indexOf(movie)}
            className="inline-block h-auto w-auto"
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
              poster_url={getImage(
                movie.poster_path ?? "/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
                "w200",
              )}
            />
          </Link>
        ))}
        {isFetchingNextPage &&
          [...Array(10).keys()].map((_, i) => <MovieCardSkeleton key={i} />)}
        {/* <div ref={ref} id="load-more" className="h-10"></div> */}
      </div>
      {loadBtn()}
    </div>
  );

  function loadBtn() {
    return <div ref={ref} id="load-more" className="h-10 bg-transparent">
      
    </div>;
  }
};

export default function HomePage() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <MovieList />
    </QueryClientProvider>
  );
}
