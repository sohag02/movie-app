import React from "react";
import { MovieCard } from "@/components/movieCard";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "@/lib/tmdb";
import { getImage } from "@/lib/tmdb";
import { type Media } from "@/lib/interfaces";
import Link from "next/link";
import { RectangleVertical } from "lucide-react";

interface MovieListProps {
  list: Media[];
  title?: string;
}

const MovieList: React.FC<MovieListProps> = ({ list, title }) => {
  if (list.length === 0) return null;
  return (
    <div className="p-2">
      {title && (
        <h1 className="flex my-2 text-2xl font-bold">
          <RectangleVertical fill="#FFC107" stroke="#FFC107" className="h-6 w-6 mt-1" /> 
					{title}
        </h1>
      )}
      <div className="flex space-x-2 overflow-x-auto">
        {list.map((movie) => (
          <div key={movie.id} className="w-1/3 flex-shrink-0 md:w-1/6">
            <Link href={`/movie/${movie.id}`}>
              <MovieCard
                key={movie.id}
                name={movie.title ?? "Unknown"}
                release={
                  movie.release_date?.toString().slice(0, 4) ?? "Unknown"
                }
                poster_url={getImage(
                  movie.poster_path ?? "/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
                  "w200",
                )}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default async function Explore() {
  const popularMovies = await getPopularMovies();
  const topRatedMovies = await getTopRatedMovies();
  const upcomingMovies = await getUpcomingMovies();

  return (
    <div className="">
      {/* Popular Movies */}
      <MovieList list={popularMovies.results ?? []} title="Popular Movies" />

      {/* Top Rated Movies */}
      <MovieList list={topRatedMovies.results ?? []} title="Top Rated Movies" />

      {/* Upcoming Movies */}
      <MovieList list={upcomingMovies.results ?? []} title="Upcoming Movies" />
    </div>
  );
}
