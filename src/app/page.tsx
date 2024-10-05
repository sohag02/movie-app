"use client";
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MovieDetails, type MediaDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { MovieCardSkeleton } from "@/components/movieCard";
import React from "react";
import { Filters } from "@/components/filters";

const MovieList = () => {
  const { filteredWatchlist } = useWatchlist();
  const [movies, setMovies] = useState<MediaDetails[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const movieCache = useRef<Map<number, MediaDetails>>(new Map());

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const enhancedMovies = await Promise.all(
        filteredWatchlist
          .slice((page - 1) * 10, page * 10)
          .map(async (movie) => {
            if (movieCache.current.has(movie.movie_id)) {
              return movieCache.current.get(movie.movie_id)!;
            } else {
              const res = await fetch(
                `/api/${movie.media_type}?id=${movie.movie_id}`,
              );
              const fetchedMovie = (await res.json()) as MovieDetails;
              movieCache.current.set(movie.movie_id, fetchedMovie);
              return fetchedMovie;
            }
          }),
      );
      setMovies((prevMovies) => [...prevMovies, ...enhancedMovies]);
      setLoading(false);
    };

    fetchMovies().catch((err) => console.error(err));
  }, [filteredWatchlist, page]);

  useEffect(() => {
    // Reset the page to 1 and clear the movies whenever the filteredWatchlist changes
    setPage(1);
    setMovies([]);
  }, [filteredWatchlist]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (observer.current && document.querySelector("#load-more")) {
      observer.current.observe(document.querySelector("#load-more")!);
    }

    return () => observer.current?.disconnect();
  }, [loading]);

  return (
    <>
      <div className="flex flex-col gap-2 sm:mx-5 md:flex-row">
        <Filters />
        <div className="mx-1 grid grid-cols-3 gap-1 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie, index) => (
            <Link
              href={
                movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`
              }
              key={index}
              className="inline-block h-auto w-auto"
            >
              <MovieCard
                key={movie.id}
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
            </Link>
          ))}
          {loading &&
            [...Array(10).keys()].map((_, i) => <MovieCardSkeleton key={i} />)}
        </div>
      </div>
      <div id="load-more" className="h-10"></div>
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
