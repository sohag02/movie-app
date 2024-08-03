'use client';
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MovieDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import Link from "next/link";
import { useState, useEffect, useRef, Suspense } from "react";
import { MovieCardSkeleton } from "@/components/movieCard";

import React from 'react'

const MovieList = () => {
  const { watchlist } = useWatchlist();
  const [movies, setMovies] = useState<MovieDetails[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      // Fetch and enhance the movies
      const enhancedMovies = await Promise.all(
        watchlist.slice((page - 1) * 10, page * 10).map(async (movie) => {
          const res = await fetch(`/api/movie?id=${movie.movie_id}`);
          const fetchedMovie = (await res.json()) as MovieDetails;
          return fetchedMovie;
        })
      );
      setMovies((prevMovies) => [...prevMovies, ...enhancedMovies]);
      setLoading(false);
    };

    fetchMovies().catch((err) => console.error(err));
  }, [watchlist, page]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (observer.current && document.querySelector('#load-more')) {
      observer.current.observe(document.querySelector('#load-more')!);
    }

    return () => observer.current?.disconnect();
  }, [loading]);

  return (
    <div className="">
      <div className="mx-1 gap-1 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className="inline-block h-auto w-auto">
              <MovieCard
                key={movie.id}
                name={movie.title ?? "Unknown"}
                release={movie.release_date?.toString().slice(0, 4) ?? "Unknown"}
                poster_url={getImage(movie.poster_path ?? "/3E53WEZJqP6aM84D8CckXx4pIHw.jpg", 'w200')}
              />
            </Link>
          ))}
      {loading && [...Array(10).keys()].map((_, i) => <MovieCardSkeleton key={i} />)}
      </div>
      <div id="load-more" className="h-10"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <MovieList />
    </Suspense>
  );
}