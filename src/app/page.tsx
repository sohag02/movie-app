'use client';
import { MovieCard } from "@/components/movieCard";
import { getImage, getMovie } from "@/lib/tmdb";
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
          console.log(fetchedMovie.title);
          return fetchedMovie;
        })
      );
      console.log(enhancedMovies);
      setMovies(enhancedMovies);
    };

    fetchMovies().catch((err) => console.error(err));
  }, [watchlist]);

  return (
    <div className="">
      <div className="mx-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map((movie) => (
          <Link href={`/movie/${movie.id}`} key={movie.id}>
            <MovieCard
              key={movie.id}
              name={movie.title ?? "Unknown"}
              release={movie.release_date?.toString() ?? "Unknown"}
              poster_url={getImage(movie.poster_path ?? "/3E53WEZJqP6aM84D8CckXx4pIHw.jpg")}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
