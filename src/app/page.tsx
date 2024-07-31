'use client';
import { MovieCard } from "@/components/movieCard";
import { getImage } from "@/lib/tmdb";
import { type MovieDetails } from "@/lib/interfaces";
import { useWatchlist } from "@/components/WatchlistProvider";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { watchlist } = useWatchlist();
  const [movies, setMovies] = useState<MovieDetails[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      // Fetch and enhance the movies
      const enhancedMovies = await Promise.all(
        watchlist.map(async (movie) => {
          const res = await fetch(`/api/movie?id=${movie.movie_id}`);
          const fetchedMovie = (await res.json()) as MovieDetails;
          return fetchedMovie;
        })
      );
      setMovies(enhancedMovies);
    };

    fetchMovies().catch((err) => console.error(err));
  }, [watchlist]);

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
      </div>
    </div>
  );
}
